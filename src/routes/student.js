const express = require("express");
const { checkAuth } = require("../middleware");
const { StudentController } = require("../controllers");
const router = express.Router();


router.get("/", StudentController.getAllStudent);


router.post("/registration", StudentController.studentRegister);
router.post("/login", StudentController.studentLogin);



module.exports = router;
