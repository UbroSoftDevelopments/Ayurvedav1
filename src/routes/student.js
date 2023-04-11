const express = require("express");
const { checkStudentAuth, checkAdminAuth } = require("../middleware");
const { StudentController, ProductController } = require("../controllers");
const router = express.Router();


router.post("/registration", StudentController.studentRegister);
router.post("/login", StudentController.studentLogin);
router.post('/profile', checkStudentAuth, StudentController.updateStudent);



router.get("/checkStudent", checkStudentAuth, StudentController.checkStudent);
router.post("/verifyStudent", StudentController.verfiyStudent);


router.get("/", checkAdminAuth, StudentController.getAllStudent);
router.delete("/:id", checkAdminAuth, StudentController.deleteStudent);
router.get("/detail/:id", checkAdminAuth, StudentController.getStudent);
router.put("/description", checkAdminAuth, StudentController.editStudentDiscription);

router.get("/plan/:id", ProductController.getStudentPlan);
router.delete("/plan/:id", checkAdminAuth, ProductController.deleteStudentPlan);
router.post("/plan", ProductController.addStudentPlan);
router.post("/test-plan", ProductController.addStudentTestSeries);
router.put("/test-plan", ProductController.removePaperFromTest);

//Live class
router.post("/liveClass-plan", ProductController.addStudentLiveclass);
router.get("/myLiveClass", checkStudentAuth, ProductController.getMyLiveClassTopic)

//Get data from its Plan
router.get("/myCourses", checkStudentAuth, ProductController.getMyCourse)
router.get("/myTestSeries", checkStudentAuth, ProductController.getMyTestSeries)
router.get("/myPaper/:id", checkStudentAuth, ProductController.getMyPaperBySeries)
router.get("/mySubjects/course/:id", checkStudentAuth, ProductController.getMySubjectByCourse)
router.get("/myChapters/subject/:id", checkStudentAuth, ProductController.getMyChapterBySubject)
router.get("/myVideos/chapter/:subId/:id", checkStudentAuth, ProductController.getMyVideoByChapter)
router.get("/myNotes/chapter/:subId/:id", checkStudentAuth, ProductController.getMyNotesByChapter)
module.exports = router;
