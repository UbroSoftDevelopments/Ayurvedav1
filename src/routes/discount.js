const express = require("express");
const { DiscountController } = require("../controllers");
const router = express.Router();
const { checkAdminAuth } = require("../middleware");



router.post("/", checkAdminAuth, DiscountController.addDiscount);
router.put("/", checkAdminAuth, DiscountController.updateDiscount);
router.get("/", DiscountController.getDiscount);
router.get("/course/:id", DiscountController.getDiscountByCourse);


router.delete("/:id", checkAdminAuth, DiscountController.deleteDiscount);


module.exports = router;