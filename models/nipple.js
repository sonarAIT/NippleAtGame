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
            Nipple.belongsTo(models.User, {
                foreignKey: "userID",
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
                allowNull: false,
            },
            leftNippleY: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            rightNippleX: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            rightNippleY: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Nipple",
        }
    );
    return Nipple;
};
