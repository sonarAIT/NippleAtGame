const express = require("express");
const router = express.Router();
const db = require("../models/index");
const { sequelize } = require("../models/index");

const NIPPLE_QUANTITY_PER_PAGE = 2;

router.get("/", (req, res, next) => {
    res.redirect("/users/mypage/");
});

router.get("/mypage", (req, res, next) => {
    res.redirect("/users/mypage/0");
});

router.get("/mypage/:page", (req, res, next) => {
    if (!module.exports.isLoggined(req, res)) {
        res.redirect("/users/login");
        return;
    }

    const page = req.params.page * 1;
    if (isNaN(page) || page < 0) {
        res.redirect("/users/mypage/0");
        return;
    }

    let nippleCount = 0;
    sequelize
        .query(
            "SELECT COUNT(*) as count from IMAGES WHERE userID = :userID AND EXISTS (SELECT * FROM NIPPLES WHERE NIPPLES.imageID = IMAGES.id)",
            {
                replacements: {
                    userID: req.session.login.id,
                },
            }
        )
        .then((count) => {
            nippleCount = count[0][0].count;
            if(nippleCount < page * NIPPLE_QUANTITY_PER_PAGE) {
                const lastPage = Math.max(Math.floor((nippleCount - 1) / NIPPLE_QUANTITY_PER_PAGE), 0);
                res.redirect("/users/mypage/" + lastPage);
                return;
            }
        })
        .catch((err) => {
            console.log(err);
        });

    sequelize
        .query(
            "SELECT id, path from IMAGES WHERE userID = :userID AND EXISTS (SELECT * FROM NIPPLES WHERE NIPPLES.imageID = IMAGES.id) ORDER BY createdAt LIMIT :limit OFFSET :offset",
            {
                replacements: {
                    userID: req.session.login.id,
                    offset: page * NIPPLE_QUANTITY_PER_PAGE,
                    limit: NIPPLE_QUANTITY_PER_PAGE,
                },
            }
        )
        .then((images) => {
            const isNextPage = nippleCount > (page + 1) * NIPPLE_QUANTITY_PER_PAGE;
            const data = {
                images: images[0],
                login: req.session.login,
                page: page,
                isNextPage: isNextPage,
            };
            res.render("users/mypage", data);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get("/login", (req, res, next) => {
    if(module.exports.isLoggined(req, res)) {
        res.redirect("/users/mypage");
        return;
    }
    const data = {
        content: "名前とパスワードを入力して下さい。",
    };
    res.render("users/login", data);
});

router.post("/login", (req, res, next) => {
    db.User.findOne({
        where: {
            name: req.body.name,
            pass: req.body.pass,
        },
    })
        .then((user) => {
            if (user != null) {
                req.session.login = user;
                res.redirect("/users/mypage");
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

router.get("/create", (req, res, next) => {
    const data = {
        form: new db.User(),
        err: null,
    };
    res.render("users/create", data);
});

router.post("/create", (req, res, next) => {
    const form = {
        name: req.body.name,
        pass: req.body.pass,
    };
    db.sequelize.sync().then(() =>
        db.User.create(form)
            .then((usr) => {
                res.redirect("/users/mypage");
            })
            .catch((err) => {
                const data = {
                    form: form,
                    err: err,
                };
                res.render("users/create", data);
            })
    );
});

router.get("/delete", (req, res, next) => {
    if (!module.exports.isLoggined(req, res)) {
        res.redirect("/users/login");
        return;
    }

    res.render("users/delete");
});

router.post("/delete", (req, res, next) => {
    db.User.findByPk(req.session.login.id).then((user) => {
        user.destroy().then(() => {
            req.session.login = null;
            res.redirect("/users/delete/complete");
        });
    });
});

router.get("/delete/complete", (req, res, next) => {
    res.render("users/delete-complete");
});

module.exports = router;

module.exports.isLoggined = (req, res) => {
    if (req.session.login == null) {
        return false;
    } else {
        return true;
    }
};
