const Sequelize = require("sequelize");
//DEV
// const sequelize = new Sequelize("internety", "root", "admin", {
//   dialect: "mysql",
//   host: "localhost"
// });

//PROD

const sequelize = new Sequelize(
  "db37h7q596s9q3",
  "poqejnkidehtkl",
  "b1313bf7ef18c8359ac1713a32f805f078787bd385f999c996195e89743958be",
  {
    dialect: "postgres",
    host: "ec2-54-228-243-238.eu-west-1.compute.amazonaws.com",
    port: 5432,
    dialectOptions: {
      ssl: true
    }
  }
);

module.exports = sequelize;
