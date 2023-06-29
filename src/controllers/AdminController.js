const db = require("../models");
const roles_list = require('../config/roles_list');

class AdminController {





  async login(req, res) {
    var { username, password } = req.body;
    if (!username || !password)
      return res.json({
        status: false,
        message: "username and password are required!",
        data: null,
      });

    db.Admin.findOne({ username })
      .lean()
      .then(async (doc) => {
        if (!doc)
          return res.json({
            status: false,
            message: `Authentication fail`,
            data: [],
          });

        var st = await app.checkPassword(password, doc.password);
        if (st) {
          doc.token = app.token({ username: doc.username, _id: doc._id, role: roles_list.Admin });
          return res.json({
            status: true,
            message: "login successs",
            data: doc,
          });
        } else {
          return res.json({
            status: false,
            message: `Not a valid authentication`,
            data: null,
          });
        }
      })
      .catch((err) => {
        return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
      });
  }

  async signup(req, res) {
    var { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.json({
        status: false,
        message: "name, username and password are required!",
        data: null,
      });

    var pass = await db.config.setPassword(password);


    var admin = new db.Admin();
    admin.name = name;
    admin.username = username;
    admin.password = pass;
    try {
      admin.save((err) => {
        return res.json({
          status: true,
          message: "New admin created",
          data: admin,
        });
      });
    } catch (err) {
      return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
    }
  }

  async updateProfile(req, res) {
    var { _id, name, username, password } = req.body;
    if (!_id)
      return res.json({ status: false, message: "_id required!", data: null });

    var admin = await db.Admin.findOne({ _id });
    if (password) admin.password = await db.config.setPassword(password);
    if (name) admin.name = name;
    if (username) admin.username = username;

    admin.save((err) => {
      if (!err)
        return res.json({
          status: true,
          message: "Profile updated",
          data: admin,
        });
      else return res.json({ status: false, message: `$err`, data: err });
    });
  }

  async updatePassword(req, res) {
    var { _id, password, password_confirm } = req.body;
    if (!_id || !password || !password_confirm)
      return res.json({
        status: false,
        message: "_id, password and password_confirm are required!",
        data: req.body,
      });

    if (password_confirm != password)
      return res.json({
        status: false,
        message: "password and confirm password did not match!",
        data: null,
      });

    var admin = await db.Admin.findOne({ _id });
    if (password) admin.password = await db.config.setPassword(password);

    admin.save((err) => {
      if (!err)
        return res.json({
          status: true,
          message: "Profile updated",
          data: admin,
        });
      else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
    });
  }

  //add status
  async addstatus(req, res) {
    var { name, title } = req.body;
    if (!name)
      return res.json({
        status: false,
        message: "key name required for status",
        data: null,
      });

    try {
      var status = new db.status();
      status.name = name;
      if (title) status.title = title;

      status.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "new status added",
            data: status,
          });
        else return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
      });
    } catch (err) {
      return res.json({ status: false,  message: "Something went wrong 🤚", data: err });
    }
  }

  async checkAdmin(req, res) {
    return res.json({ status: true, message: 'Authorized Admin 😎', data: [] });
  }
}

module.exports = AdminController;