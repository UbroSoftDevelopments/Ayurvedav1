const express = require("express");
const { checkAuth } = require("../middleware");
const { StudentController } = require("../controllers");
const router = express.Router();



router.post("/registration", StudentController.studentRegister);
router.post("/login", StudentController.studentLogin);


router.get("/", StudentController.getAllStudent);
router.get("/plan/:id", StudentController.getStudentPlan);
router.delete("/plan/:id", StudentController.deleteStudentPlan);
router.post("/plan", StudentController.addStudentPlan);



module.exports = router;
