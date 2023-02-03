const db = require("../models");

class FreeSessionController {


    /* Video */

    async addSession(req, res) {

        var { name, mail, phone } = req.body;
        if (!name)
            return res.json({
                status: false,
                message: "key  required for Session",
                data: null,
            });

        try {
            var session = new db.FreeSession();
            session.name = name;
            session.mail = mail;
            session.phone = phone;


            session.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Session Created",
                        data: session,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }

    async getSession(req, res) {
        try {
            const freeSession = await db.FreeSession.find();
            return res
                .status(200)
                .json({ status: true, message: `freeSession list`, data: freeSession });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateSession(req, res) {
        var { _id, status } = req.body;
        if (!_id, !status)
            return res.json({
                status: false,
                message: "key _id status required for update Session",
                data: req.body,
            });

        try {
            var freeSession = await db.FreeSession.findOne({ _id });
            freeSession.status = status;

            freeSession.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Enquiry updated to: " + status,
                        data: freeSession,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }


    async deleteSession(req, res) {
        var _id = req.params.id;

        try {
            var freeSession = await db.FreeSession.findOne({ _id });

            freeSession.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Enquiry deleteed",
                        data: freeSession,
                    });
                else return res.json({ status: false, message: `${err}`, data: err });
            });
        } catch (err) {
            return res.json({ status: false, message: `${err}`, data: err });
        }
    }
}

module.exports = FreeSessionController;