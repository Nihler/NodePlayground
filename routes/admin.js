const express = require("express");
const path = require("path");

//const rootDir = require("../helpers/path");

const adminController = require("../controllers/admin");

const router = express.Router();

//GET
router.get("/", adminController.getIndex);

router.get("/form", adminController.getForm);

router.get("/session", adminController.getSessionData);

router.get("/get-workers", adminController.getWorkers);

router.get("/get-workers-edit", adminController.getWorkersEdit);

//POST
router.post("/edit-worker");

router.post("/add-worker", adminController.addWorker);

router.post("/search", adminController.searchWorker);

module.exports = router;
