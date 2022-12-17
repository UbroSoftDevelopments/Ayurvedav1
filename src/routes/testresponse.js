const express = require("express");
const { TestResponseController } = require("../controllers");
const { checkAdminAuth, checkStudentAuth } = require("../middleware");
const router = express.Router();


router.post("/student/", TestResponseController.setStudentResponse);
router.get("/student/", TestResponseController.getQuestionByStudent);
router.put("/student/startend", TestResponseController.setTestStartEndTime);





module.exports = router;