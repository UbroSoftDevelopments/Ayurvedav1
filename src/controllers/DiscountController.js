const db = require("../models");
const config = require("../config");
class DiscountController {

    // add Category
    async addDiscount(req, res) {

        var { courseID, oneSub, moreSub, allSub } = req.body;

        if (!courseID)
            return res.json({
                status: false,
                message: "key courseID required for Discount",
                data: null,
            });

        try {
            var discount = new db.Discount();

            discount.courseID = courseID;
            discount.oneSub = oneSub;
            discount.moreSub = moreSub;
            discount.allSub = allSub;

            discount.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "discount added",
                        data: discount,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // get discount 
    async getDiscount(req, res) {
        try {
            const discount = await db.Discount.find().populate('courseID', 'name');

            return res
                .status(200)
                .json({ status: true, message: `discount`, data: discount });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateDiscount(req, res) {
        var { courseID, oneSub, moreSub, allSub, _id } = req.body;
        if (!courseID, !_id)
            return res.json({
                status: false,
                message: "key name required for courseID, _id",
                data: null,
            });

        try {
            var discount = await db.Discount.findOne({ _id });

            discount.courseID = courseID;
            discount.oneSub = oneSub;
            discount.moreSub = moreSub;
            discount.allSub = allSub;
            discount.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Discount Updated",
                        data: discount,
                    });
                else return res.json({ status: false, message: ``, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: ``, data: err });
        }

    }

    async deleteDiscount(req, res) {
        var _id = req.params.id;

        try {
            var discount = await db.Discount.findOne({ _id });

            discount.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Discount deleteed",
                        data: discount,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getDiscountByCourse(req, res) {
        try {
            const discount = await db.Discount.findOne({ courseID: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `discount`, data: discount });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

}


module.exports = DiscountController;