const express = require("express");
const {PurchaseController} = require("../controllers");
const { checkAdminAuth, checkStudentAuth } = require("../middleware");

const router = express.Router();


router.get("/", checkStudentAuth,PurchaseController.getUserAllTransction);
router.post("/", checkStudentAuth,PurchaseController.addOrder);
router.get("/:id", checkStudentAuth,PurchaseController.getSinglePlan);



module.exports = router;