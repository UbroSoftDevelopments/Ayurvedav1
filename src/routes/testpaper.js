const express = require("express");
const { TestPaperController } = require("../controllers");
const { checkAdminAuth } = require("../middleware");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkAdminAuth, TestPaperController.addTestPaper);
router.get("/", TestPaperController.getTestPaper);
router.put("/", pics, checkAdminAuth, TestPaperController.updateTestPaper);
router.delete("/:id", checkAdminAuth, TestPaperController.deleteTestPaper);
router.get("/chapter", TestPaperController.getTestPaperByChapterId);
router.get("/:id", TestPaperController.getTestPaperById);




module.exports = router;