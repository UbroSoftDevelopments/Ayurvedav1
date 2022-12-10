const express = require("express");
const { NotesController } = require("../controllers");
const router = express.Router();
const { checkAdminAuth } = require("../middleware");
const uploader = require('../middleware/uploader');

var pics = uploader.single('photo');


router.post("/", checkAdminAuth, pics, NotesController.addNotes);
router.get("/", NotesController.getNotes);
router.put("/", checkAdminAuth, pics, NotesController.updateNotes);
router.delete("/:id", checkAdminAuth, NotesController.deleteNotes);

//only demo is allowed is pending todo
router.get("/chapter/:id", NotesController.getNotesByChapterId);

module.exports = router;