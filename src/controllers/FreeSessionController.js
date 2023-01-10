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



    /* Video */
}

module.exports = FreeSessionController;