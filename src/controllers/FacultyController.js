const db = require("../models");
const config = require("../config");

class FacultyController {

    async addFaculty(req, res) {

        var { name, qualification, specializtion, designation, img, detail } = req.body;
        if (!name)
            return res.json({
                status: false,
                message: "key name required for Faculty",
                data: null,
            });

        try {
            var faculty = new db.Faculty();
            faculty.name = name;
            faculty.qualification = qualification;
            faculty.specializtion = specializtion;
            faculty.designation = designation;
            faculty.detail = detail;

            if (req.file != undefined) {
                faculty.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                faculty.img = ''
            }

            faculty.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new faculty added",
                        data: faculty,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // get Faculty
    async getFaculty(req, res) {
        try {
            const faculty = await db.Faculty.find();
            return res
                .status(200)
                .json({ status: true, message: `faculty list`, data: faculty });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    // update Faculty
    async updateFaculty(req, res) {
        var { _id, name, qualification, specializtion, designation, img, detail } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for category",
                data: req.body,
            });

        try {
            var faculty = await db.Faculty.findOne({ _id });
            if (name) faculty.name = name;
            if (qualification) faculty.qualification = qualification;
            if (specializtion) faculty.specializtion = specializtion;
            if (designation) faculty.designation = designation;
            if (detail) faculty.detail = detail;

            if (req.file != undefined) {
                faculty.img = `${config.uploadFolder}/${req.fileName}`;
            }

            faculty.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "faculty updated",
                        data: faculty,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }


    // delete Faculty
    async deleteFaculty(req, res) {
        var _id = req.params.id;

        try {
            var faculty = await db.Faculty.findOne({ _id });

            faculty.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "faculty deleteed",
                        data: faculty,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }
}

module.exports = FacultyController;

