const express = require("express");
const { checkAdminAuth } = require("../middleware");
const { TestSeriesController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkAdminAuth, TestSeriesController.addTestSeries);
router.get("/", TestSeriesController.getTestSeries);
router.get("/course/:id", TestSeriesController.getTestSeriesByCourse);
router.get("/:id", TestSeriesController.getTestSeriesWithPaper);
router.put("/", pics, checkAdminAuth, TestSeriesController.updateTestSeries);
router.post("/paper", pics, checkAdminAuth, TestSeriesController.addPaperToTest);
router.delete("/:id", checkAdminAuth, TestSeriesController.deleteTestSeries);
// router.get("/course/:id", SubjectController.getSubjectByCourseId);
// router.get("/active/:id", SubjectController.getActiveSubjectByCourseId);



module.exports = router;