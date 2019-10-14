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

router.get("/get-workers-delete", adminController.getWorkersDelete);

router.get("/edit-worker/:workerId", adminController.getEditWorker);

router.get("/delete-worker/:workerId", adminController.getDeleteWorker);

//POST
router.post("/edit-worker", adminController.postEditWorker);

router.post("/delete-worker", adminController.postDeleteWorker);

router.post("/add-worker", adminController.addWorker);

router.post("/search", adminController.searchWorker);

module.exports = router;
