const express = require("express");
const { TestPaperController } = require("../controllers");
const { checkAdminAuth, checkStudentAuth } = require("../middleware");
const router = express.Router();



router.get("/", checkAdminAuth, TestPaperController.getPracticePaper);
router.get("/chapter/:id", checkStudentAuth, TestPaperController.getPracticePaperByChap);
router.post("/", checkAdminAuth, TestPaperController.setPraticePaperToChapter);


module.exports = router;