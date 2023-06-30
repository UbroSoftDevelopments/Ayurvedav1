const express = require("express");

const { AdminController } = require("../controllers");
const { checkAdminAuth } = require("../middleware");

const router = express.Router();


router.post("/login", AdminController.login);
//remove SignUp
router.post("/signup", AdminController.signup);
router.put("/update-profile", checkAdminAuth, AdminController.updateProfile);
router.put("/password", checkAdminAuth, AdminController.updatePassword);

router.get("/checkAdmin", checkAdminAuth, AdminController.checkAdmin)

router.get('/purchaseCount',AdminController.getPerchaceCount)


module.exports = router;
