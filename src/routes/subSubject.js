const express = require("express");
const { SubSubjectController } = require("../controllers");
const { checkAdminAuth } = require("../middleware");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkAdminAuth, SubSubjectController.addSubSubject);
router.get("/", SubSubjectController.getSubSubject);
router.get("/:id", SubSubjectController.getSubSubjectById);
router.put("/", pics, checkAdminAuth, SubSubjectController.updateSubSubject);
router.delete("/:id", checkAdminAuth, SubSubjectController.deleteSubSubject);
router.get("/subject/:id", SubSubjectController.getSubSubjectBySubjectId);
router.get("/active/:id", SubSubjectController.getActiveSubSubjectBySubjectId);

router.post("/chapter", checkAdminAuth, SubSubjectController.addChapterID);
router.delete("/chapter", checkAdminAuth, SubSubjectController.removeChapterID);
router.get("/chapter", SubSubjectController.getSubSubjectWithChapter);
router.get("/chapter/active/:id", SubSubjectController.getSubSubjectWithActiveChapterBySubId);




module.exports = router;