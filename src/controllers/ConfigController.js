const db = require("../models");
const config = require("../config");
class ConfigController {

    // add Category
    async addCofig(req, res) {

        var { subjectDiscount } = req.body;
        if (!subjectDiscount)
            return res.json({
                status: false,
                message: "key name required for subjectDiscount",
                data: null,
            });

        try {
            var appConfig = new db.AppConfig();
            appConfig.subjectDiscount = subjectDiscount;
            appConfig.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "appConfig added",
                        data: appConfig,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // get appConfig
    async getConfig(req, res) {
        try {
            const appConfig = await db.AppConfig.find();
            return res
                .status(200)
                .json({ status: true, message: `appConfig`, data: appConfig });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    async updateConfig(req, res) {
        var { subjectDiscount, _id } = req.body;
        if (!subjectDiscount, !_id)
            return res.json({
                status: false,
                message: "key name required for subjectDiscount, _id",
                data: null,
            });

        try {
            var appConfig = await db.AppConfig.findOne({ _id });
            appConfig.subjectDiscount = subjectDiscount;
            appConfig.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "appConfig Updated",
                        data: appConfig,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }

    }
}


module.exports = ConfigController;