const express = require("express");
const { checkAdminAuth } = require("../middleware");
const { LiveClassController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkAdminAuth, LiveClassController.addClass);
router.get("/", LiveClassController.getClass);
router.get("/:id", LiveClassController.getClassById);
router.put("/", pics, checkAdminAuth, LiveClassController.updateClass);
router.delete("/:id", checkAdminAuth, LiveClassController.deleteLiveClass);
router.get("/course/:id", LiveClassController.getClassByCourseId);
router.get("/active/:id", LiveClassController.getActiveClassByCourseId);



module.exports = router;