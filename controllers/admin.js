const sequelize = require("../helpers/database");
const Op = sequelize.Op;

const paginate = (query, page) => {
  const pageSize = 10;
  const offset = page * pageSize;
  const limit = 10;

  return {
    ...query,
    offset,
    limit
  };
};

exports.getIndex = (req, res, next) => {
  res.render("home", {
    msg: "Temp MSG",
    redirect: "login"
  });
};

exports.getStudentPage = (req, res, next) => {
  if (!req.session.user)
    res.render("login", {
      message: "Musisz się zalogować!"
    });
  else {
    console.log(req.session.user);
    res.render("student", {
      email: req.session.user.email,
      message: "Welcome my brother"
    });
  }
};
