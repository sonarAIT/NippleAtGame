"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Image.hasOne(models.Nipple);
            Image.belongsTo(models.User, {
                foreignKey: "userID",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
                allowNull: false,
            });
        }
    }
    Image.init(
        {
            path: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "Image",
        }
    );
    return Image;
};
