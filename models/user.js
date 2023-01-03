"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.hasMany(models.Image);
        }
    }
    User.init(
        {
            name: {
                type: DataTypes.STRING,
                unique: {
                    msg: "このユーザー名は既に使われています。",
                },
                validate: {
                    len: {
                        args: [1, 32],
                        msg: "ユーザー名は1文字以上32文字以下で入力して下さい。",
                    },
                }
            },
            pass: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [1, 32],
                        msg: "パスワードは1文字以上32文字以下で入力して下さい。",
                    },
                }
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
