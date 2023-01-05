const express = require("express");
const router = express.Router();
const { sequelize } = require("../models/index");

const QUESTION_QUANTITY = 10;

router.get("/", function (req, res, next) {
    res.render("index");
});

router.get("/gamedata", function (req, res, next) {
    sequelize
        .query(
            "SELECT path FROM IMAGES WHERE EXISTS (SELECT * FROM NIPPLES WHERE NIPPLES.imageID = IMAGES.id) ORDER BY RANDOM() LIMIT 10"
        )
        .then((queryRes) => {
            const images = queryRes[0];
            if (images.length < QUESTION_QUANTITY) {
                const missingQuantity = QUESTION_QUANTITY - images.length;
                [...Array(missingQuantity)].forEach(() => {
                    const initImageQuantity = images.length;
                    images.push(
                        images[Math.floor(Math.random() * initImageQuantity)]
                    );
                });
            }
            res.json(images);
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
