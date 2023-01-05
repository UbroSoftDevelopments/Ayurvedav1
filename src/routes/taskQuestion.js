const express = require("express");
const { TaskQuestionController } = require("../controllers");
const router = express.Router();
const { checkStudentAuth } = require("../middleware");


router.post("/", checkStudentAuth, TaskQuestionController.addTaskQuestion);
router.get("/", checkStudentAuth, TaskQuestionController.getTaskQuestion);
router.delete("/:id", checkStudentAuth, TaskQuestionController.deleteTaskQuestion);


module.exports = router;