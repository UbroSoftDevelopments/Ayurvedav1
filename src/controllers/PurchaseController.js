const db = require("../models");
const config = require("../config");
class PurchaseController {

    // add Category
    async addOrder(req, res) {

        merchantId = config.merchantId;
        var { studentID, orderPlan, promoCode,totalAmount } = req.body;
        if (!studentID || !orderPlan)
            return res.json({
                status: false,
                message: "key Student ID and orderPlan required for category",
                data: null,
            });

        try {
            var order = new db.Order();
            order.studentID = studentID;
            order.orderPlan = orderPlan;
            order.promoCode = promoCode;
            order.totalAmount = totalAmount;

            order.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Order added",
                        data: order,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }   

    // get Category
    async getPendingOrder(req, res) {
        try {
            var studentID = req.userId;
            const orders = await db.Category.find({ status:"PENDING",studentID:studentID});
            return res
                .status(200)
                .json({ status: true, message: `ORDER list`, data: orders });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    // update Category
    async updateCategory(req, res) {
        var { _id, name, tab, detail, isActive } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for category",
                data: req.body,
            });

        try {
            var category = await db.Category.findOne({ _id });
            if (name) category.name = name;
            if (tab) category.tab = tab;
            if (detail) category.detail = detail;
            if (isActive) category.isActive = isActive;
            category.updatedBy = req.username;

            if (req.file != undefined) {
                category.img = `${config.uploadFolder}/${req.fileName}`;
            }

            category.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Category updated",
                        data: category,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // delete Category
    async deleteCategory(req, res) {
        var _id = req.params.id;

        try {
            var category = await db.Category.findOne({ _id });

            category.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Category deleteed",
                        data: category,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }




}


module.exports = PurchaseController;