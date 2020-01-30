const express = require("express");
const path = require("path");

//const rootDir = require("../helpers/path");

const visitContoller = require("../controllers/visit");

const router = express.Router();

//GET

router.get("/checkFreeVisitsHours/:date", visitContoller.checkFreeVisitsHours);
router.get("/readVisit/:id", visitContoller.readVisit);
router.get("/checkUserVisits", visitContoller.checkUserVisits);
router.get("/checkFreeVisitsHours/:date", visitContoller.checkFreeVisitsHours);

//POST
router.post("/addVisist/:date/:time/:category", visitContoller.postAddVisit);
router.post("/deleteVisit/:id", visitContoller.deleteVisit);

module.exports = router;
