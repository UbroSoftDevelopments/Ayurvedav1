const db = require("../models");
const config = require("../config");

class ChapterController {
    /* Chapter */

    async addChapter(req, res) {

        var { name, subject, subSubject, desc } = req.body;
        if (!name)
            return res.json({
                status: false,
                message: "key name required for Chapter",
                data: null,
            });

        try {
            var chapter = new db.Chapter();
            chapter.name = name;
            chapter.subject = subject;
            chapter.subSubject = subSubject;
            chapter.desc = desc;

            if (req.file != undefined) {
                chapter.img = `${config.uploadFolder}/${req.file.originalname}`;
            } else {
                chapter.img = ''
            }

            chapter.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Chapter added",
                        data: chapter,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getChapter(req, res) {
        try {

            const chapter = await db.Chapter.find();
            return res
                .status(200)
                .json({ status: true, message: `Chapter list`, data: chapter });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getChapterById(req, res) {
        try {

            const chapter = await db.Chapter.findOne({ _id: req.params.id });
            return res
                .status(200)
                .json({ status: true, message: `Chapter `, data: chapter });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }


    async updateChapter(req, res) {
        var { _id, name, subject, subSubject, desc } = req.body;
        if (!name)
            if (!name || !_id)
                return res.json({
                    status: false,
                    message: "key _id,name required for course",
                    data: req.body,
                });

        try {
            var chapter = await db.Chapter.findOne({ _id });

            if (name) chapter.name = name;
            if (desc) chapter.desc = desc;
            if (subject) chapter.subject = subject;
            if (subSubject) chapter.subSubject = subSubject;

            if (req.file != undefined) {
                chapter.img = `${config.uploadFolder}/${req.file.originalname}`;
            }
            chapter.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "chapter updated 👍",
                        data: chapter,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async updateChapterNotes(req, res) {
        var { _id, noteTitle } = req.body;

        if (!noteTitle || !_id)
            return res.json({
                status: false,
                message: "key _id,Title required for course",
                data: req.body,
            });

        try {
            var chapter = await db.Chapter.findOne({ _id });


            if (noteTitle) chapter.noteTitle = noteTitle;

            if (req.file != undefined) {
                chapter.noteDoc = `${config.uploadFolder}/${req.file.originalname}`;
            }
            chapter.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "chapter updated 👍",
                        data: chapter,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async deleteChapter(req, res) {
        var _id = req.params.id;



        try {
            var chapter = await db.Chapter.findOne({ _id });

            chapter.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "chapter deleted",
                        data: chapter,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getChapterBySubSubjectId(req, res) {

        try {
            const subsubjectCourse = await db.SubSubject.find({ _id: req.params.id }).populate("chapterID");

            return res
                .status(200)
                .json({ status: true, message: `subject list`, data: subsubjectCourse });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }
}

module.exports = ChapterController;
