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
            //remove isCorrect from response
            const testResponse = await db.TestResponse.findOne({ studentID: req.userId, paperID: paperID, testSeriesID: testSeriesID }).populate("questionList.qID").lean();

            //todo do it later
            await testResponse.questionList.map((val, ind) => {
                //  console.log(val.qID.correctOpt, val.response);
                val.qID = val.qID._id;
                if (val.qID.correctOpt == val.response) {
                    val.isCorrect = 1;
                } else {
                    val.isCorrect = 0;
                }

            })
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
        //setcorrect Ans
        /* const questiontbl = await db.Question.findOne({ '_id': response.qID });
         if (questiontbl.correctOpt == response.response) {
             response.isCorrect = 1;
         } else {
             response.isCorrect = 0;
         }*/
        //correct Ans
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
                            data: null,
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


    async removeStudentResponse(req, res) {
        var { testSeriesID, paperID, qID } = req.body;
        if (!paperID || !req.userId || !qID) {
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
                let tempResponseList = [];
                //update in questionList
                if (testResponse.questionList.length > 0) {

                    testResponse.questionList.map((val, ind) => {
                        if (val.qID != qID) {
                            tempResponseList.push(val);
                        }
                    })
                }
                testResponse.questionList = tempResponseList;
                testResponse.save((err) => {
                    if (!err) {
                        return res.json({
                            status: true,
                            message: "Test-Response Removed 👍",
                            data: null,
                        });
                    }
                    else { return res.json({ status: false, message: `${err}`, data: err }) };
                });


            } else {
                return res.json({
                    status: true,
                    message: "No Response Found 👍",
                    data: null,
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
                    // testResponse.examEndTime = date.addMinutes(new Date(), 330);
                    testResponse.examEndTime = new Date();
                    testResponse.examDone = 1;//submit
                }
                testResponse.save((err) => {
                    if (!err) {
                        return res.json({
                            status: true,
                            message: "Exam End 👍",
                            data: null,
                        });
                    }
                    else { return res.json({ status: false, message: `${err}`, data: err }) };
                });


            } else {
                if (examEndTime) {
                    return res.json({
                        status: true,
                        message: "Start Test Before ending Test 👍",
                        data: null,
                    });
                }
                var testResponseAdd = new db.TestResponse();

                testResponseAdd.testSeriesID = testSeriesID;
                testResponseAdd.paperID = paperID;
                testResponseAdd.studentID = req.userId;
                testResponseAdd.examEndTime = date.addMinutes(date.addMinutes(new Date(), 330), testPaper.duration);



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

    async getResultOfStudent(req, res) {
        var testSeriesID = req.params.testSeriesID;
        var paperID = req.params.paperID;
        if (!testSeriesID || !paperID) {
            return res.json({
                status: false,
                message: "Feilds are required for test paper",
                data: null,
            });
        }
        try {
            // calculate rank.
            let calculateRankList = []
            const testResponse = await db.TestResponse.find({ paperID: paperID, testSeriesID: testSeriesID }).populate("studentID").populate("paperID").populate("questionList.qID");
            if (testResponse) {
                let paper;
                testResponse.map((val, ind) => {
                    paper = val.paperID;
                    //  console.log(paper)
                    let _innerOut = {}
                    _innerOut._id = val._id
                    _innerOut.studentID = val.studentID;

                    //check isCorrect 
                    let responseList = [];

                    val.questionList.map((element, ind) => {
                        // console.log(element.qID.correctOpt, element.response)
                        // console.log(paper.questionList.includes(element.qID._id));
                        if (paper.questionList.includes(element.qID._id)) {
                            // remove Question
                            if (element.qID.correctOpt == element.response) {
                                element.isCorrect = 1;
                            } else {
                                element.isCorrect = 0;
                            }
                            responseList.push(element)

                        }
                    });





                    _innerOut.correct = responseList.filter(value => value.isCorrect == '1').length;
                    let inCorrect = responseList.filter(value => value.isCorrect != '1').length;
                    _innerOut.inCorrect = inCorrect;
                    let marks = ((_innerOut.correct) * paper.perQMarks) - (inCorrect * paper.perQNegMarks);
                    _innerOut.attemptQ = responseList.length;
                    _innerOut.unAttempt = paper.questionList.length - responseList.length;
                    _innerOut.marks = marks;
                    _innerOut.tltQ = paper.questionList.length;
                    let startTime = new Date(val.examStartTime);
                    let endTime = new Date(val.examEndTime);

                    let timeTaken = date.subtract(endTime, startTime);
                    //need to be done
                    timeTaken = timeTaken.toMinutes().toFixed(2);
                    if (timeTaken > paper.duration) timeTaken = paper.duration;
                    _innerOut.timeTaken = timeTaken + " mins";
                    _innerOut.timeTakenMin = parseFloat(timeTaken);
                    _innerOut.aggregate = "";
                    _innerOut.rank = "";
                    if (_innerOut.studentID) {
                        calculateRankList.push(_innerOut)
                    }

                })

                //need to add 
                // 3 condiation [marks,negitive marks,time]
                calculateRankList.sort((a, b) => b.marks - a.marks);

                calculateRankList.map(function (e, i) {
                    e.rank = (i + 1);
                    e.marks = e.marks + '/' + (paper.questionList.length * paper.perQMarks)
                    return e;
                });
            }


            return res
                .status(200)
                .json({ status: true, message: `Student Rank list`, data: calculateRankList });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    // delete response
    async deleteTestResponse(req, res) {
        var _id = req.params.id;
        try {
            var response = await db.TestResponse.findOne({ _id });

            response.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "TestResponse deleted",
                        data: response,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

}


module.exports = TestResponseController;