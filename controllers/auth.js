// const User = require("../models/user");

// exports.getLogin = (req, res, next) => {
//   res.render("auth/login", {
//     path: "/login",
//     docTitle: "Login",
//     isAuthenticated: req.session.isLoggedIn
//   });
// };

// exports.postLogin = (req, res, next) => {
//   //Tworzenie ciasteczka/sesji
//   User.findByPk(1)
//     .then(user => {
//       req.session.user = user;
//       req.session.user.isLoggedIn = true;
//       res.redirect("/");
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
