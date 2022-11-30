const express = require("express");
const { QuestionController } = require("../controllers");

const router = express.Router();


router.post("/", QuestionController.addQuestion);
router.get("/", QuestionController.getQuestion);
router.put("/", QuestionController.updateQuestion);
router.delete("/:id", QuestionController.deleteQuestion);




module.exports = router;