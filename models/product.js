// const db = require("../helpers/database");

// const cart = require("./cart");

// const tablename = "products";

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO " + tablename + " (`title`, `price`, `description`, `imageUrl`) VALUES (?, ?, ?, ?)",
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//   }

//   static deleteProductById(id) {}

//   static fetchAll() {
//     return db.execute("SELECT * FROM " + tablename);
//   }

//   static getById(id) {
//     return db.execute("SELECT * FROM " + tablename + " WHERE id = ?", [id]);
//   }
// };

const Sequelize = require("sequelize");

const sequelize = require("../helpers/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;
