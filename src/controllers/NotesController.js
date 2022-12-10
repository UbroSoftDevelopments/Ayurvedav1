const db = require("../models");
const config = require("../config");

class NotesController {


    async addNotes(req, res) {

        var { title, desc, chapterID } = req.body;
        if (!chapterID)
            return res.json({
                status: false,
                message: "key required for notes",
                data: null,
            });

        try {
            var notes = new db.Notes();
            notes.title = title;
            notes.desc = desc;
            notes.chapterID = chapterID;
            if (req.file != undefined) {
                notes.docPath = `${config.uploadFolder}/${req.fileName}`;
            }

            notes.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Notes added",
                        data: notes,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getNotes(req, res) {
        try {
            var notes = await db.Notes.find();
            return res
                .status(200)
                .json({ status: true, message: `Notes list`, data: notes });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }



    async updateNotes(req, res) {
        var { _id, title, desc, chapterID } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for Notes",
                data: req.body,
            });

        try {
            var notes = await db.Notes.findOne({ _id });

            if (desc) notes.desc = desc;
            if (title) notes.title = title;

            if (chapterID) notes.chapterID = chapterID;
            if (req.file != undefined) {
                notes.docPath = `${config.uploadFolder}/${req.fileName}`;
            }

            notes.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "notes updated 👍",
                        data: notes,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async deleteNotes(req, res) {
        var _id = req.params.id;


        try {
            var notes = await db.Notes.findOne({ _id });
            notes.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "notes deleted",
                        data: notes,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getNotesByChapterId(req, res) {

        const id = req.params.id;
        try {
            const notes = await db.Notes.find({ 'chapterID': id });
            return res
                .status(200)
                .json({ status: true, message: `notes list`, data: notes });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }


}

module.exports = NotesController;