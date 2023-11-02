const express = require("express");
const { CourseController } = require("../controllers");
const { checkAdminAuth } = require("../middleware");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, checkAdminAuth, CourseController.addCourse);
router.get("/", CourseController.getCourse);
router.get("/:id", CourseController.getCourseById);
router.get("/allData/:id", CourseController.getCourseAllDataById);
router.get("/allDataAdmin/:id",checkAdminAuth, CourseController.getCourseAllDataAdminById);
router.put("/", pics, checkAdminAuth, CourseController.updateCourse);
router.delete("/:id", checkAdminAuth, CourseController.deleteCourse);

router.get("/category/:id", CourseController.getCourseByCategoryId);
router.get("/active/:id", CourseController.getActiveCourseByCategoryId);



module.exports = router;