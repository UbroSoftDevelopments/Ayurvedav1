const express = require("express");
const { TestPaperController } = require("../controllers");
const { checkAdminAuth, checkStudentAuth } = require("../middleware");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');


router.post("/", pics, checkAdminAuth, TestPaperController.addTestPaper);
router.get("/", TestPaperController.getTestPaper);
router.put("/", pics, checkAdminAuth, TestPaperController.updateTestPaper);
router.delete("/:id", checkAdminAuth, TestPaperController.deleteTestPaper);
router.get("/chapter", TestPaperController.getTestPaperByChapterId);
router.get("/:id", checkAdminAuth, TestPaperController.getTestPaperById);
router.get("/student/:id", checkStudentAuth, TestPaperController.getTestPaperById);
router.get("/:testSeriesID/:paperID", checkAdminAuth, TestPaperController.getAssignStudentByPaper);




module.exports = router;