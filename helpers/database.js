const Sequelize = require("sequelize");

const sequelize = new Sequelize("internety", "root", "admin", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
