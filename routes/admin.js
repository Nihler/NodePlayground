const express = require("express");
const path = require("path");

//const rootDir = require("../helpers/path");

const adminController = require("../controllers/admin");

const router = express.Router();

//GET
router.get("/", adminController.getIndex);

router.get("/form", adminController.getForm);

router.get("/session", adminController.getSessionData);

router.get("/get-workers/:page", adminController.getWorkers);

router.get("/get-workers-edit/:page", adminController.getWorkersEdit);

router.get("/get-workers-delete/:page", adminController.getWorkersDelete);

router.get("/edit-worker/:workerId", adminController.getEditWorker);

router.get("/delete-worker/:workerId", adminController.getDeleteWorker);

router.get("/change-level/", adminController.getChangeLevel);

router.get("/change-level/:userId&:newLevel", adminController.postChangeLevel);

router.get("/delete-user", adminController.getUsers);

router.get("/search/:page", adminController.searchWorker);
router.get("/search/", adminController.searchWorker);

//router.get("/delete-user", adminController.getUsers);

router.get("/delete-user/:userId", adminController.getDeleteUser);

//POST
router.post("/edit-worker", adminController.postEditWorker);

router.post("/delete-worker/:workerId", adminController.postDeleteWorker);

router.post("/add-worker", adminController.addWorker);

module.exports = router;
