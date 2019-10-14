const Worker = require("../models/worker");

exports.getIndex = (req, res, next) => {
  res.render("admin/index", {});
};

exports.getForm = (req, res, next) => {
  res.render("admin/form", {});
};

exports.getSessionData = (req, res, next) => {
  res.render("admin/form", {});
};

exports.getWorkers = (req, res, next) => {
  Worker.findAll().then(workers => {
    res.render("admin/list", {
      workersList: workers,
      isEdit: false,
      isDelete: false
    });
  });
};

exports.getWorkersEdit = (req, res, next) => {
  Worker.findAll().then(workers => {
    res.render("admin/list", {
      workersList: workers,
      isEdit: true,
      isDelete: false
    });
  });
};

exports.getWorkersDelete = (req, res, next) => {
  Worker.findAll().then(workers => {
    res.render("admin/list", {
      workersList: workers,
      isEdit: false,
      isDelete: true
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
  console.log(req.body);
  Worker.findAll({
    where: {
      surname: { $like: "%" + req.body.engine + "%" }
    }
  }).then(result => {
    res.render("admin/list", {
      workersList: result,
      isEdit: false,
      isDelete: false
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "admin/edit-product",
    activeAddProduct: true,
    editing: false,
    isAuthenticated: req.session.isLoggedIn
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
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: req.originalUrl,
      activeAddProduct: true,
      editing: editMode,
      product: product,
      isAuthenticated: req.session.isLoggedIn
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
  req.session.user
    .getProducts()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        docTitle: "All Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        actvieShop: true,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};
