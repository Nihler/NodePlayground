const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

//GET
router.get("/login", authController.getLogin);

router.get("/logout", authController.getLogout);

router.get("/register", authController.getRegister);

router.get("/change-data", authController.getEditUser);

//POST
router.post("/login", authController.postLogin);

router.post("/register", authController.postRegister);

router.post("/change-data", authController.postEditUser);

module.exports = router;
