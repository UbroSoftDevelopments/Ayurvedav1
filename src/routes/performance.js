const express = require("express");
const { PerformanceController } = require("../controllers");
const router = express.Router();

router.post("/", PerformanceController.getAverageInTestSeriesByX);
router.post("/pendingTest", PerformanceController.getPendingPaper);
router.post("/allresponse", PerformanceController.getAllResponseOfStudentByTestSeries);
router.post("/getPaperByX", PerformanceController.getTestPaperBySeriesX);
router.post("/getPaperAverage", PerformanceController.getAverageCustom);
router.post("/getGivenPaper", PerformanceController.getGivenPaper);

module.exports = router;