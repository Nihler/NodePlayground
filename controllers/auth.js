const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isLoggedIn: req.isLoggedIn
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
      req.session.user = user;
      // req.session.user.id = user.get("id");
      // req.session.user.login = user.get("login");
      // //req.session.user.password = user.get("password");
      // req.session.user.level = user.get("level");
      req.session.user.isLoggedIn = true;
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};
