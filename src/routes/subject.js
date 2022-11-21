const express = require("express");
const { SubjectController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, SubjectController.addSubject);
router.get("/", SubjectController.getSubject);
router.get("/:id", SubjectController.getSubjectById);
router.put("/", pics, SubjectController.updateSubject);
router.delete("/:id", SubjectController.deleteSubject);
router.get("/course/:id", SubjectController.getSubjectByCourseId);
router.get("/active/:id", SubjectController.getActiveSubjectByCourseId);



module.exports = router;