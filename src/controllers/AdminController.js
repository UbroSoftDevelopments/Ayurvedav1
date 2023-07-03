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
        return res.json({ status: false, message: "Something went wrong 🤚", data: err });
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
      return res.json({ status: false, message: "Something went wrong 🤚", data: err });
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
      else return res.json({ status: false, message: "Something went wrong 🤚", data: err });
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
        else return res.json({ status: false, message: "Something went wrong 🤚", data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: "Something went wrong 🤚", data: err });
    }
  }

  async checkAdmin(req, res) {
    return res.json({ status: true, message: 'Authorized Admin 😎', data: [] });
  }



  async getPerchaceCount(req, res) {

    try {
      const studentPlan = await db.studentPlan
        .find({ expireDate: { $gte: new Date() } }, { testSeriesID: 1, subjectID: 1, liveClassID: 1, courseID: 1 ,plan : 1})
        .populate("testSeriesID", "name")
        .populate("courseID", "name")
        .populate('liveClassID', "name");

      const output = [];
      // {
      //   _id:'',
      //   name:'',
      //   count:0
      // }
      let testSeriesList = [];
      let courseList = [];
      let income = 0;

      for (let index = 0; index < studentPlan.length; index++) {
        const element = studentPlan[index];
        if ('testSeriesID' in element && element.testSeriesID != null) {

          var hasMatch = false;
          income = income + parseFloat(element.plan.amount);
          for (var testInd = 0; testInd < testSeriesList.length; ++testInd) {
            var _test = testSeriesList[testInd];

            if (_test._id == element.testSeriesID._id) {
              hasMatch = true;
              _test.count++;
              break;
            }
          }
          if (!hasMatch) {
            testSeriesList.push({
              _id: element.testSeriesID._id,
              name: element.testSeriesID.name,
              count: 1
            })
          }

        }
        else if ('courseID' in element && element.courseID != null) {
          var hasMatch = false;
          income = income + parseFloat(element.plan.amount);
          for (var courseID = 0; courseID < courseList.length; ++courseID) {
            var _course = courseList[courseID];

            if (_course._id == element.courseID._id) {
              hasMatch = true;
              _course.count++;
              break;
            }
          }
          if (!hasMatch) {
            courseList.push({
              _id: element.courseID._id,
              name: element.courseID.name,
              count: 1
            })
          }
        }
        else if ('liveClassID' in element && element.liveClassID != null) {
          output.push(element);
        }


      }
      return res
        .status(200)
        .json({ status: true, message: `My Purchase list`, data: { courseList: courseList, testSeriesList: testSeriesList,income:income } });

    } catch (err) {
      return res.json({
        status: false,
        message: "something went wrong 🙃",
        data: `${err}`,
      });
    }

  }

  async getStuduentByPlan(req, res) {

    let { search, searchId } = req.body;
    let output = []
    if (!search || !searchId) {
      return res.json({
        status: false,
        message: "Must provide all input 🙄",
        data: null,
      });
    }

    try {
      let searchQuery = { }
      switch (search) {
        case 'testSeriesID':
          searchQuery = { expireDate: { $gte: new Date() }, testSeriesID: searchId }
          break;
        case 'courseID':
          searchQuery = { expireDate: { $gte: new Date() }, courseID: searchId }
          break;
        case 'subjectID':
          searchQuery = { expireDate: { $gte: new Date() }, subjectID: searchId }
          break;
        case 'liveClassID':
          searchQuery = { expireDate: { $gte: new Date() }, liveClassID: searchId }
          break;
      }


      const studentPlan = await db.studentPlan
        .find(searchQuery, { studentID: 1 , _id : 0 })
        .populate('studentID');

      let tempStdId = [];

      for(let j = 0; j < studentPlan.length; j++) {
        let student = studentPlan[j].studentID;
        if(student){
          if(!tempStdId.includes(student._id+"")){
            output.push(student)
            tempStdId.push(student._id);
          }
        }
      

       
      }



      return res
        .status(200)
        .json({ status: true, message: `My Purchase list of ${search}`, data: output });

    } catch (err) {
      return res.json({
        status: false,
        message: "something went wrong 🙃",
        data: `${err}`,
      });
    }

  }


}

module.exports = AdminController;