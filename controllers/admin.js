const Worker = require("../models/worker");
const Users = require("../models/user");
const sequelize = require("../helpers/database");
const Op = sequelize.Op;

exports.getIndex = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  console.log("=========================================");
  console.log(temp);
  console.log("=========================================");
  res.render("admin/index", {
    level: temp
  });
};

exports.getForm = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  res.render("admin/form", {
    isEdit: false,
    level: temp
  });
};

exports.getUsers = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

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

  res.render("admin/session", { level: temp });
};

exports.getWorkers = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  Worker.findAll().then(workers => {
    res.render("admin/list", {
      workersList: workers,
      isEdit: false,
      isDelete: false,
      level: temp
    });
  });
};

exports.getWorkersEdit = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  Worker.findAll().then(workers => {
    res.render("admin/list", {
      workersList: workers,
      isEdit: true,
      isDelete: false,
      level: temp
    });
  });
};

exports.getWorkersDelete = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  Worker.findAll().then(workers => {
    res.render("admin/list", {
      workersList: workers,
      isEdit: false,
      isDelete: true,
      level: temp
    });
  });
};

exports.addWorker = (req, res, next) => {
  console.log(req.body.imie);

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
      res.redirect("/get-workers");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.searchWorker = (req, res, next) => {
  let temp = 0;
  if (req.session.user) temp = req.session.user.level;

  console.log(req.body);
  Worker.findAll({
    where: {
      surname: { $like: "%" + req.body.engine + "%" }
    }
  }).then(result => {
    res.render("admin/list", {
      workersList: result,
      isEdit: false,
      isDelete: false,
      level: temp
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
        level: temp
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postEditWorker = (req, res, next) => {
  const workerId = req.body.workerId;
  console.log(workerId);
  const worker = Worker.findOne({
    where: {
      id: workerId
    }
  })
    .then(worker => {
      console.log("worker " + worker);
      console.log(req.body);
      worker.name = req.body.imie;
      worker.surname = req.body.nazwisko;
      worker.surname2 = req.body.panienskie;
      worker.sex = req.body.plec;
      worker.email = req.body.email;
      worker.postal = req.body.kod;
      return worker.save();
    })
    .then(result => {
      console.log("UPDATED PRODUCT");
      res.redirect("/get-workers-edit");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getDeleteWorker = (req, res, next) => {
  const workerId = req.params.workerId;
  Worker.destroy({ where: { id: workerId } })
    .then(result => {
      res.redirect("/get-workers-delete");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteWorker = (req, res, next) => {};

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
