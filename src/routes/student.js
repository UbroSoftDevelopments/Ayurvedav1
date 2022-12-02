const express = require("express");
const { checkStudentAuth, checkAdminAuth } = require("../middleware");
const { StudentController, ProductController } = require("../controllers");
const router = express.Router();


router.post("/registration", StudentController.studentRegister);
router.post("/login", StudentController.studentLogin);

router.get("/checkStudent", checkStudentAuth, StudentController.checkStudent);


router.get("/", StudentController.getAllStudent);

router.get("/plan/:id", ProductController.getStudentPlan);
router.delete("/plan/:id", checkAdminAuth, ProductController.deleteStudentPlan);
router.post("/plan", ProductController.addStudentPlan);

//Get data from its Plan
router.get("/myCourses", checkStudentAuth, ProductController.getMyCourse)
router.get("/mySubjects/course/:id", checkStudentAuth, ProductController.getMySubjectByCourse)
router.get("/myChapters/subject/:id", checkStudentAuth, ProductController.getMyChapterBySubject)
router.get("/myVideos/chapter/:id", checkStudentAuth, ProductController.getMyVideoByChapter)
module.exports = router;
