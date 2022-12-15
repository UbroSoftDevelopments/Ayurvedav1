const express = require("express");
const { checkAdminAuth } = require("../middleware");
const { TestSeriesController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkAdminAuth, TestSeriesController.addTestSeries);
router.get("/", TestSeriesController.getTestSeries);
// router.get("/:id", SubjectController.getSubjectById);
router.put("/", pics, checkAdminAuth, TestSeriesController.updateTestSeries);
router.post("/paper", pics, checkAdminAuth, TestSeriesController.addPaperToTest);
// router.delete("/:id", checkAdminAuth, SubjectController.deleteSubject);
// router.get("/course/:id", SubjectController.getSubjectByCourseId);
// router.get("/active/:id", SubjectController.getActiveSubjectByCourseId);



module.exports = router;