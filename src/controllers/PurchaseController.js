const db = require("../models");
const config = require("../config");
const date = require('date-and-time')


class PurchaseController {

    // add Category
    async addOrder(req, res) {

        var merchantId = config.merchantId;
        var studentID = req.userId;

        var { promoCode, paidAmount } = req.body;
        if (!studentID)
            return res.json({
                status: false,
                message: "key Student ID and orderPlan required for category",
                data: null,
            });

        try {
            var order = new db.Order();
            order.studentID = studentID;
            order.promoCode = promoCode;
            order.paidAmount = paidAmount;
            order.merchantId = merchantId;

            order.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Order added",
                        data: order,
                    });
                else return res.json({ status: false, message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: "Something went wrong 🤚", data: err });
        }
    }

    // get Category
    async getPendingOrder(req, res) {
        try {
            var studentID = req.userId;
            const orders = await db.Order.find({ status: "PENDING", studentID: studentID });
            return res
                .status(200)
                .json({ status: true, message: `ORDER list`, data: orders });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    // TODO make changes to purchase update Category 
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
                else return res.json({ status: false, message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: "Something went wrong 🤚", data: err });
        }
    }

    //TODO make changes to purchase  delete Category
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
                else return res.json({ status: false, message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: "Something went wrong 🤚", data: err });
        }
    }

    //get my all purchase
    async getUserAllTransction(req, res) {
        try {

            var studentID = req.userId;
            const orders = await db.studentPlan.find({ studentID: studentID }).sort([['_id', -1]]).populate("orderID");
            return res
                .status(200)
                .json({ status: true, message: `ORDER list`, data: orders });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }


    async getUserAllTransctionByAdmin(req, res) {
        try {

            var studentID = req.params.id;
            const orders = await db.studentPlan.find({ studentID: studentID }).sort([['_id', -1]]).populate("courseID");
            return res
                .status(200)
                .json({ status: true, message: `ORDER list`, data: orders });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getSinglePlan(req, res) {
        try {
            var id = req.params.id;
            var studentID = req.userId;

            const order = await db.Order.findOne({ _id: id });

            const products = await db.studentPlan.find({ orderID: id, studentID: studentID })
                .populate("testSeriesID")
                .populate("courseID")
                .populate("subjectID");

            return res
                .status(200)
                .json({ status: true, message: `ORDER`, data: { order: order, products: products } });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }


    async addAllCourseOrder(req,res) {
        var merchantId = config.merchantId;

        var { studentID, paidAmount, totalAmount, pendingAmount, note, transactionMode, courseID, productList} = req.body;
        if (!studentID || !paidAmount || !courseID)
            return res.json({
                status: false,
                message: "key Student ID and orderPlan required for category",
                data: null,
            });

        try {
            var order = new db.Order();
            order.studentID = studentID;
            order.paidAmount = paidAmount;
            order.merchantId = merchantId;
            order.totalAmount = totalAmount;
            order.pendingAmount = pendingAmount;
            order.transactionMode = transactionMode;
            if(note) order.note = note;

            order.save((err) => {
                if (!err) {
                    //ASSIGN SUBJECT
                    //ASSIGN TEST
                    //ASSIGN LIVECLASS
                    const stdPlanList =[];
                    productList.map(val => { 
                        let stdPlan = {
                            studentID : studentID,
                            courseID : courseID,
                            subjectID : val._id,
                            plan : val.selectedPlan,
                            expireDate : date.addDays(new Date(), val.selectedPlan.days),
                            createdBy : req.username,       
                            orderID:order._id,
                            paperList:[]
                            
                        };
                        if (note) stdPlan.description = note;
                        stdPlanList.push(stdPlan)
                    })

                    db.studentPlan.insertMany(stdPlanList)
                    .then(result => {
                        return res
                        .status(200)
                        .json({ status: true, message: `ORDER Successfully added 💌`, data: { order: order } });
                      })
                      .catch(err =>{
                         return res.json({ status: false, message: "Something went wrong 🤚", data: err })
                      })

                }
                else return res.json({ status: false, message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: "Something went wrong 🤚", data: err });
        }
    }

}


module.exports = PurchaseController;