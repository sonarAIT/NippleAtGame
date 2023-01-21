const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../models/index");
const users = require("./users");

// file uploader setting
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (
            ext !== ".png" &&
            ext !== ".jpg" &&
            ext !== ".gif" &&
            ext !== ".jpeg"
        ) {
            return callback(null, false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
});

function getRedirectFunctionOnLocationPageRequestMiss(req, res) {
    if (!users.isLoggined(req)) {
        return () => res.redirect("/users/login");
    }

    if (req.session.image === undefined) {
        return () => res.redirect("/nipple/upload");
    }

    return false;
}

function LocationPageResponder(req, res, pageDifference) {
    const data = {
        err: null,
        photoPath: req.session.image.path,
        pageDifference: pageDifference,
    };

    res.render("nipple/location", data);
}

function getRedirectFunctionOnNippleDataMiss(req, res, pageDifference) {
    if (!users.isLoggined(req)) {
        return () => res.redirect("/users/login");
    }

    if (req.session.image === undefined) {
        return () => res.redirect("/nipple/upload");
    }

    if (
        req.body.leftNippleX === "" ||
        req.body.leftNippleY === "" ||
        req.body.rightNippleX === "" ||
        req.body.rightNippleY === ""
    ) {
        // このエラーが発生している時点で新規投稿であることは確約されている。
        const pageDifference = {
            nipple: {
                leftX: null,
                leftY: null,
                rightX: null,
                rightY: null,
            },
            pageName: "乳首新規投稿",
            method: "POST",
        };
        const data = {
            err: "両乳首を入力してください。",
            photoPath: req.session.image.path,
            pageDifference: pageDifference,
        };
        return () => res.render("nipple/location", data);
    }

    return false;
}

router.get("/upload", (req, res, next) => {
    if (!users.isLoggined(req)) {
        res.redirect("/users/login");
        return;
    }

    const data = {
        err: null,
    };

    res.render("nipple/upload", data);
});

router.post("/upload", upload.single("image"), function (req, res) {
    if (!users.isLoggined(req)) {
        res.redirect("/users/login");
        return;
    }

    if (req.file === undefined) {
        const data = {
            err: "画像ファイル以外はアップロードできません。",
        };
        res.render("nipple/upload", data);
        return;
    }

    const filePath = req.file.path.replace("public", "");

    db.Image.create({
        path: filePath,
        userID: req.session.login.id,
    })
        .then((image) => {
            req.session.image = image;
            res.redirect("/nipple/location");
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get("/location", (req, res, next) => {
    const redirectFunc = getRedirectFunctionOnLocationPageRequestMiss(req, res);
    if (redirectFunc) {
        redirectFunc();
        return;
    }

    const pageDifference = {
        nipple: {
            leftX: null,
            leftY: null,
            rightX: null,
            rightY: null,
        },
        pageName: "乳首新規投稿",
        postLink: "/nipple/location",
    };
    LocationPageResponder(req, res, pageDifference);
});

router.get("/location/update", (req, res, next) => {
    const redirectFunc = getRedirectFunctionOnLocationPageRequestMiss(req, res);
    if (redirectFunc) {
        redirectFunc();
        return;
    }

    db.Nipple.findOne({
        where: {
            imageID: req.session.image.id,
        },
    })
        .then((nipple) => {
            const pageDifference = {
                nipple: nipple,
                pageName: "乳首座標更新",
                postLink: "/nipple/location/update",
            };
            LocationPageResponder(req, res, pageDifference);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/location", (req, res, next) => {
    const redirectFunc = getRedirectFunctionOnNippleDataMiss(req, res);
    if (redirectFunc) {
        redirectFunc();
        return;
    }

    db.Nipple.create({
        leftNippleX: req.body.leftNippleX,
        leftNippleY: req.body.leftNippleY,
        rightNippleX: req.body.rightNippleX,
        rightNippleY: req.body.rightNippleY,
        imageID: req.session.image.id,
    })
        .then((nipple) => {
            req.session.image = undefined;
            req.session.alertMessage = "乳首登録完了！";
            res.redirect("/users/mypage");
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/location/update", (req, res, next) => {
    const redirectFunc = getRedirectFunctionOnNippleDataMiss(req, res);
    if (redirectFunc) {
        redirectFunc();
        return;
    }

    db.Nipple.update(
        {
            leftNippleX: req.body.leftNippleX,
            leftNippleY: req.body.leftNippleY,
            rightNippleX: req.body.rightNippleX,
            rightNippleY: req.body.rightNippleY,
        },
        {
            where: {
                imageID: req.session.image.id,
            },
        }
    )
        .then((nipple) => {
            req.session.image = undefined;
            req.session.alertMessage = "乳首更新完了！";
            res.redirect("/users/mypage");
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
