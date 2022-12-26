const db = require("../models");
const config = require("../config");
const date = require('date-and-time')
class TestPaperController {

    async addTestPaper(req, res) {

        var { rankStartDate, rankEndDate, qType, isActive, chapterID, title, img, desc, totalQuestions, totalMarks, perQMarks, perQNegMarks, cutoff, duration, startDate, endDate, questionList } = req.body;


        if (!qType || !title || !totalQuestions) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper",
                data: null,
            });
        }


        try {
            var testPaper = new db.TestPaper();
            testPaper.rankStartDate = rankStartDate;
            testPaper.rankEndDate = rankEndDate;
            testPaper.qType = qType;
            testPaper.isActive = isActive;
            testPaper.chapterID = chapterID;
            testPaper.title = title;
            testPaper.img = img;
            testPaper.desc = desc;
            testPaper.totalQuestions = totalQuestions;
            testPaper.totalMarks = totalMarks;
            testPaper.perQMarks = perQMarks;
            testPaper.perQNegMarks = perQNegMarks;
            testPaper.cutoff = cutoff;
            testPaper.duration = duration;
            testPaper.startDate = startDate;
            testPaper.endDate = endDate;
            testPaper.questionList = [...new Set(JSON.parse(questionList))];
            if (req.file != undefined) {
                testPaper.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                testPaper.img = ''
            }

            testPaper.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Test Paper Added added",
                        data: testPaper,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getTestPaper(req, res) {
        try {
            const testPaper = await db.TestPaper.find().populate("chapterID");;
            return res
                .status(200)
                .json({ status: true, message: `testPaper list`, data: testPaper });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateTestPaper(req, res) {
        var { _id, questionList, rankStartDate, rankEndDate, qType, isActive, chapterID, title, img, desc, totalQuestions, totalMarks, perQMarks, perQNegMarks, cutoff, duration, startDate, endDate } = req.body;
        if (!_id || !qType || !totalQuestions || !title)
            return res.json({
                status: false,
                message: "Feilds are required for Test",
                data: null,
            });
        try {
            var testPaper = await db.TestPaper.findOne({ _id });

            if (rankStartDate) testPaper.rankStartDate = rankStartDate;
            if (rankEndDate) testPaper.rankEndDate = rankEndDate;
            if (qType) testPaper.qType = qType;
            if (isActive) testPaper.isActive = isActive;
            if (chapterID) testPaper.chapterID = chapterID;
            if (title) testPaper.title = title;
            if (img) testPaper.img = img;
            if (desc) testPaper.desc = desc;
            if (totalQuestions) testPaper.totalQuestions = totalQuestions;
            if (totalMarks) testPaper.totalMarks = totalMarks;
            if (perQMarks) testPaper.perQMarks = perQMarks;
            if (perQNegMarks) testPaper.perQNegMarks = perQNegMarks;
            if (cutoff) testPaper.cutoff = cutoff;
            if (duration) testPaper.duration = duration;
            if (startDate) testPaper.startDate = startDate;
            if (endDate) testPaper.endDate = endDate;
            if (questionList) testPaper.questionList = [...new Set(JSON.parse(questionList))];

            if (req.file != undefined) {
                testPaper.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                testPaper.img = ''
            }
            testPaper.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "testPaper updated 👍",
                        data: testPaper,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async deleteTestPaper(req, res) {
        var _id = req.params.id;


        try {
            var testPaper = await db.TestPaper.findOne({ _id });

            testPaper.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "testPaper deleted",
                        data: testPaper,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getTestPaperByChapterId(req, res) {

        const id = req.params.id;
        try {
            const testPaper = await db.TestPaper.find({ 'chapterID': id });
            return res
                .status(200)
                .json({ status: true, message: `testPaper list`, data: testPaper });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    async getTestPaperById(req, res) {

        const id = req.params.id;
        try {

            const testPaper = await db.TestPaper.findOne({ '_id': id }).populate('questionList').lean();
            //todo need to add testSeries.
            const testResponse = await db.TestResponse.findOne({ studentID: req.userId, paperID: id }).lean();
            if (testResponse) {
                if (testResponse.examStartTime) {

                    var startTime = new Date(testResponse.examStartTime).getTime();
                    var currentTime = (date.addMinutes(new Date(), 330)).getTime();
                    var remaningTime = Math.round((startTime - currentTime) / 60000);
                    if (remaningTime < 0) { remaningTime = 0 }
                    testPaper.remaningTime = remaningTime;
                    testPaper.debbug = {
                        "examStartTime": startTime,
                        "current-Time": currentTime,
                        "serverTime": new Date().getTime()
                    }
                }
            }
            return res
                .status(200)
                .json({ status: true, message: `Test Paper `, data: testPaper });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }


    async getStudentTestPaperById(req, res) {

        const id = req.params.id;
        try {
            const testPaper = await db.TestPaper.findOne({ '_id': id }).populate("questionList");
            return res
                .status(200)
                .json({ status: true, message: `Test Paper `, data: testPaper });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    async getAssignStudentByPaper(req, res) {
        // paperList: req.params.paperID, testSeriesID: req.params.testSeriesID 

        try {
            var output = [];
            const studentData = await db.studentPlan.find({ testSeriesID: req.params.testSeriesID }).populate('studentID').lean();

            studentData.map((val, ind) => {
                if (val.paperList.length > 0) {
                    //check is present or not

                    val.paperList.map((item) => {
                        if (item + '' == req.params.paperID) {
                            output.push(val.studentID)
                        }

                    });


                }
                else {
                    output.push(val.studentID)
                }
            });
            return res
                .status(200)
                .json({ status: true, message: `Student list`, data: output });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }
}

module.exports = TestPaperController;