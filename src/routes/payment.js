const express = require("express");
const {PaymentController} = require("../controllers");
const router = express.Router();


router.post("/req", function (request, response){
	PaymentController.requestPayment(request, response);
});
router.post("/res", PaymentController.responsePayment);


module.exports = router;