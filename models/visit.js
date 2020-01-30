const Sequelize = require("sequelize");

const sequelize = require("../helpers/database");

const Visit = sequelize.define("visit", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  type: Sequelize.STRING,
  day: Sequelize.DATEONLY,
  hour: Sequelize.TIME
});

module.exports = Visit;
