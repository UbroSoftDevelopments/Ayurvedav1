const express = require("express");
const { TestResponseController } = require("../controllers");
const { checkAdminAuth, checkStudentAuth } = require("../middleware");
const router = express.Router();


router.post("/student/", checkStudentAuth, TestResponseController.setStudentResponse);
router.post("/student/summary", checkStudentAuth, TestResponseController.getStudentTestSummary);
router.put("/student/remove/", checkStudentAuth, TestResponseController.removeStudentResponse);
router.get("/student/", TestResponseController.getQuestionByStudent);
router.get("/student/response/:testSeriesID/:paperID/:studentID", TestResponseController.getResponseOfStudent);
router.get("/:testSeriesID/:paperID", TestResponseController.getResultOfStudent);
router.put("/student/startend", checkStudentAuth, TestResponseController.setTestStartEndTime);
router.delete("/:id", checkAdminAuth, TestResponseController.deleteTestResponse);





module.exports = router; 