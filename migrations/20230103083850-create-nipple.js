'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Nipples", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        imageID: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
              model: 'Images',
              key: 'id',
            }
        },
        leftNippleX: {
            allowNull: false,
            type: Sequelize.DOUBLE,
        },
        leftNippleY: {
            allowNull: false,
            type: Sequelize.DOUBLE,
        },
        rightNippleX: {
            allowNull: false,
            type: Sequelize.DOUBLE,
        },
        rightNippleY: {
            allowNull: false,
            type: Sequelize.DOUBLE,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Nipples');
  }
};