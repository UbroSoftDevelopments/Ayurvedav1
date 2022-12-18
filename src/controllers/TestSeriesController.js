const db = require("../models");
const config = require("../config");


class TestSeriesController {


    async addTestSeries(req, res) {
        var { name, desc, plan, isActive, activeDate, deactiveDate, courseID } = req.body;

        if (!name)
            return res.json({
                status: false,
                message: "key name required for subject",
                data: null,
            });

        try {
            var testSeries = new db.TestSeries();
            testSeries.name = name;
            testSeries.desc = desc;
            testSeries.activeDate = activeDate;
            testSeries.deactiveDate = deactiveDate;
            testSeries.courseID = JSON.parse(courseID);


            if (plan) testSeries.plan = JSON.parse(plan);

            if (req.file != undefined) {
                testSeries.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                testSeries.img = ''
            }

            if (isActive) testSeries.isActive = isActive;



            testSeries.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new testSeries added 👍",
                        data: testSeries,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getTestSeries(req, res) {
        try {
            var testSeries = await db.TestSeries.find().populate("paperID");
            return res
                .status(200)
                .json({ status: true, message: `testSeries list`, data: testSeries });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getTestSeriesByCourse(req, res) {
        try {
            var testSeries = await db.TestSeries.find({ courseID: req.params.id });
            return res
                .status(200)
                .json({ status: true, message: `testSeries list`, data: testSeries });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }


    async addPaperToTest(req, res) {
        var { testSeries, testPaper } = req.body;
        if (!testSeries)
            return res.json({
                status: false,
                message: "key _id,name required for testSeries",
                data: req.body,
            });

        try {
            var testSeries = await db.TestSeries.findOne({ _id: testSeries });
            if (testPaper) testSeries.paperID = testPaper;
            testSeries.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Test Series updated 👍",
                        data: testSeries,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getSubjectById(req, res) {
        try {
            const subject = await db.Subject.findOne({ _id: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `subject `, data: subject });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateTestSeries(req, res) {
        var { _id, name, desc, plan, isActive, activeDate, deactiveDate, paperID, courseID } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id,name required for testSeries",
                data: req.body,
            });

        try {
            var testSeries = await db.TestSeries.findOne({ _id });

            if (name) testSeries.name = name;
            if (desc) testSeries.desc = desc;
            if (activeDate) testSeries.activeDate = activeDate;
            if (deactiveDate) testSeries.deactiveDate = deactiveDate;
            if (plan) testSeries.plan = JSON.parse(plan);
            if (paperID) testSeries.paperID = JSON.parse(paperID);
            if (courseID) testSeries.courseID = JSON.parse(courseID);
            if (isActive) testSeries.isActive = isActive;
            if (req.file != undefined) {
                testSeries.img = `${config.uploadFolder}/${req.fileName}`;
            }


            testSeries.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "subject updated 👍",
                        data: testSeries,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // delete subject
    async deleteTestSeries(req, res) {
        var _id = req.params.id;
        try {
            var testSeries = await db.TestSeries.findOne({ _id });

            testSeries.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "testSeries deleted",
                        data: testSeries,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }


    async getSubjectByCourseId(req, res) {
        try {
            const subject = await db.Subject.find({ courseID: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `subject list`, data: subject });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    async getActiveSubjectByCourseId(req, res) {
        try {
            const subject = await db.Subject.find({ isActive: 1, courseID: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `subject list`, data: subject });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


}


module.exports = TestSeriesController;
