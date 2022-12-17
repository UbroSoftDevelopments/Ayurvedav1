const db = require('../models');
const config = require("../config");
const date = require('date-and-time')

class TestResponseController {

    async getQuestionByStudent(req, res) {

        var { studentID } = req.body;
        try {
            const testResponse = await db.TestResponse.find({ studentID: studentID });
            return res
                .status(200)
                .json({ status: true, message: `Response list`, data: testResponse });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async setStudentResponse(req, res) {

        var { courseID, testSeriesID, paperID, studentID, response } = req.body;
        if (!paperID || !studentID || !response) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper",
                data: null,
            });
        }

        try {
            let findObj = {
                paperID: paperID,
                studentID: studentID,
                testSeriesID: testSeriesID,
                courseID: courseID
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
                testResponseAdd.courseID = courseID;
                testResponseAdd.testSeriesID = testSeriesID;
                testResponseAdd.paperID = paperID;
                testResponseAdd.studentID = studentID;
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
        var { courseID, testSeriesID, paperID, studentID, examStartTime, examEndTime } = req.body;
        if (!paperID || !studentID) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper",
                data: null,
            });
        }

        try {

            var testPaper = await db.TestPaper.findOne({ _id: paperID });
            // testPaper.duration; added to starttime and save in endtime
            examEndTime = new Date(examEndTime);
            let findObj = {
                paperID: paperID,
                studentID: studentID,
                testSeriesID: testSeriesID,
                courseID: courseID
            }
            var testResponse = await db.TestResponse.findOne(findObj);
            //check ans
            if (testResponse) {
                //update in questionList
                testResponse.examEndTime = examEndTime;

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
                testResponseAdd.courseID = courseID;
                testResponseAdd.testSeriesID = testSeriesID;
                testResponseAdd.paperID = paperID;
                testResponseAdd.studentID = studentID;
                testResponseAdd.examStartTime = examStartTime;
                testResponseAdd.examEndTime = date.addMinutes(examStartTime, testPaper.duration);
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
}


module.exports = TestResponseController;