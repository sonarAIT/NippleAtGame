const express = require("express");
const router = express.Router();
const db = require("../models/index");

function isLoggined(req, res) {
    if (req.session.login == null) {
        req.session.back = "/users/";
        res.redirect("/users/login");
        return false;
    } else {
        return true;
    }
}

router.get("/", (req, res, next) => {
    res.redirect("/users/mypage/0");
});

router.get("/mypage", (req, res, next) => {
    res.redirect("/users/mypage/0");
});

router.get("/mypage/:page", (req, res, next) => {
    if (!isLoggined(req, res)) return;

    const data = {
        user: {
            id: req.session.login.id,
            name: req.session.login.name,
        }
    }

    res.render("users/mypage", data);
});

router.get("/login", (req, res, next) => {
    const data = {
        content: "名前とパスワードを入力して下さい。",
    };
    res.render("users/login", data);
});

router.post("/login", (req, res, next) => {
    console.log(req.session);
    db.User.findOne({
        where: {
            name: req.body.name,
            pass: req.body.pass,
        },
    })
        .then((user) => {
            if (user != null) {
                req.session.login = user;
                const back = req.session.back;
                if (back == null) {
                    back = "/users/mypage";
                }
                res.redirect(back);
            } else {
                const data = {
                    content:
                        "名前かパスワードに問題があります。再度入力して下さい。",
                };
                res.render("users/login", data);
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;