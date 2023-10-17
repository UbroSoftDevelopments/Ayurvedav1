const express = require("express");
const { CartController } = require("../controllers");
const router = express.Router();
const { checkStudentAuth } = require("../middleware");


router.put("/", checkStudentAuth, CartController.addToCart);
router.get("/", checkStudentAuth, CartController.getCart);



module.exports = router;