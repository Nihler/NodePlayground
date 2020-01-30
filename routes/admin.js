const express = require("express");
const path = require("path");

//const rootDir = require("../helpers/path");

const adminController = require("../controllers/admin");

const router = express.Router();

//GET
router.get("/", adminController.getIndex);

router.get("/student", adminController.getStudentPage);

//POST

module.exports = router;
