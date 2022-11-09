const express = require("express");
const { ChapterController } = require("../controllers");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, ChapterController.addChapter);
router.get("/", ChapterController.getChapter);
router.put("/", pics, ChapterController.updateChapter);
router.delete("/", ChapterController.deleteChapter);

router.get("/sub-subject/:id", ChapterController.getChapterBySubSubjectId);

module.exports = router;