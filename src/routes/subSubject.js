const express = require("express");
const { SubSubjectController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, SubSubjectController.addSubSubject);
router.get("/", SubSubjectController.getSubSubject);
router.get("/:id", SubSubjectController.getSubSubjectById);
router.put("/", pics, SubSubjectController.updateSubSubject);
router.delete("/:id", SubSubjectController.deleteSubSubject);
router.get("/subject/:id", SubSubjectController.getSubSubjectBySubjectId);
router.get("/active/:id", SubSubjectController.getActiveSubSubjectBySubjectId);

router.post("/chapter", SubSubjectController.addChapterID);
router.delete("/chapter", SubSubjectController.removeChapterID);
router.get("/chapter", SubSubjectController.getSubSubjectWithChapter);
router.get("/chapter/active/:id", SubSubjectController.getSubSubjectWithActiveChapterBySubId);




module.exports = router;