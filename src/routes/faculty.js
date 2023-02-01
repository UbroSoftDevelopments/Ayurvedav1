const express = require("express");
const { checkAdminAuth } = require("../middleware");

const { FacultyController } = require("../controllers");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router
    .route("/")
    .post(pics, checkAdminAuth, FacultyController.addFaculty)
    .get(FacultyController.getFaculty)
    .put(pics, checkAdminAuth, FacultyController.updateFaculty);


router.delete("/:id", checkAdminAuth, FacultyController.deleteFaculty);

module.exports = router;
