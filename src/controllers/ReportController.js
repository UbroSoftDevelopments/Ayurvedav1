const db = require("../models");
const config = require("../config");
class ReportController {
    // add Category
    async addReport(req, res) {

        var { testSeriesID, paperID, studentID, qID, comment } = req.body;

        var studentID = req.userId;
        if (!comment && !studentID)
            return res.json({
                status: false,
                message: "key name required for reportQuestion",
                data: null,
            });

        try {
            var reportQuestion = new db.ReportQuestion();
            reportQuestion.testSeriesID = testSeriesID;
            reportQuestion.paperID = paperID;
            reportQuestion.studentID = studentID;
            reportQuestion.qID = qID;
            reportQuestion.comment = comment;


            if (req.file != undefined) {
                reportQuestion.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                reportQuestion.img = ''
            }

            reportQuestion.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Your report added",
                        data: reportQuestion,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // get Category
    async getReport(req, res) {
        try {
            const reportQuestion = await db.ReportQuestion.find().populate("testSeriesID", "name").populate("paperID").populate("studentID").populate("qID");
            return res
                .status(200)
                .json({ status: true, message: `reportQuestion list`, data: reportQuestion });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }
    async updateReport(req, res) {
        var { _id, status } = req.body;
        if (!_id, !status)
            return res.json({
                status: false,
                message: "key _id status required for update Reported",
                data: req.body,
            });

        try {
            var reportQuestion = await db.ReportQuestion.findOne({ _id });
            reportQuestion.status = status;

            reportQuestion.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Reported Question updated to: " + status,
                        data: reportQuestion,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

}

module.exports = ReportController;