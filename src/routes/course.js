const express = require("express");
const { CourseController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, CourseController.addCourse);
router.get("/", CourseController.getCourse);
router.get("/:id", CourseController.getCourseById);
router.put("/", pics, CourseController.updateCourse);
router.delete("/:id", CourseController.deleteCourse);

router.get("/category/:id", CourseController.getCourseByCategoryId);
router.get("/active/:id", CourseController.getActiveCourseByCategoryId);



module.exports = router;