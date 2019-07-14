const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "admin/edit-product",
    activeAddProduct: true,
    editing: false,
    isAuthenticated: req.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  req.user
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
      isAuthenticated: req.isLoggedIn
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
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
  req.user
    .getProducts()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        docTitle: "All Products",
        path: "/admin/products",
        hasProducts: products.length > 0,
        actvieShop: true,
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};
