const express = require("express");

const { AdminController } = require("../controllers");

const router = express.Router();


router.post("/login", AdminController.login);
router.post("/signup", AdminController.signup);
router.put("/update-profile", AdminController.updateProfile);
router.put("/password", AdminController.updatePassword);




module.exports = router;
