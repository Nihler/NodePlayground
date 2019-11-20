const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  // console.log("====================LOGIN=====================");
  // console.log(req.session);
  // console.log(req.session.user);
  // console.log(req.session.test);
  // console.log("=========================================");
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    level: temp
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

exports.getRegister = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  res.render("auth/register", {
    path: "/register",
    docTitle: "Register",
    isEdit: false,
    level: temp
  });
};

exports.postRegister = (req, res, next) => {
  if (req.body.password === req.body.passwordRepeat) {
    User.build({
      login: req.body.login,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
      level: 4
    })
      .save()
      .then(result => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect("/register");
  }
};

exports.getEditUser = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const user = User.findOne({
    where: {
      id: req.session.user.id
    }
  })
    .then(result => {
      res.render("auth/register", {
        user: result,
        isEdit: true,
        path: "/register",
        docTitle: "Register",
        level: temp
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditUser = (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);
  const worker = User.findOne({
    where: {
      id: userId
    }
  })
    .then(user => {
      console.log("user " + user);
      console.log(req.body);
      user.name = req.body.imie;
      user.surname = req.body.nazwisko;
      user.password = req.body.password;
      user.login = req.body.login;
      return user.save();
    })
    .then(result => {
      console.log("UPDATED USER");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
};
