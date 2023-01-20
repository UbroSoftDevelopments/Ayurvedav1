const express = require("express");
const { ReportController } = require("../controllers");
const router = express.Router();
const { checkAdminAuth, checkStudentAuth } = require("../middleware");
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkStudentAuth, ReportController.addReport);
router.get("/", checkAdminAuth, ReportController.getReport);


module.exports = router;