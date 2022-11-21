const db = require("../models");

class ProductController {
    constructor() {
        //
    }


    async getStudentPlan(req, res) {
        try {
            const subPlan = await db.studentPlan.find({ studentID: req.params.id }).populate('courseID').populate('subjectID');

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
        let { studentID, courseID, subjectID, plan } = req.body;
        if (!studentID || !courseID || !subjectID || !plan) {
            return res.json({
                status: false,
                message: "Must provide all input 🙄",
                data: null,
            });
        }



        try {
            const stdPlan = await db.studentPlan();
            stdPlan.studentID = studentID;
            stdPlan.courseID = courseID;
            stdPlan.subjectID = subjectID;
            stdPlan.plan = plan;

            stdPlan.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "New plan added 💸",
                        data: stdPlan,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // delete Category
    async deleteStudentPlan(req, res) {
        var _id = req.params.id;

        try {
            var stdPlan = await db.studentPlan.findOne({ _id });

            stdPlan.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Product Deleted 😮‍💨",
                        data: stdPlan,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }


    //todo isAvtive validation is left
    async getMyCourse(req, res) {

        try {
            //  const mycourse = await db.studentPlan.find({ studentID: req.userId }, { "courseID": 1, _id: 0 }).populate('courseID');
            const mycourse = await db.studentPlan
                .find({ studentID: req.userId })
                .distinct('courseID', function (error, ids) {
                    db.Course.find({ '_id': { $in: ids } }, function (err, result) {
                        return res
                            .status(200)
                            .json({ status: true, message: `My Course list`, data: result });
                    });
                });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    //todo isAvtive validation is left
    async getMySubjectByCourse(req, res) {
        try {
            const mysubject = await db.studentPlan.find({ studentID: req.userId, courseID: req.params.id }, { "subjectID": 1, _id: 0 }).populate('subjectID');

            return res
                .status(200)
                .json({ status: true, message: `My Subject list`, data: mysubject });
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
            const mysubject = await db.studentPlan.findOne({ studentID: req.userId, subjectID: req.params.id });
            if (!mysubject) {
                return res.json({
                    status: false,
                    message: "Chapter not found in your product. 🧺",
                    data: null,
                });
            }
            //call get chapter detail
            const subsubject = await db.SubSubject.find({ isActive: 1, subjectID: req.params.id }).populate("chapterID");

            return res.json({
                status: true,
                message: "My Chapter List",
                data: subsubject,
            });


        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }

    }

    async getMyVideoByChapter(req, res) {

        try {
            const sub_subject = await db.SubSubject.findOne({ chapterID: req.params.id });
            if (!sub_subject) {
                return res.json({
                    status: false,
                    message: "Video not found. 🧺",
                    data: null,
                });
            }
            const student = await db.studentPlan.findOne({ studentID: req.userId, subjectID: sub_subject.subjectID });
            if (!student) {
                return res.json({
                    status: false,
                    message: "Video not found in your product. 🧺",
                    data: null,
                });
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
}

module.exports = ProductController;
