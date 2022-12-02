const express = require("express");
const { QuestionController } = require("../controllers");
const { checkAdminAuth } = require("../middleware");
const router = express.Router();


router.post("/", checkAdminAuth, QuestionController.addQuestion);
router.get("/", QuestionController.getQuestion);
router.put("/", checkAdminAuth, QuestionController.updateQuestion);
router.delete("/:id", checkAdminAuth, QuestionController.deleteQuestion);
router.get("/chapter", QuestionController.getQuestionByChapterId);
router.get("/:id", QuestionController.getQuestionById);




module.exports = router;