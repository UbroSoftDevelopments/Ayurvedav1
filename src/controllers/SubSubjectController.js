const db = require("../models");
const config = require("../config");


class SubjectController {


    async addSubSubject(req, res) {
        var { name, courseID, subjectID, detail, isActive, isDemo } = req.body;
        if (!name)
            return res.json({
                status: false,
                message: "key name required for subject",
                data: null,
            });

        try {
            var subSubject = new db.SubSubject();
            subSubject.name = name;
            //subSubject.courseID = courseID;
            subSubject.subjectID = subjectID;
            subSubject.detail = detail;
            subSubject.isDemo = isDemo;
            subSubject.createdBy = req.username;
            if (isActive) subSubject.isActive = isActive;
            if (req.file != undefined) {
                subSubject.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                subSubject.img = ''
            }

            subSubject.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new sub Subject added",
                        data: subSubject,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async getSubSubject(req, res) {
        try {

            const subSubject = await db.SubSubject.find().populate({
                path: 'subjectID',
                select: '_id name',
                populate: {
                    path: 'courseID',
                    model: 'course',
                    select: '_id name'
                }
            });
            // const subSubject = await db.SubSubject.find().populate("subjectID", "name");
            return res
                .status(200)
                .json({ status: true, message: `subSubject list`, data: subSubject });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }
    async getSubSubjectById(req, res) {
        try {

            const subSubject = await db.SubSubject.findOne({ _id: req.params.id }).populate("subjectID", "_id courseID");;
            // const subSubject = await db.SubSubject.find().populate("subjectID", "name");
            return res
                .status(200)
                .json({ status: true, message: `subSubject `, data: subSubject });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateSubSubject(req, res) {
        var { _id, name, chapterId, subjectID, detail, isActive, isDemo, chapterID } = req.body;

        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for sub-subject",
                data: req.body,
            });

        try {
            var subsubject = await db.SubSubject.findOne({ _id });

            if (name) subsubject.name = name;
            if (chapterId) subsubject.chapterID = chapterId;
            if (detail) subsubject.detail = detail;
            if (isDemo) subsubject.isDemo = isDemo;
            if (subjectID) subsubject.subjectID = subjectID;
            if (isActive) subsubject.isActive = isActive;
            if (chapterID) subsubject.chapterID = JSON.parse(chapterID);
            if (req.file != undefined) {
                subsubject.img = `${config.uploadFolder}/${req.fileName}`;
            }
            subsubject.updatedBy = req.username;
            subsubject.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "sub-subject updated 👍",
                        data: subsubject,
                    });
                else {
                    return res.json({ status: false,  message: "Something went wrong 🤚 in Sub Subject", data: err });
                }
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚 in Sub Subject", data: err });
        }
    }

    async deleteSubSubject(req, res) {
        var _id = req.params.id;

        try {
            var subSubject = await db.SubSubject.findOne({ _id });

            subSubject.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "sub-subject deleted",
                        data: subSubject,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async getSubSubjectBySubjectId(req, res) {
        try {
            const subsubject = await db.SubSubject.find({ subjectID: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `sub-subject list`, data: subsubject });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async getActiveSubSubjectBySubjectId(req, res) {
        try {
            const subsubject = await db.SubSubject.find({ isActive: 1, subjectID: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `subject list`, data: subsubject });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async addChapterID(req, res) {
        var { _id, chapterId } = req.body;

        if (!chapterId || !_id)
            return res.json({
                status: false,
                message: "key _id,chapterId required for ➕ adding chapter in sub-subject",
                data: req.body,
            });

        try {

            db.SubSubject.updateOne(
                { _id: _id },
                { $addToSet: { 'chapterID': chapterId } },
                (err) => {
                    if (!err)
                        return res.json({
                            status: true,
                            message: "chapter add to sub-subject sucessfully 👍",
                            data: chapterId,
                        });
                    else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
                }
            )
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async removeChapterID(req, res) {
        var _id = req.params.subID;
        var chapterId = req.params.chapID;

        if (!chapterId || !_id)
            return res.json({
                status: false,
                message: "key _id,chapterId required for ➕ adding chapter in sub-subject",
                data: req.body,
            });

        try {

            db.SubSubject.updateOne(
                { _id: _id },
                { $pull: { 'chapterID': chapterId } },
                (err) => {
                    if (!err)
                        return res.json({
                            status: true,
                            message: "chapter Removed to sub-subject sucessfully 👍",
                            data: chapterId,
                        });
                    else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
                }
            )
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async getSubSubjectWithChapter(req, res) {
        try {
            const subsubject = await db.SubSubject.find().populate("chapterID");

            return res
                .status(200)
                .json({ status: true, message: `subject list`, data: subsubject });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async getSubSubjectWithActiveChapterBySubId(req, res) {
        try {
            // todo isActive is not working
            const subsubject = await db.SubSubject.find({ subjectID: req.params.id, isActive: 1 }).populate({
                path: 'chapterID',
                match: { isActive: 1 }
            });

            return res
                .status(200)
                .json({ status: true, message: `sub-subject chapter list`, data: subsubject });
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
