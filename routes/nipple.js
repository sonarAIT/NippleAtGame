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
        fileSize: 1024 * 1024,
    },
});

router.get("/upload", (req, res, next) => {
    if (!users.isLoggined(req, res)) {
        res.redirect("/users/login");
        return;
    }

    const data = {
        err: null,
    };

    res.render("nipple/upload", data);
});

router.post("/upload", upload.single("image"), function (req, res) {
    if (!users.isLoggined(req, res)) {
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
    if (!users.isLoggined(req, res)) {
        res.redirect("/users/login");
        return;
    }

    if (req.session.image === undefined) {
        res.redirect("/nipple/upload");
        return;
    }

    const data = {
        err: null,
        photoPath: req.session.image.path,
    };

    res.render("nipple/location", data);
});

router.post("/location", (req, res, next) => {
    if (!users.isLoggined(req, res)) {
        res.redirect("/users/login");
        return;
    }

    if (req.session.image === undefined) {
        res.redirect("/nipple/upload");
        return;
    }

    if (
        req.body.leftNippleX === "" ||
        req.body.leftNippleY === "" ||
        req.body.rightNippleX === "" ||
        req.body.rightNippleY === ""
    ) {
        const data = {
            err: "両乳首を入力してください。",
            photoPath: req.session.image.path,
        };
        res.render("nipple/location", data);
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
            res.redirect("/users/mypage");
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
