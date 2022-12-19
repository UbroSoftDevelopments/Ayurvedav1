const db = require('../models');
const config = require("../config");
const date = require('date-and-time')

class TestResponseController {

    async getQuestionByStudent(req, res) {

        var { studentID, paperID } = req.body;
        try {
            const testResponse = await db.TestResponse.find({ studentID: studentID, paperID: paperID });
            return res
                .status(200)
                .json({ status: true, message: `Response list`, data: testResponse });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getResponseOfStudent(req, res) {
        var testSeriesID = req.params.testSeriesID;
        var paperID = req.params.paperID;
        if (!testSeriesID || !req.userId || !paperID) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper",
                data: null,
            });
        }
        try {
            const testResponse = await db.TestResponse.find({ studentID: req.userId, paperID: paperID, testSeriesID: testSeriesID });
            return res
                .status(200)
                .json({ status: true, message: `Student Response list`, data: testResponse });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    async setStudentResponse(req, res) {

        var { testSeriesID, paperID, response } = req.body;
        if (!paperID || !req.userId || !response) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper",
                data: null,
            });
        }

        try {
            let findObj = {
                paperID: paperID,
                studentID: req.userId,
                testSeriesID: testSeriesID
            }
            var testResponse = await db.TestResponse.findOne(findObj);
            //check ans
            if (testResponse) {
                //update in questionList
                var isExist = false;
                if (testResponse.questionList.length > 0) {
                    testResponse.questionList.map((val, ind) => {
                        if (val.qID == response.qID) {
                            val.response = response.response;
                            val.qstatus = response.qstatus;
                            val.isCorrect = response.isCorrect;
                            isExist = true;
                        }
                    })
                }
                if (!isExist) {
                    testResponse.questionList.push(response);
                }
                testResponse.save((err) => {
                    if (!err) {
                        return res.json({
                            status: true,
                            message: "Test-Response Added 👍",
                            data: testResponse,
                        });
                    }
                    else { return res.json({ status: false, message: `${err}`, data: err }) };
                });


            } else {
                var testResponseAdd = new db.TestResponse();
                testResponseAdd.testSeriesID = testSeriesID;
                testResponseAdd.paperID = paperID;
                testResponseAdd.studentID = req.userId;
                testResponseAdd.questionList.push(response);

                testResponseAdd.save((err) => {
                    if (!err) {
                        return res.json({
                            status: true,
                            message: "Test-Response Added 👍",
                            data: testResponseAdd,
                        });
                    }
                    else { return res.json({ status: false, message: `${err}`, data: err }) };
                });
            }

        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async setTestStartEndTime(req, res) {
        var { testSeriesID, paperID, examStartTime, examEndTime } = req.body;
        if (!paperID || !req.userId) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper ",
                data: null,
            });
        }

        try {

            var testPaper = await db.TestPaper.findOne({ _id: paperID });

            // testPaper.duration; added to starttime and save in endtime

            let findObj = {
                paperID: paperID,
                studentID: req.userId,
                testSeriesID: testSeriesID
            }
            var testResponse = await db.TestResponse.findOne(findObj);
            //check ans
            if (testResponse) {
                //update in questionList
                if (examEndTime) {
                    testResponse.examEndTime = new Date();
                }
                testResponse.save((err) => {
                    if (!err) {
                        return res.json({
                            status: true,
                            message: "Exam End 👍",
                            data: testResponse,
                        });
                    }
                    else { return res.json({ status: false, message: `${err}`, data: err }) };
                });


            } else {
                if (examEndTime) {
                    return res.json({
                        status: true,
                        message: "Start Test Before ending Text 👍",
                        data: null,
                    });
                }
                var testResponseAdd = new db.TestResponse();

                testResponseAdd.testSeriesID = testSeriesID;
                testResponseAdd.paperID = paperID;
                testResponseAdd.studentID = req.userId;
                if (examStartTime) {
                    testResponseAdd.examStartTime = new Date();
                    testResponseAdd.examEndTime = date.addMinutes(new Date(), testPaper.duration);
                }


                testResponseAdd.save((err) => {
                    if (!err) {
                        return res.json({
                            status: true,
                            message: "Exam Started 👍",
                            data: testResponseAdd,
                        });
                    }
                    else { return res.json({ status: false, message: `${err}`, data: err }) };
                });
            }

        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }
}


module.exports = TestResponseController;