const db = require("../models");
const config = require("../config");

class CourseController {


    // -------------------  Course

    async addCourse(req, res) {
        var { name, categoryID, detail, isActive } = req.body;
        if (!name)
            return res.json({
                status: false,
                message: "key name required for course",
                data: null,
            });

        try {
            var course = new db.Course();
            course.name = name;
            course.categoryID = categoryID;
            course.detail = detail;
            if (isActive) course.isActive = isActive;

            if (req.file != undefined) {
                course.img = `${config.uploadFolder}/${req.file.originalname}`;
            } else {
                course.img = ''
            }
            course.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new course added",
                        data: course,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getCourse(req, res) {
        try {
            const course = await db.Course.find().populate("categoryID", "name");
            //get Catogery Name

            return res
                .status(200)
                .json({ status: true, message: `course list`, data: course });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async getCourseById(req, res) {
        try {
            const course = await db.Course.findOne({ _id: req.params.id })
            //get Catogery Name

            return res
                .status(200)
                .json({ status: true, message: `course list`, data: course });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    // update course
    async updateCourse(req, res) {
        var { _id, name, categoryID, detail, isActive } = req.body;

        if (!name || !_id)
            return res.json({
                status: false,
                message: "key _id,name required for course",
                data: req.body,
            });
        try {
            var course = await db.Course.findOne({ _id });

            if (categoryID) course.categoryID = categoryID;
            if (detail) course.detail = detail;
            if (name) course.name = name;
            if (isActive) course.isActive = isActive;

            if (req.file != undefined) {
                course.img = `${config.uploadFolder}/${req.file.originalname}`;
            }

            course.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "course updated",
                        data: course,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    // delete course
    async deleteCourse(req, res) {
        try {
            var course = await db.Course.findOne({ _id: req.params.id });
            course.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "course deleted",
                        data: course,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    //Courses
    async getCourseByCategoryId(req, res) {
        try {
            const course = await db.Course.find({ categoryID: req.params.id });
            //get Catogery Name

            return res
                .status(200)
                .json({ status: true, message: `course list`, data: course });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async getActiveCourseByCategoryId(req, res) {
        try {
            const course = await db.Course.find({ isActive: 1, categoryID: req.params.id });
            //get Catogery Name

            return res
                .status(200)
                .json({ status: true, message: `course list`, data: course });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    // ------------------- Course

}


module.exports = CourseController;
