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
    level: temp,
    message: ""
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
      res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        level: 0,
        message: "Błąd logowania"
      });
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
    info: [],
    path: "/register",
    docTitle: "Register",
    isEdit: false,
    level: temp,
    isRepeat: false
  });
};

exports.postRegister = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  if (
    req.body.password === req.body.passwordRepeat &&
    req.body.name !== "" &&
    req.body.name &&
    req.body.surname !== "" &&
    req.body.surname &&
    req.body.login !== "" &&
    req.body.login &&
    req.body.password !== "" &&
    req.body.password &&
    req.body.passwordRepeat !== "" &&
    req.body.passwordRepeat &&
    req.body.login.toString().length >= 6
  ) {
    User.build({
      login: req.body.login,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname,
      level: 0
    })
      .save()
      .then(result => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    let info = [];
    if (req.body.name == "") info.push("Nie podano imienia");
    else info.push("");
    if (req.body.surname == "") info.push("Nie podano nazwiska \n");
    else info.push("");
    if (req.body.login == "") info.push("Nie podano loginu  \n");
    else info.push("");
    if (req.body.password == "") info.push("Nie podano hasła \n");
    else info.push("");
    if (req.body.passwordRepeat == "") info.push("Hasła nie zgadzają się \n");
    else info.push("");
    if (req.body.login.toString().length < 6) info[2] += " Login ma mniej niż 6 znaków";

    let userObj = {};
    userObj.name = req.body.name || "";
    userObj.surname = req.body.surname || "";
    if (req.body.login.toString().length < 6) userObj.login = "";
    else userObj.login = req.body.login;

    console.log(userObj);

    res.render("auth/register", {
      info: info,
      path: "/register",
      docTitle: "Register",
      isEdit: false,
      level: temp,
      isRepeat: true,
      user: userObj
    });
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
      console.log(result);
      res.render("auth/register", {
        user: result,
        isEdit: true,
        path: "/register",
        docTitle: "Register",
        level: temp,
        info: [],
        isRepeat: false
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditUser = (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);

  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  console.log("=======================");
  console.log(req.body.login.toString().length >= 6);
  console.log("=======================");
  if (
    req.body.password === req.body.passwordRepeat &&
    req.body.name !== "" &&
    req.body.name &&
    req.body.surname !== "" &&
    req.body.surname &&
    req.body.login !== "" &&
    req.body.login &&
    req.body.password !== "" &&
    req.body.password &&
    req.body.passwordRepeat !== "" &&
    req.body.passwordRepeat &&
    req.body.login.toString().length >= 6
  ) {
    const worker = User.findOne({
      where: {
        id: userId
      }
    })
      .then(user => {
        console.log("user " + user);
        console.log(req.body);
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.password = req.body.password;
        user.login = req.body.login;
        return user.save();
      })
      .then(result => {
        console.log("UPDATED USER");
        res.redirect("/logout");
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    let info = [];
    if (req.body.name == "") info.push("Nie podano imienia");
    else info.push("");
    if (req.body.surname == "") info.push("Nie podano nazwiska \n");
    else info.push("");
    if (req.body.login == "") info.push("Nie podano loginu  \n");
    else info.push("");
    if (req.body.password == "") info.push("Nie podano hasła \n");
    else info.push("");
    if (req.body.passwordRepeat == "") info.push("Hasła nie zgadzają się \n");
    else info.push("");
    if (req.body.login.toString().length < 6) info[2] = info[2] + " Login ma mniej niż 6 znaków";
    else console.log("FALSE");

    //info[2] += " Login ma mniej niż 6 znaków";
    console.log(info);

    let userObj = {};
    userObj.id = userId;
    userObj.name = req.body.name || "";
    userObj.surname = req.body.surname || "";
    if (req.body.login.toString().length < 6) userObj.login = "";
    else userObj.login = req.body.login;

    console.log(userObj);

    res.render("auth/register", {
      info: info,
      path: "/register",
      docTitle: "Register",
      isEdit: true,
      level: temp,
      isRepeat: true,
      user: userObj
    });
  }
};
