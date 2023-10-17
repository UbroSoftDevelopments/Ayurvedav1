const db = require("../models");
const commonMethod = require("../config/commonMethod");
class CartController {

    // add Category
    async addToCart(req, res) {
        let logCount = 0;
        var studentID = req.userId;
        var { courseID, subjectList, liveClassList, testSeriesList } = req.body;

        if (!courseID || !subjectList || !liveClassList || !testSeriesList)
            return res.json({
                status: false,
                message: "key courseID,subjectList, liveClassList, testSeriesList required for adding Cart",
                data: null,
            });

        try {
            let cart = await db.Cart.findOne({studentID:studentID});
            if(!cart){
                cart = new db.Cart();

            }

            cart.studentID = studentID;
            cart.courseID = courseID;
            cart.subjectList = subjectList;
            cart.liveClassList = liveClassList;
            cart.testSeriesList = testSeriesList;

            let discountValue = await  commonMethod.getDiscount(cart); 

            cart.save((err) => {
                if (!err){
                    return res.json({
                        status: true,
                        message: "Cart Updated",
                        data: {cart,discountValue},
                    });
                }
                else return res.json({ status: false,  message: "Something went wrong while saving 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // get discount 
    async getCart(req, res) {
        var studentID = req.userId;
        try {
            let cart = await db.Cart.findOne({studentID:studentID});
            let discountValue = await  commonMethod.getDiscount(cart); 

            return res
                .status(200)
                .json({ status: true, message: `Cart Value`, data: {cart,discountValue} });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }
}


module.exports = CartController;