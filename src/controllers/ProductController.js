const date = require('date-and-time')
const db = require("../models");

class ProductController {
    constructor() {
        //
    }


    async getStudentPlan(req, res) {
        try {
            const subPlan = await db.studentPlan.find({ studentID: req.params.id }).populate('courseID').populate('subjectID')
                .populate('testSeriesID').populate('paperList').populate('liveClassID');

            return res
                .status(200)
                .json({ status: true, message: `Product list`, data: subPlan });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    async addStudentPlan(req, res) {
        let { studentID, courseID, subjectID, liveClassID, plan, description } = req.body;

        if (!studentID || !courseID || !plan) {
            return res.json({
                status: false,
                message: "Must provide all input 🙄",
                data: null,
            });
        }


        try {

            let findValue = { studentID: studentID };
            if (subjectID) findValue.subjectID = subjectID;
            if (liveClassID) findValue.liveClassID = liveClassID;

            /* const studentData = await db.studentPlan.find(findValue);
 
             if (studentData) {
                 var already = false;
                 studentData.map((_v, _ind) => {
                     if (plan.lable == _v.plan.lable && plan.days == _v.plan.days) {
                         already = true;
                     }
                 })
 
                 if (already) {
                     return res.json({
                         status: true,
                         message: " Plan is already assign to student.💸 ",
                         data: findValue,
                     });
                 }
 
             }  */

            const stdPlan = await db.studentPlan();
            stdPlan.studentID = studentID;
            stdPlan.courseID = courseID;
            if (subjectID) stdPlan.subjectID = subjectID;
            if (liveClassID) stdPlan.liveClassID = liveClassID;
            stdPlan.plan = plan;
            if (description) stdPlan.description = description;
            //added Expire Date
            stdPlan.expireDate = date.addDays(new Date(), plan.days);
            stdPlan.createdBy = req.username;

            stdPlan.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "New plan added 💸",
                        data: stdPlan,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async addStudentLiveclass(req, res) {
        let { studentID, courseID, liveClassID, plan, description } = req.body;

        if (!studentID || !courseID || !plan || !liveClassID) {
            return res.json({
                status: false,
                message: "Must provide all input 🙄",
                data: null,
            });
        }


        try {

            let findValue = { studentID: studentID };
            findValue.liveClassID = liveClassID;

            const stdPlan = await db.studentPlan();
            stdPlan.studentID = studentID;
            stdPlan.courseID = courseID;
            stdPlan.liveClassID = liveClassID;
            stdPlan.plan = plan;
            if (description) stdPlan.description = description;
            //added Expire Date
            stdPlan.expireDate = date.addDays(new Date(), plan.days);
            stdPlan.createdBy = req.username;
            stdPlan.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "New Live CLass plan added 💸",
                        data: stdPlan,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async addStudentTestSeries(req, res) {
        let { studentID, paperList, testSeriesID, plan, description } = req.body;
        if (!studentID || !testSeriesID || !plan) {
            return res.json({
                status: false,
                message: "Must provide all input 🙄",
                data: null,
            });
        }

        try {
            const studentData = await db.studentPlan.find({ studentID: studentID, testSeriesID: testSeriesID });
            //   if (paperList.length != 0) {


            if (studentData) {
                var already = false;

                //remove student Response:
                var testResponse = await db.TestResponse.findOne({ 'studentID': studentID, 'testSeriesID': testSeriesID, 'paperID': { '$in': paperList } });
                if (testResponse) {
                    testResponse.remove((err) => {
                        if (err) return res.json({ status: false,  message: "Something went wrong 🤚", data: err });

                    });
                }

            }


            const stdPlan = await db.studentPlan();
            stdPlan.studentID = studentID;
            stdPlan.paperList = [...new Set(paperList)];
            stdPlan.testSeriesID = testSeriesID;
            stdPlan.plan = plan;
            if (description) stdPlan.description = description;
            //added Expire Date
            stdPlan.expireDate = date.addDays(new Date(), plan.days);
            stdPlan.createdBy = req.username;
            stdPlan.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "New plan added 💸",
                        data: stdPlan,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }

    }

    async editPlan(req, res) {

    }
    // delete Category
    async deleteStudentPlan(req, res) {
        var _id = req.params.id;

        try {
            var stdPlan = await db.studentPlan.findOne({ _id });
            stdPlan.expireDate =new Date();
            stdPlan.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Product Expired 😮‍💨",
                        data: stdPlan,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async removePaperFromTest(req, res) {
        let { studentID, testSeriesID, paperID, plan } = req.body;
        if (!studentID || !testSeriesID || !paperID || !plan) {
            return res.json({
                status: false,
                message: "Must provide all input 🙄",
                data: null,
            });
        }

        try {
            const studentData = await db.studentPlan.find({ studentID: studentID, testSeriesID: testSeriesID, expireDate: { $gte: new Date() } });
            //   if (paperList.length != 0) {
            if (studentData) {
                //remove
                studentData.map((_v, _ind) => {
                    if (plan.lable == _v.plan.lable && plan.days == _v.plan.days) {

                        let newPaper = [];

                        newPaper = _v.paperList.filter(function (ele) {
                            return ele != paperID;
                        });


                        // console.log(...new Set(newPaper));
                        _v.paperList = [...new Set(newPaper)];
                        _v.save();
                    }
                })
                return res.json({
                    status: true,
                    message: " Test is updated to student.💸 ",
                    data: null,
                });
            }
            return res.json({
                status: true,
                message: " No Data Found.🤪 ",
                data: null,
            });
            //  }


        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }


    //! add 3 day demo

    async addThreeDayDemo(req, res){
        let {  courseID, subjectID } = req.body;
        let studentID = req.userId;
        let plan = {
            lable:"Demo",
            days:3,
            amount:0,
            gstRate:18,
            sacCode:"999241"
        }

        if (!subjectID || !courseID || !plan) {
            return res.json({
                status: false,
                message: "Must provide all input 🙄",
                data: null,
            });
        }
        try {    

            let findValue = { studentID: studentID,subjectID:subjectID };
             const studentData = await db.studentPlan.find(findValue);
 
             if (studentData) {
                 var already = false;
                 studentData.map((_v, _ind) => {
                     if (plan.lable == _v.plan.lable && plan.days == _v.plan.days) {
                         already = true;
                     }
                 })
 
                 if (already) {
                     return res.json({
                         status: false,
                         message: " Plan is already assign to you.💸 ",
                         data: findValue,
                     });
                 }
 
             }  
             const stdPlan = await db.studentPlan();
             stdPlan.studentID = studentID;
             stdPlan.courseID = courseID;
             stdPlan.subjectID = subjectID;

             stdPlan.plan = plan;
             //added Expire Date
             stdPlan.expireDate = date.addDays(new Date(), plan.days);
             stdPlan.createdBy = "Student: "+req.username;
 
             stdPlan.save((err) => {
                 if (!err)
                     return res.json({
                         status: true,
                         message: "Your 3 day demo is activated 💸",
                         data: stdPlan,
                     });
                 else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
             });

        
            
        } catch (error) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }




    //todo isAvtive validation is left
    async getMyCourse(req, res) {
        try {
            //  const mycourse = await db.studentPlan.find({ studentID: req.userId }, { "courseID": 1, _id: 0 }).populate('courseID');
            await db.studentPlan
                .find({ studentID: req.userId, expireDate: { $gte: new Date() } })
                .distinct('courseID', function (error, ids) {
                    db.Course.find({ 'isActive': '1', '_id': { $in: ids } }, function (err, result) {
                        return res
                            .status(200)
                            .json({ status: true, message: `My Course list`, data: result });
                    });
                });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🙃",
                data: `${err}`,
            });
        }
    }

    //todo isAvtive validation is left
    async getMySubjectByCourse(req, res) {
        try {
            const mysubject = await db.studentPlan.find({ studentID: req.userId, courseID: req.params.id, expireDate: { $gte: new Date() } }, { "subjectID": 1, _id: 0 }).populate('subjectID').lean();
            let result = []
            if (mysubject) {
                for (let elem of mysubject) {
                    //check plan is valid or not.
                    if(elem.subjectID){
                    let chapCount = 0;
                    const subSubject = await db.SubSubject.find({ subjectID: elem.subjectID._id }).lean();
                    for (let _el of subSubject) {
                        chapCount += _el.chapterID.length;
                    }
                    elem.subjectID.chapCount = chapCount;
                  
                    result.push(elem.subjectID)
                    
                }
                }
            }

            return res
                .status(200)
                .json({ status: true, message: `My Subject list`, data: result });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    //is avitve is validated
    async getMyChapterBySubject(req, res) {
        try {
            const mysubject = await db.studentPlan.findOne({ studentID: req.userId, subjectID: req.params.id, expireDate: { $gte: new Date() } });
            // if (!mysubject) {
            //     return res.json({
            //         status: false,
            //         message: "Chapter not found in your product. 🧺",
            //         data: null,
            //     });
            // }
            //call get chapter detail
            const subsubject = await db.SubSubject.find({ subjectID: req.params.id, isActive: 1 }).populate({
                path: 'chapterID',
                match: { isActive: 1 }
            }).lean();


            subsubject.map((val, ind) => {
                if (!mysubject) {
                    val.isPurchase = false;
                    if (val.isDemo == 0) {
                        val.chapterID.map((_v, _i) => {
                            //   _v._id = "";  //todo need to check
                        })
                    }
                    else if (val.isDemo == 1) {
                        val.isPurchase = true;
                    }
                }
                else {
                    val.isPurchase = true;
                }
            })

            return res.json({
                status: true,
                message: "My Chapter List",
                data: subsubject,
            });


        } catch (err) {
            return res.json({
                status: false,
                message: "Something went wrong 🤚",
                data: `${err}`,
            });
        }

    }

    async getMyVideoByChapter(req, res) {

        try {
            const sub_subject = await db.SubSubject.findOne({ _id: req.params.subId });

            if (!sub_subject) {
                return res.json({
                    status: false,
                    message: "Video not found. 🧺",
                    data: null,
                });
            }
            if (sub_subject.isDemo != 1) {
                const student = await db.studentPlan.findOne({ studentID: req.userId, subjectID: sub_subject.subjectID, expireDate: { $gte: new Date() } });
                if (!student) {
                    return res.json({
                        status: false,
                        message: "Video not found in your product. 🧺",
                        data: null,
                    });
                }
            }

            //check chapter id before
            const videos = await db.Video.find({ 'chapterID': req.params.id });
            return res
                .status(200)
                .json({ status: true, message: `Videos list`, data: videos });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }

    }

    async getMyNotesByChapter(req, res) {

        try {
            const sub_subject = await db.SubSubject.findOne({ _id: req.params.subId });

            if (!sub_subject) {
                return res.json({
                    status: false,
                    message: "Notes not found. 🧺",
                    data: null,
                });
            }
            if (sub_subject.isDemo != 1) {
                const student = await db.studentPlan.findOne({ studentID: req.userId, subjectID: sub_subject.subjectID, expireDate: { $gte: new Date() } });
                if (!student) {
                    return res.json({
                        status: false,
                        message: "Notes not found in your product. 🧺",
                        data: null,
                    });
                }
            }

            //check chapter id before
            const notes = await db.Notes.find({ 'chapterID': req.params.id });
            return res
                .status(200)
                .json({ status: true, message: `notes list`, data: notes });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }

    }

    async getMyTestSeries(req, res) {
        try {
            const mytest = await db.studentPlan.find({ studentID: req.userId, expireDate: { $gte: new Date() } }, { "testSeriesID": 1, _id: 0 }).populate('testSeriesID');
            let result = []
            if (mytest) {
                mytest.map((val, ind) => {
                    if (val.testSeriesID) result.push(val.testSeriesID)
                })
            }

            return res
                .status(200)
                .json({ status: true, message: `My Test series List`, data: result });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async getMyPaperBySeries(req, res) {
        try {
            const mytest = await db.studentPlan.findOne({ studentID: req.userId, testSeriesID: req.params.id, expireDate: { $gte: new Date() } }).populate('testSeriesID').populate('paperList').lean();

            let result = [];
            if (mytest) {
                if (mytest.paperList.length == 0) {
                    //get all paper
                    var testSeries = await db.TestSeries.findOne({ _id: req.params.id }).populate("paperID").lean();
                    result = (testSeries.paperID);

                } else {
                    result = (mytest.paperList)

                }
                const testResponse = await db.TestResponse.find({ "studentID": req.userId, "testSeriesID": req.params.id });

                result.map((val, ind) => {
                    var currentTime = date.addMinutes(new Date(), 330);
                    var toD = new Date(val.endDate);
                    var fromD = new Date(val.startDate);
                    // if (!(currentTime.getTime() <= toD.getTime() && currentTime.getTime() >= fromD.getTime())) {
                    //     val.examDone = true;
                    // }
                    /* ***************************************************** */


                    val.showRank = false;
                    val.examDateLeft = false;
                    val.examDone = false;

                    if ((currentTime.getTime() <= fromD.getTime())) {
                        val.examDateLeft = true;
                    }

                    if (testResponse) {
                        testResponse.forEach(el => {

                            if (el.paperID + '' == val._id + '') {
                                if (el.examDone == 1) {
                                    val.examDone = true;

                                    //check rankDate

                                    if (val.rankStartDate) {
                                        var rankDate = new Date(val.rankStartDate);
                                        if (currentTime.getTime() >= rankDate.getTime()) {
                                            val.showRank = true;
                                        }
                                    }
                                }

                                // console.log(val)
                            }
                        });
                    }

                    if (toD && !val.examDone) {
                        if ((currentTime.getTime() >= toD.getTime())) {
                            val.examDateLeft = true;
                        }
                    }

                })




            }
            return res
                .status(200)
                .json({ status: true, message: `My Test Paper List`, data: result });

        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    async makePlanExipre() {

        try {
            //{ Expiration: { $lte: new Date() } }
            // await db.studentPlan.updateMany({}, { $set: { "isExipre": 0 } })
            const studentPlan = await db.studentPlan.find({ expireDate: { $gte: new Date() } });
            //const studentPlan = await db.studentPlan.find();
            console.log("studentPlan");
            if (studentPlan) {

                // studentPlan.forEach(element => {
                // let tempDate = date.addDays(element.createdAt, element.plan.days);
                // element.expireDate = tempDate;
                // element.save();

                // console.log(element)
                //});
                console.log("Count", studentPlan.length)
            }
        }

        catch (err) {
            console.log("Error:", new Date(), err)
        }

    }


    async getMyLiveClassTopic(req, res) {
        //  liveClassID
        try {

            const lClass = await db.studentPlan.find({ studentID: req.userId, expireDate: { $gte: new Date() } }, { "liveClassID": 1, _id: 0 }).populate('liveClassID').lean();

            let result = []
            if (lClass) {
                await Promise.all(lClass.map(async (val, ind) => {
                    if (val.liveClassID) {
                        //get Topic

                        const topic = await db.Topic.find({ 'liveClass': val.liveClassID, isActive: 1 });
                        val.liveClassID['topics'] = topic;

                        result.push(val.liveClassID)
                        return topic;
                    }
                }))

            }

            return res
                .status(200)
                .json({ status: true, message: `My Live Class List`, data: result });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }



}

module.exports = ProductController;
