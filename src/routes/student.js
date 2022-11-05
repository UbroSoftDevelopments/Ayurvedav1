const express = require("express");
const { checkAuth } = require("../middleware");
const { StudentController } = require("../controllers");
const router = express.Router();
//router.get('/' , StudentController.test);
router.post("/registration", StudentController.studentRegister);
router.post("/login", StudentController.studentLogin);
router.get("/categoryCourse/:id", StudentController.getCategoryCourseById);

module.exports = router;
