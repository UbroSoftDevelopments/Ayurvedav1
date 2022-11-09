const db = require("../models");

class VideoController {


    /* Video */

    async addVideo(req, res) {

        var { vimoID, title, duration, faculty, chapterID } = req.body;
        if (!vimoID)
            return res.json({
                status: false,
                message: "key Vimo ID required for Video",
                data: null,
            });

        try {
            var video = new db.Video();
            video.vimoID = vimoID;
            video.title = title;
            video.duration = duration;
            video.faculty = faculty;
            video.chapterID = chapterID;


            video.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new Video added",
                        data: video,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getVideo(req, res) {
        try {
            const videos = await db.Video.find();
            return res
                .status(200)
                .json({ status: true, message: `Videos list`, data: videos });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }



    async updateVideo(req, res) {
        var { _id, vimoID, title, duration, faculty, chapterID } = req.body;
        if (!vimoID)
            if (!vimoID || !_id)
                return res.json({
                    status: false,
                    message: "key _id,vimoID required for course",
                    data: req.body,
                });

        try {
            var video = await db.Video.findOne({ _id });

            if (vimoID) video.vimoID = vimoID;
            if (title) video.title = title;
            if (duration) video.duration = duration;
            if (faculty) video.faculty = faculty;
            if (chapterID) video.chapterID = chapterID;


            video.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "video updated 👍",
                        data: video,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async deleteVideo(req, res) {
        var { _id } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for video",
                data: req.body,
            });

        try {
            var video = await db.Video.findOne({ _id });

            video.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "video deleted",
                        data: video,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }



    async getVideoByChapterId(req, res) {

        const id = req.params.id;
        try {
            const videos = await db.Video.find({ 'chapterID': id });
            return res
                .status(200)
                .json({ status: true, message: `Videos list`, data: videos });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }

    }

    /* Video */
}

module.exports = VideoController;