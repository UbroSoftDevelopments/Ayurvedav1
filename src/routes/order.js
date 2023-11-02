const express = require("express");
const {PurchaseController} = require("../controllers");
const { checkAdminAuth, checkStudentAuth } = require("../middleware");

const router = express.Router();


router.get("/", checkStudentAuth,PurchaseController.getUserAllTransction);
router.get("/course/:id", checkAdminAuth,PurchaseController.getUserAllTransctionByAdmin);

router.post("/", checkStudentAuth,PurchaseController.addOrder);
router.get("/plan/:id", checkStudentAuth,PurchaseController.getSinglePlan);

router.post("/course", checkAdminAuth,PurchaseController.addAllCourseOrder);



module.exports = router;