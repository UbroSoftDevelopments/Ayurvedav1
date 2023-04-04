const db = require("../models");
const config = require("../config");


class LiveClassController {
    async addClass(req, res) {
        var { name, courseID, detail, plan, isActive } = req.body;

        if (!name)
            return res.json({
                status: false,
                message: "key name required for subject",
                data: null,
            });

        try {
            var lclass = new db.LiveClass();
            lclass.name = name;
            lclass.courseID = JSON.parse(courseID);
            lclass.detail = detail;


            if (plan) lclass.plan = JSON.parse(plan);

            if (req.file != undefined) {
                lclass.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                lclass.img = ''
            }

            if (isActive) lclass.isActive = isActive;



            lclass.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "New Live Class Added 👍",
                        data: lclass,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getClass(req, res) {
        try {
            const lclass = await db.LiveClass.find().populate("courseID", "name");

            return res
                .status(200)
                .json({ status: true, message: `Live Class list`, data: lclass });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getClassById(req, res) {
        try {
            const lclass = await db.LiveClass.findOne({ _id: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `live class `, data: lclass });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateClass(req, res) {
        var { _id, name, courseID, detail, plan, isActive } = req.body;
        if (!name || !_id)
            return res.json({
                status: false,
                message: "key _id,name required for live class",
                data: req.body,
            });

        try {
            var lclass = await db.LiveClass.findOne({ _id });

            if (name) lclass.name = name;
            if (courseID) lclass.courseID = JSON.parse(courseID);
            if (detail) lclass.detail = detail;
            if (plan) lclass.plan = JSON.parse(plan);
            if (isActive) lclass.isActive = isActive;
            if (req.file != undefined) {
                lclass.img = `${config.uploadFolder}/${req.fileName}`;
            }


            lclass.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "lclass updated 👍",
                        data: lclass,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // delete subject
    async deleteLiveClass(req, res) {
        var _id = req.params.id;
        try {
            var lclass = await db.LiveClass.findOne({ _id });

            lclass.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "lclass deleted",
                        data: lclass,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }


    async getClassByCourseId(req, res) {
        try {
            const lclass = await db.LiveClass.find({ courseID: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `lclass list`, data: lclass });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    async getActiveClassByCourseId(req, res) {
        try {
            const lclass = await db.LiveClass.find({ isActive: 1, courseID: req.params.id }).lean();

            return res
                .status(200)
                .json({ status: true, message: `lclass list`, data: lclass });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

}



module.exports = LiveClassController;