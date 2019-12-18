const Worker = require("../models/worker");
const Users = require("../models/user");
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
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  console.log("=========================================");
  console.log(temp);
  console.log("=========================================");
  let note = "Strona Główna";
  if (req.session.user) note = "Witaj " + req.session.user.login;
  res.render("admin/index", {
    info: note,
    level: temp
  });
};

exports.getForm = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  res.render("admin/form", {
    info: "",
    isEdit: false,
    level: temp,
    info: "",
    isRepeat: false
  });
};

exports.getUsers = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  const page = req.param.page || 1;
  Users.findAll({
    where: {
      level: {
        [Op.lt]: [4]
      }
    }
  }).then(users => {
    res.render("admin/delete-user", {
      usersList: users,
      level: temp
      //page: page + 1
    });
  });
};

exports.getDeleteUser = (req, res, next) => {
  const userId = req.params.userId;
  Users.destroy({
    where: {
      id: userId
    }
  })
    .then(result => {
      res.redirect("/delete-user");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getChangeLevel = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  Users.findAll({
    where: {
      level: {
        [Op.lt]: [4]
      }
    }
  }).then(users => {
    res.render("admin/change-level", {
      usersList: users,
      level: temp
    });
  });
};

exports.postChangeLevel = (req, res, next) => {
  const userId = req.params.userId;
  const newLevel = req.params.newLevel;
  Users.findByPk(userId)
    .then(result => {
      if (result) {
        result
          .update({
            level: newLevel
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .then(result => {
      res.redirect("/change-level");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getSessionData = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  let newArray = [];
  if (req.cookies.sesja != undefined) {
    const value = req.cookies.sesja;
    newArray = value.array;
  }
  console.log(newArray);

  res.render("admin/session", { level: temp, newArray: newArray });
};

exports.getWorkers = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  const page = req.params.page || 0;

  Worker.findAll(paginate({ where: {} }, page)).then(workers => {
    Worker.count().then(counter => {
      console.log("==================");
      console.log(counter);

      res.render("admin/list", {
        workersList: workers,
        isEdit: false,
        isDelete: false,
        level: temp,
        page: parseInt(page),
        count: counter,
        search: false
      });
    });
  });
};

exports.getWorkersEdit = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const page = req.params.page || 0;
  Worker.findAll(paginate({ where: {} }, page)).then(workers => {
    Worker.count().then(counter => {
      res.render("admin/list", {
        workersList: workers,
        isEdit: true,
        isDelete: false,
        level: temp,
        page: parseInt(page),
        count: counter,
        search: false
      });
    });
  });
};

exports.getWorkersDelete = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const page = req.params.page || 0;
  Worker.findAll(paginate({ where: {} }, page)).then(workers => {
    Worker.count().then(counter => {
      res.render("admin/list", {
        workersList: workers,
        isEdit: false,
        isDelete: true,
        level: temp,
        page: parseInt(page),
        count: counter,
        search: false
      });
    });
  });
};

exports.addWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  console.log(req.body);
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const codeRegexp = /^([0-9]{2})(-[0-9]{3})?$/i;
  console.log(codeRegexp.test(req.body.kod));
  if (
    req.body.imie !== "" &&
    req.body.imie &&
    req.body.nazwisko !== "" &&
    req.body.nazwisko &&
    req.body.plec !== undefined &&
    req.body.plec &&
    req.body.panienskie !== "" &&
    req.body.panienskie &&
    req.body.email !== "" &&
    req.body.email &&
    req.body.kod !== "" &&
    req.body.kod &&
    emailRegexp.test(req.body.email) &&
    codeRegexp.test(req.body.kod)
  ) {
    Worker.build({
      name: req.body.imie,
      surname: req.body.nazwisko,
      sex: req.body.plec,
      surname2: req.body.panienskie,
      email: req.body.email,
      postal: req.body.kod
    })
      .save()
      .then(result => {
        console.log("==================");
        console.log(req.cookies.sesja);

        if (req.cookies.sesja === undefined) {
          let objArray = [result.dataValues];
          res.cookie("sesja", { counter: 1, array: objArray });
        } else {
          const value = req.cookies.sesja;
          const newCounter = parseInt(value.counter) + 1;
          const newArray = value.array;
          newArray.push(result.dataValues);
          res.cookie("sesja", { counter: newCounter, array: newArray }, { overwrite: true });
        }

        console.log("==================");
        console.log(req.cookies.sesja);

        res.redirect("/get-workers/0");
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    let info = [];
    if (req.body.imie == "") info.push("Nie podano imienia");
    else info.push("");
    if (req.body.nazwisko == "") info.push("Nie podano nazwiska \n");
    else info.push("");
    if (req.body.plec == undefined || req.body.plec == "") info.push("Nie podano płci \n");
    else info.push("");
    if (req.body.panienskie == "") info.push("Nie podano nazwiska panieńskiego \n");
    else info.push("");
    if (req.body.email == "") info.push("Nie podano maila \n");
    else info.push("");
    if (req.body.kod == "") info.push("Nie podano kodu \n");
    else info.push("");
    if (!emailRegexp.test(req.body.email)) info[4] += " Zły format maila, przykład: admin@admin.pl";
    if (!codeRegexp.test(req.body.kod)) info[5] += " Zły format kodu, przykład: 12-123";

    console.log(req.body.plec);

    let workerObj = {};
    workerObj.name = req.body.imie.toString();
    workerObj.surname = req.body.nazwisko;
    workerObj.sex = req.body.plec;
    if (emailRegexp.test(req.body.email)) workerObj.email = req.body.email;
    else workerObj.email = "";
    workerObj.surname2 = req.body.panienskie;
    if (codeRegexp.test(req.body.kod)) workerObj.postal = req.body.kod;
    else workerObj.postal = "";
    let arr = [workerObj];

    console.log("=======================");
    console.log(workerObj);

    res.render("admin/form", {
      info: info,
      path: "/register",
      docTitle: "Register",
      isEdit: false,
      level: temp,
      isRepeat: true,
      worker: workerObj
    });
  }
};

exports.searchWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const page = req.params.page || 0;
  let workersArray = req.query.engine.split(" ");
  let workerString = "";
  workersArray.forEach(element => {
    workerString += element + "+";
  });
  workersArray = workersArray.map(i => "%" + i + "%");
  workerString = workerString.substring(0, workerString.length - 1);
  //console.log(workersArray);
  Worker.findAll(
    paginate(
      {
        where: {
          surname: {
            $or: {
              $like: { $any: workersArray },
              $in: workersArray
            }
          }
        }
      },
      page
    )
  ).then(result => {
    console.log(result.length);
    res.render("admin/list", {
      workersList: result,
      isEdit: false,
      isDelete: false,
      level: temp,
      page: parseInt(page),
      count: result.length,
      engine: workerString,
      search: true
    });
  });
};

exports.getEditWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const worker = Worker.findOne({
    where: {
      id: req.params.workerId
    }
  })
    .then(result => {
      res.render("admin/form", {
        worker: result,
        isEdit: true,
        level: temp,
        info: "",
        isRepeat: false
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const workerId = req.body.workerId;
  console.log(workerId);
  const worker = Worker.findOne({
    where: {
      id: workerId
    }
  })
    .then(worker => {
      // console.log("worker " + worker);
      // console.log(req.body);

      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      const codeRegexp = /^([0-9]{2})(-[0-9]{3})?$/i;

      if (
        req.body.imie !== "" &&
        req.body.imie &&
        req.body.nazwisko !== "" &&
        req.body.nazwisko &&
        req.body.panienskie !== "" &&
        req.body.panienskie &&
        req.body.email !== "" &&
        req.body.email &&
        req.body.kod !== "" &&
        req.body.kod &&
        req.body.kod !== undefined &&
        emailRegexp.test(req.body.email) &&
        codeRegexp.test(req.body.kod)
      ) {
        console.log("IF TRUE");
        worker.name = req.body.imie;
        worker.surname = req.body.nazwisko;
        worker.surname2 = req.body.panienskie;
        worker.sex = req.body.plec;
        worker.email = req.body.email;
        worker.postal = req.body.kod;
        worker.save();
      } else {
        console.log("IF FALSE");
        let info = [];
        if (req.body.imie == "") info.push("Nie podano imienia");
        else info.push("");
        if (req.body.nazwisko == "") info.push("Nie podano nazwiska \n");
        else info.push("");
        if (req.body.plec == undefined || req.body.plec == "") info.push("Nie podano płci \n");
        else info.push("");
        if (req.body.panienskie == "") info.push("Nie podano nazwiska panieńskiego \n");
        else info.push("");
        if (req.body.email == "") info.push("Nie podano maila \n");
        else info.push("");
        if (req.body.kod == "") info.push("Nie podano kodu \n");
        else info.push("");
        if (!emailRegexp.test(req.body.email)) info[43] += " Zły format maila, przykład: admin@admin.pl";
        if (!codeRegexp.test(req.body.kod)) info[5] += " Zły format kodu, przykład: 12-123";

        res.render("admin/form", {
          info: info,
          path: "/register",
          docTitle: "Register",
          isEdit: true,
          level: temp,
          worker: worker
        });
      }
    })
    .then(result => {
      console.log("UPDATED PRODUCT");
      res.redirect("/get-workers-edit/0");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getDeleteWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  const workerId = req.params.workerId;
  res.render("admin/confirm", {
    workerId: workerId,
    level: temp
  });
};

exports.postDeleteWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;
  const workerId = req.params.workerId;
  Worker.destroy({ where: { id: workerId } })
    .then(result => {
      res.redirect("/get-workers-delete/0");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "admin/edit-product",
    activeAddProduct: true,
    editing: false,
    level: temp
  });
};

exports.postAddProduct = (req, res, next) => {
  req.session.user
    .createProduct({
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      title: req.body.title
    })
    .then(result => {
      res.redirect("/admin/products");
    });
};

exports.getEditProduct = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  const editMode = req.query.edit;
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: req.originalUrl,
      activeAddProduct: true,
      editing: editMode,
      product: product,
      level: temp
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .getProducts({ where: { id: prodId } })
    //Product.findByPk(prodId)
    .then(products => {
      const product = products[0];
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      return product.save();
    })
    .then(result => {
      console.log("UPDATED PRODUCT");
      res.redirect("/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId || req.params.productId || req.query.productId;
  Product.destroy({ where: { id: prodId } });
  res.redirect("/products");
};

exports.getProducts = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  req.session.user
    .getProducts()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        docTitle: "All Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        actvieShop: true,
        level: temp
      });
    })
    .catch(err => {
      console.log(err);
    });
};
