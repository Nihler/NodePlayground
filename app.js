const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const sequelize = require("./helpers/database");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const visitRoutes = require("./routes/visit");

//Controllers
const errorController = require("./controllers/error");

//Models
const User = require("./models/user");
const Visit = require("./models/visit");

const app = express();

// app.engine("hbs", handleBars({ layoutsDir: "views/layouts/", defaultLayout: "main-layout", extname: "hbs" })); //odpalenie hundlebarsa
app.set("view engine", "pug"); //dodanie template engine
app.set("views", "views");

//middlewary - czyli funkcje kazde zadanie wywoluje
app.use(bodyParser.urlencoded()); //służy do parsowania requestow
app.use(express.static(path.join(__dirname, "public"))); //udostepnia folder public do odczytu dla usera, co pozwala na wczytywanie css
//UStawienia sesji
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    store: new SequelizeStore({
      db: sequelize
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true // if you do SSL outside of node.
  })
);

//deklaracja sciezek dla url

app.use(authRoutes);
app.use(adminRoutes);
app.use(visitRoutes);
app.use(errorController.get404);

app.use(function(req, res, next) {
  if (req.cookies.sesja != undefined) {
    const value = req.cookies.sesja;
    res.cookieCounter = value.counter;
    res.cookieArray = value.array;
  } else {
    res.cookieCounter = 0;
    res.cookieArray = [];
  }
  next();
});

//Relacje w bazie danych

Visit.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Visit);

//inicjalizacja serwera, polaczenia z baza danych + mock usera
sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001);
  })
  .catch(err => {
    console.log(err);
  });
