const Sequelize = require("sequelize");

const sequelize = new Sequelize("temp", "root", "admin", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
