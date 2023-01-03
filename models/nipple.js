"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Nipple extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Nipple.belongsTo(models.Image, {
                foreignKey: "imageID",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                allowNull: false,
            });
        }
    }
    Nipple.init(
        {
            leftNippleX: {
                type: DataTypes.DOUBLE,
            },
            leftNippleY: {
                type: DataTypes.DOUBLE,
            },
            rightNippleX: {
                type: DataTypes.DOUBLE,
            },
            rightNippleY: {
                type: DataTypes.DOUBLE,
            },
        },
        {
            sequelize,
            modelName: "Nipple",
        }
    );
    return Nipple;
};
