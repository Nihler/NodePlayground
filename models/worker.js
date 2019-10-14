const Sequelize = require("sequelize");

const sequelize = require("../helpers/database");

const Worker = sequelize.define("worker", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  email: Sequelize.STRING,
  sex: Sequelize.STRING,
  surname2: Sequelize.STRING,
  postal: Sequelize.STRING
});

module.exports = Worker;
