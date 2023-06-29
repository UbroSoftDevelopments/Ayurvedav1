const db = require("../models");
const config = require("../config");
class CategoryController {

    // add Category
    async addCategory(req, res) {

        var { name, tab, detail, isActive } = req.body;
        if (!name)
            return res.json({
                status: false,
                message: "key name required for category",
                data: null,
            });

        try {
            var category = new db.Category();
            category.name = name;
            category.tab = tab;
            category.detail = detail;
            category.isActive = isActive;
            category.createdBy = req.username;

            if (req.file != undefined) {
                category.img = `${config.uploadFolder}/${req.fileName}`;
            } else {
                category.img = ''
            }

            category.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "new category added",
                        data: category,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // get Category
    async getCategory(req, res) {
        try {
            const category = await db.Category.find();
            return res
                .status(200)
                .json({ status: true, message: `category list`, data: category });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }

    // update Category
    async updateCategory(req, res) {
        var { _id, name, tab, detail, isActive } = req.body;
        if (!_id)
            return res.json({
                status: false,
                message: "key _id required for category",
                data: req.body,
            });

        try {
            var category = await db.Category.findOne({ _id });
            if (name) category.name = name;
            if (tab) category.tab = tab;
            if (detail) category.detail = detail;
            if (isActive) category.isActive = isActive;
            category.updatedBy = req.username;

            if (req.file != undefined) {
                category.img = `${config.uploadFolder}/${req.fileName}`;
            }

            category.save((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Category updated",
                        data: category,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }

    // delete Category
    async deleteCategory(req, res) {
        var _id = req.params.id;

        try {
            var category = await db.Category.findOne({ _id });

            category.remove((err) => {
                if (!err)
                    return res.json({
                        status: true,
                        message: "Category deleteed",
                        data: category,
                    });
                else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
            });
        } catch (err) {
            return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
        }
    }


    async getActiveCategory(req, res) {
        try {
            const category = await db.Category.find({ isActive: 1 });
            return res
                .status(200)
                .json({ status: true, message: `category list`, data: category });
        } catch (err) {
            return res
                .status(403)
                .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
        }
    }


}


module.exports = CategoryController;