const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // console.log("====================LOGIN=====================");
  // console.log(req.session);
  // console.log(req.session.user);
  // console.log(req.session.test);
  // console.log("=========================================");
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isLoggedIn: false
  });
};

exports.postLogin = (req, res, next) => {
  //Tworzenie ciasteczka/sesji
  User.findOne({
    where: { login: req.body.login, password: req.body.password },
    atributes: ["id", "login", "password", "level"]
  })
    .then(user => {
      console.log(user.get("id"));
      // req.session.test = true;
      req.session.user = {};
      req.session.user.id = user.get("id");
      req.session.user.login = user.get("login");
      //req.session.user.password = user.get("password");
      req.session.user.level = user.get("level");
      //req.session.user.isLoggedIn = true;
      // console.log("=========================================");
      // console.log(req.session);
      // console.log(req.session.user);
      // console.log(req.session.test);
      // console.log("=========================================");

      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
