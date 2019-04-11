const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const sequelize = require("./helpers/database");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

// app.engine("hbs", handleBars({ layoutsDir: "views/layouts/", defaultLayout: "main-layout", extname: "hbs" })); //odpalenie hundlebarsa
app.set("view engine", "ejs"); //dodanie template engine
app.set("views", "views");

//middlewary - czyli funkcje kazde zadanie wywoluje

app.use(bodyParser.urlencoded()); //służy do parsowania requestow
app.use(express.static(path.join(__dirname, "public"))); //udostepnia folder public do odczytu dla usera, co pozwala na wczytywanie css

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

//deklaracja sciezek dla url

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Relacje w bazie danych

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

//inicjalizacja serwera, polaczenia z baza danych + mock usera
sequelize
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: "User", email: "test@test.pl" });
    }
    return user;
  })
  .then(user => {
    //console.log(user);
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
