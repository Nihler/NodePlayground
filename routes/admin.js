const express = require("express");
const path = require("path");

//const rootDir = require("../helpers/path");

const adminController = require("../controllers/admin");

const tempController = require("../controllers/temp");

const router = express.Router();

//GET
router.get("/add-product", adminController.getAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.get("/products", adminController.getProducts);

router.get("/tempOrder", tempController.newOrder);

//POST
router.post("/add-product", adminController.postAddProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

router.post("/newOrder", tempController.newOrder);
router.post("/next", tempController.activateOrder);
router.post("/finish/:orderId", tempController.finishOrder);

module.exports = router;
