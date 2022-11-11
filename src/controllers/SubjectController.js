const db = require("../models");
const config = require("../config");


class SubjectController {

    /*  			Subject			   */

    async addSubject(req, res) {
        var { name, courseID, detail, plan, isActive } = req.body;

        if (!name)
            return res.json({
                status: false,
                message: "key name required for subject",
                data: null,
            });

        try {
            var subject = new db.Subject();
            subject.name = name;
            console.log('1', courseID)
            subject.courseID = JSON.parse(courseID);
            subject.detail = detail;

            if (plan) subject.plan = JSON.parse(plan);

            if (req.file != undefined) {
                subject.img = `${config.uploadFolder}/${req.file.originalname}`;
            } else {
                subject.img = ''
            }

            if (isActive) subject.isActive = isActive;



            subject.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new subject added 👍",
                        data: subject,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getSubject(req, res) {
        try {
            const subject = await db.Subject.find().populate("courseID", "name");

            return res
                .status(200)
                .json({ status: true, message: `subject list`, data: subject });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateSubject(req, res) {
        var { _id, name, courseID, detail, plan, isActive } = req.body;
        if (!name)
            if (!name || !_id)
                return res.json({
                    status: false,
                    message: "key _id,name required for course",
                    data: req.body,
                });

        try {
            var subject = await db.Subject.findOne({ _id });

            if (name) subject.name = name;
            if (courseID) subject.courseID = JSON.parse(courseID);
            if (detail) subject.detail = detail;

            if (plan) subject.plan = JSON.parse(plan);
            if (isActive) subject.isActive = isActive;
            if (req.file != undefined) {
                subject.img = `${config.uploadFolder}/${req.file.originalname}`;
            }


            subject.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "subject updated 👍",
                        data: subject,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // delete subject
    async deleteSubject(req, res) {
        var { _id } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for subject",
                data: req.body,
            });

        try {
            var subject = await db.Subject.findOne({ _id });

            subject.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "subject deleted",
                        data: subject,
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


module.exports = SubjectController;
