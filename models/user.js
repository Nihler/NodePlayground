const Sequelize = require("sequelize");

const sequelize = require("../helpers/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  login: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  level: Sequelize.INTEGER
});

module.exports = User;
