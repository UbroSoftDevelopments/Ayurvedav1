const date = require('date-and-time')
const db = require("../models");
const config = require("../config");
const ObjectId = require('mongodb').ObjectID;
class PerformanceController {

    async getAverageInTestSeriesByX(req, res) {
        var { testSeriesID, studentID } = req.body;
        if (!testSeriesID || !studentID)
            return res.json({
                status: false,
                message: "key testSeriesID and studentID required for Performance Report",
                data: null,
            });


        try {
            /* DATA EXAMPLE */
            let meanData = {
                highest: 0,
                average: 0,
                me: 0
            }


            /* DATA EXAMPLE */

            //Get Rank of All Student
            const testResponse = await db.TestResponse.find({ testSeriesID: testSeriesID }).populate("paperID").populate("questionList.qID");
            let percentageList = [];
            if (testResponse) {
                testResponse.map((val, ind) => {
                    let paper = val.paperID;
                    //check isCorrect 
                    let responseList = [];
                    val.questionList.map((element, ind) => {
                        if (paper.questionList.includes(element.qID._id)) {
                            if (element.qID.correctOpt == element.response) {
                                element.isCorrect = 1;
                            } else {
                                element.isCorrect = 0;
                            }
                            responseList.push(element)
                        }
                    });
                    let correct = responseList.filter(value => value.isCorrect == '1').length;
                    let inCorrect = responseList.filter(value => value.isCorrect != '1').length;
                    let marks = ((correct) * paper.perQMarks) - (inCorrect * paper.perQNegMarks);
                    let outOf = paper.questionList.length * paper.perQMarks

                    let studentFound = false;
                    percentageList.forEach(element1 => {
                        if (element1.studentID + "" == val.studentID + "") {
                            element1.marks = element1.marks + marks;
                            element1.outOf = element1.outOf + outOf;
                            studentFound = true;
                        }
                    });
                    if (!studentFound) {
                        percentageList.push({
                            studentID: val.studentID, marks: marks, outOf: outOf
                        })
                    }
                })
            }

            let percentageSum = 0;
            let highestPercentage = 0;
            percentageList.map((pval, pind) => {
                pval.percentage = parseFloat(((pval.marks / pval.outOf) * 100).toFixed(2));
                percentageSum += pval.percentage;
                if (highestPercentage < pval.percentage) {
                    highestPercentage = pval.percentage;
                }
                if (studentID == pval.studentID) {
                    meanData.me = pval.percentage;

                }
            })
            meanData.highest = parseFloat(highestPercentage).toFixed(2);
            meanData.average = parseFloat((percentageSum / percentageList.length).toFixed(2));


            return res
                .status(200)
                .json({ status: true, message: `Student Avaerge`, data: { percentageList: percentageList, meanData: meanData } });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getPendingPaper(req, res) {
        var { studentID } = req.body;

        if (!studentID) {
            return res.json({
                status: false,
                message: "key studentID required for Performance Report",
                data: null,
            });
        }

        /*  SAMPLE OUTPUT 
        [
            {
                testName: "",
                testId: "",
                tltPaper: 0,
                paperDone: 0,
                pendingPaper: 0
            }
        ]
          SAMPLE OUTPUT */
        try {
            var currentTime = date.addMinutes(new Date(), 330);
            const mytest = await db.studentPlan.find({ studentID: studentID, expireDate: { $gte: new Date() } }, { "testSeriesID": 1, _id: 0 }).populate({
                path: 'testSeriesID',
                populate: {
                    path: 'paperID',
                    model: 'testPaper',
                    select: '_id startDate'
                }
            }).lean();
            let result = []
            if (mytest) {
                mytest.map((val, ind) => {
                    if (val.testSeriesID) {
                        //get Active Paper List add to activePaper
                        val.testSeriesID.activePaper = [];
                        val.testSeriesID.paperID.forEach(element => {
                            var startDate = new Date(element.startDate);
                            if ((currentTime.getTime() > startDate.getTime())) {
                                val.testSeriesID.activePaper.push(element)
                            }
                        });

                        result.push(val.testSeriesID)
                    }
                })
            }
            //get Student Attempted TEST PAPER
            const testResponse = await db.TestResponse.find({ studentID }).select('paperID');
            let resList = []
            result.map((val, ind) => {
                let _out = {
                    testName: val.name,
                    desc: val.desc,
                    testId: val._id,
                    tltPaper: 0,
                    paperDone: 0,
                    pendingPaper: 0,
                    percentage: 0
                }
                val.activePaper.forEach(element => {
                    _out.tltPaper += 1;

                    var selProd = testResponse.find(p => p.paperID + "" == element._id + "");
                    if (selProd) {
                        _out.paperDone += 1;
                    } else {
                        _out.pendingPaper += 1;
                    }

                });
                _out.percentage = (_out.paperDone / _out.tltPaper) * 100;

                resList.push(_out);
            })
            return res
                .status(200)
                .json({ status: true, message: `My Test series List`, data: resList });
        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }


    async getAverageCustom(req, res) {
        var { testSeriesID, studentID, paperIds } = req.body;
        if (!testSeriesID || !studentID || !paperIds)
            return res.json({
                status: false,
                message: "key testSeriesID,paperIds and studentID required for Performance Report",
                data: null,
            });

        try {
            /* DATA EXAMPLE */
            let meanData = {
                highest: 0,
                average: 0,
                me: 0
            }
            var obj_ids = paperIds.map(function (id) { return ObjectId(id); });

            //Get Rank of All Student
            const testResponse = await db.TestResponse.find({ testSeriesID: testSeriesID, paperID: { $in: obj_ids } }).populate("paperID").populate("questionList.qID");

            let percentageList = [];
            if (testResponse) {
                testResponse.map((val, ind) => {
                    let paper = val.paperID;
                    //check isCorrect 
                    let responseList = [];
                    val.questionList.map((element, ind) => {
                        if (paper.questionList.includes(element.qID._id)) {
                            if (element.qID.correctOpt == element.response) {
                                element.isCorrect = 1;
                            } else {
                                element.isCorrect = 0;
                            }
                            responseList.push(element)
                        }
                    });
                    let correct = responseList.filter(value => value.isCorrect == '1').length;
                    let inCorrect = responseList.filter(value => value.isCorrect != '1').length;
                    let marks = ((correct) * paper.perQMarks) - (inCorrect * paper.perQNegMarks);
                    let outOf = paper.questionList.length * paper.perQMarks


                    let studentFound = false;
                    percentageList.forEach(element1 => {
                        if (element1.studentID + "" == val.studentID + "") {
                            element1.marks = element1.marks + marks;
                            element1.outOf = element1.outOf + outOf;
                            studentFound = true;
                        }
                    });
                    if (!studentFound) {
                        percentageList.push({
                            studentID: val.studentID, marks: marks, outOf: outOf
                        })
                    }
                })
            }

            let percentageSum = 0;
            let highestPercentage = 0;
            let ypercentageCount = 0
            percentageList.map((pval, pind) => {
                pval.percentage = parseFloat(((pval.marks / pval.outOf) * 100).toFixed(2));

                //let Y if percentage is grater then 30 for now
                if (pval.percentage >= 30) {
                    percentageSum += pval.percentage;
                    ++ypercentageCount;
                }

                if (highestPercentage < pval.percentage) {
                    highestPercentage = pval.percentage;
                }
                if (studentID == pval.studentID) {
                    meanData.me = pval.percentage;
                }
            })
            meanData.highest = parseFloat(highestPercentage).toFixed(2);
            meanData.average = parseFloat((percentageSum / ypercentageCount).toFixed(2));


            return res
                .status(200)
                .json({ status: true, message: `Student Avaerge`, data: { percentageList: percentageList, meanData: meanData } });

        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    async getAllResponseOfStudentByTestSeries(req, res) {
        var { testSeriesID, studentID } = req.body;
        if (!testSeriesID || !studentID)
            return res.json({
                status: false,
                message: "key testSeriesID, studentID required for Performance Report",
                data: null,
            });

        try {
            const testResponse = await db.TestResponse.find({ studentID: studentID, testSeriesID: testSeriesID }).populate("paperID").populate("questionList.qID")
                .populate({
                    path: 'paperID',
                    populate: {
                        path: 'questionList',
                        model: 'question'
                    }
                })
                .lean();


            if (testResponse) {
                testResponse.map((val, ind) => {
                    let paper = val.paperID;
                    let questionListStr = paper.questionList.map(val => { return val._id + '' });
                    //check isCorrect 

                    let responseList = [];
                    val.questionList.map((element, ind) => {


                        if (questionListStr.includes(element.qID._id + '')) {
                            if (element.qID.correctOpt == element.response) {
                                element.isCorrect = 1;
                            } else {
                                element.isCorrect = 0;
                            }
                            responseList.push(element)
                        }
                    });

                    let correct = responseList.filter(value => value.isCorrect == '1').length;
                    let inCorrect = responseList.filter(value => value.isCorrect != '1').length;
                    let marks = ((correct) * paper.perQMarks) - (inCorrect * paper.perQNegMarks);
                    let outOf = questionListStr.length * paper.perQMarks

                    let percentage = parseFloat(((marks / outOf) * 100).toFixed(2));

                    val.marksData = {
                        correct: correct,
                        inCorrect: inCorrect,
                        marks: marks,
                        outOf: outOf,
                        unattempted: questionListStr.length - (correct + inCorrect),
                        attempted: correct + inCorrect,
                        percentage: percentage > 0 ? percentage : 0
                    }
                })
            }


            //sort by Paper Name..

            testResponse.sort(function (a, b) {

                // Assuming you want case-insensitive comparison
                a = a.toLowerCase();
                b = b.toLowerCase();
                let a1 = a.paperID.title
                let b1 = b.paperID.title

                return (a1 < b1) ? -1 : (a1 > b1) ? 1 : 0;

            })


            return res
                .status(200)
                .json({ status: true, message: `My Test series Response`, data: testResponse });


        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getTestPaperBySeriesX(req, res) {
        try {
            var { testSeriesID, studentID } = req.body;
            if (!testSeriesID || !studentID)
                return res.json({
                    status: false,
                    message: "key testSeriesID and studentID required for Performance Report",
                    data: null,
                });


            let examDoneLessThenX = []

            const responseCount = await db.TestResponse.aggregate([{
                $match:
                    { 'testSeriesID': ObjectId(testSeriesID) }
            },
            { $group: { _id: "$paperID", paperResponseCount: { $sum: 1 } } },

            ]);
            // console.log("responseCount", responseCount);

            const testResponse = await db.TestResponse.find({ "studentID": studentID, "testSeriesID": testSeriesID }).populate('paperID', 'title');

            // await Promise.all([responseCount, testResponse]);

            //  console.log("testResponse", testResponse);


            if (testResponse) {
                testResponse.forEach(el => {
                    //Check X Count
                    let val = responseCount.find(item => {

                        return item._id + '' == el.paperID._id + ''
                    })
                    if (val) {
                        //change with admin
                        if (val.paperResponseCount > 10) {

                            examDoneLessThenX.push(el.paperID);
                        }
                    }

                });
            }




            return res
                .status(200)
                .json({ status: true, message: `My Test Paper List`, data: examDoneLessThenX });

        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    async getGivenPaper(req, res) {
        var { testSeriesID, studentID } = req.body;
        if (!testSeriesID || !studentID)
            return res.json({
                status: false,
                message: "key testSeriesID and studentID required for Performance Report",
                data: null,
            });
        try {
            const testResponsePaper = await db.TestResponse.find({ studentID: studentID, testSeriesID: testSeriesID })
                .populate("paperID");
            return res
                .status(200)
                .json({ status: true, message: `My Test series Response`, data: testResponsePaper });

        } catch (err) {
            return res
                .status(200)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }
}

module.exports = PerformanceController;