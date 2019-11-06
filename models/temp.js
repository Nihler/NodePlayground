const Sequelize = require("sequelize");

const sequelize = require("../helpers/database");

const Order = sequelize.define("temp", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  orderNumber: Sequelize.INTEGER,
  isActive: Sequelize.INTEGER //0 = nie zrobion, 1=w trakcie, 2= zrobiony
});

module.exports = Order;
