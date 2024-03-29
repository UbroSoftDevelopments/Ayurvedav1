const db = require("../models");
const config = require("../config");
const KJUR = require('jsrsasign')

class TopicController {
    async addTopic(req, res) {

        var { name, liveClass, detail, time, faculty, isActive, meetingID, meetingPasscode } = req.body;

        if (!name)
            return res.json({
                status: false,
                message: "key name required for subject",
                data: null,
            });

        try {
            var topic = new db.Topic();
            topic.name = name;
            topic.liveClass = liveClass;
            topic.detail = detail;
            topic.time = time;
            topic.faculty = faculty;
            topic.isActive = isActive;
            topic.meetingID = meetingID;
            topic.meetingPasscode = meetingPasscode;
            topic.createdBy = req.username;



            topic.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "New Topic Added 👍",
                        data: topic,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    async getTopic(req, res) {
        try {
            const topic = await db.Topic.find().populate("liveClass", "name");

            return res
                .status(200)
                .json({ status: true, message: `liveClass list`, data: topic });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async getTopicById(req, res) {
        try {
            const topic = await db.Topic.findOne({ _id: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `Topic `, data: topic });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateTopic(req, res) {
        var { _id, name, liveClass, detail, time, faculty, isActive, meetingID, meetingPasscode } = req.body;
        if (!name || !_id)
            return res.json({
                status: false,
                message: "key _id,name required for live class",
                data: req.body,
            });

        try {
            var topic = await db.Topic.findOne({ _id });

            if (name) topic.name = name;
            if (detail) topic.detail = detail;
            if (isActive) topic.isActive = isActive;
            if (liveClass) topic.liveClass = liveClass;
            if (time) topic.time = time;
            if (faculty) topic.faculty = faculty;
            if (meetingID) topic.meetingID = meetingID;
            if (meetingPasscode) topic.meetingPasscode = meetingPasscode;
            topic.updatedBy = req.username;

            topic.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "topic updated 👍",
                        data: topic,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // delete subject
    async deleteTopic(req, res) {
        var _id = req.params.id;
        try {
            var topic = await db.Topic.findOne({ _id });

            topic.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "topic deleted",
                        data: topic,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }


    async getTopicByClassId(req, res) {
        try {
            const topic = await db.Topic.find({ liveClass: req.params.id });

            return res
                .status(200)
                .json({ status: true, message: `topic list`, data: topic });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }


    async getActiveTopicByClassId(req, res) {
        try {
            const topic = await db.Topic.find({ isActive: 1, liveClass: req.params.id }).lean();

            return res
                .status(200)
                .json({ status: true, message: `topic list`, data: topic });
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

    async joinLiveClassOfTopic(req, res) {
        try {

            const iat = Math.round(new Date().getTime() / 1000) - 30;
            const exp = iat + 60 * 60 * 2
            const oHeader = { alg: 'HS256', typ: 'JWT' }

            const oPayload = {
                sdkKey: config.zoomSdk,
                mn: req.body.meetingNumber,
                role: req.body.role,
                iat: iat,
                exp: exp,
                appKey: config.zoomSecret,
                tokenExp: iat + 60 * 60 * 2
            }
            const sHeader = JSON.stringify(oHeader)
            const sPayload = JSON.stringify(oPayload)
            const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, config.zoomSecret)
            res.json({
                status: true,
                message: "Live Class Signature",
                data: {
                    key: config.zoomSdk,
                    signature: signature
                }

            })
        } catch (err) {
            return res.json({
                status: false,
                message: "something went wrong 🤚",
                data: `${err}`,
            });
        }
    }

}



module.exports = TopicController;