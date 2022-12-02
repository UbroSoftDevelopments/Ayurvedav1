const express = require("express");
const { ChapterController } = require("../controllers");
const { checkAdminAuth } = require("../middleware");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');


router.post("/", pics, checkAdminAuth, ChapterController.addChapter);
router.get("/", ChapterController.getChapter);
router.get("/:id", ChapterController.getChapterById);
router.put("/", pics, checkAdminAuth, ChapterController.updateChapter);
router.put("/notes", checkAdminAuth, pics, ChapterController.updateChapterNotes);
router.delete("/:id", checkAdminAuth, ChapterController.deleteChapter);

router.get("/sub-subject/:id", ChapterController.getChapterBySubSubjectId);

module.exports = router;