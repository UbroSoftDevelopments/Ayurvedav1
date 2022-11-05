const db = require("../models");

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
          doc.token = app.token({ username: doc.username, _id: doc._id });
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
        return res.json({ status: false, message: `${err}`, data: err });
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
      return res.json({ status: false, message: `${err}`, data: err });
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
      else return res.json({ status: false, message: `${err}`, data: err });
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
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  //addCategory
  addCategory(req, res) {
    var { name, tab, detail, img, isActive } = req.body;
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
      category.img = img;
      category.isActive = isActive;

      category.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "new category added",
            data: category,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  async getCategory(req, res) {
    try {
      const category = await db.Category.find();
      return res
        .status(200)
        .json({ status: true, message: `category list`, data: category });
    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "somthing worng", data: `${err}` });
    }
  }

  // update category
  async updateCategory(req, res) {
    var { _id, name, title } = req.body;
    if (!name || !_id)
      return res.json({
        status: false,
        message: "key _id,name required for category",
        data: req.body,
      });

    try {
      var category = await db.Category.findOne({ _id });
      category.name = name;
      if (title) category.title = title;

      category.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "Category updated",
            data: category,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  // delete category
  async deleteCategory(req, res) {
    var { _id, name, title } = req.body;
    if (!_id)
      return res.json({
        status: false,
        message: "key _id required for category",
        data: req.body,
      });

    try {
      var category = await db.Category.findOne({ _id });

      category.remove((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "Category deleteed",
            data: category,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  // -------------------  Course

  addCourse(req, res) {
    var { name, categoryID, detail, img, isActive } = req.body;
    if (!name)
      return res.json({
        status: false,
        message: "key name required for course",
        data: null,
      });

    try {
      var course = new db.Course();
      course.name = name;
      course.categoryID = categoryID;
      course.detail = detail;
      course.img = img;

      if (isActive) course.isActive = isActive;

      course.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "new course added",
            data: course,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  async getCourse(req, res) {
    try {
      const course = await db.Course.find().populate("categoryID", "name");
      //get Catogery Name

      return res
        .status(200)
        .json({ status: true, message: `course list`, data: course });
    } catch (err) {
      return res.json({
        status: false,
        message: "somthing worng",
        data: `${err}`,
      });
    }
  }

  // update course
  async updateCourse(req, res) {
    var { _id, name, title } = req.body;
    if (!name || !_id)
      return res.json({
        status: false,
        message: "key _id,name required for course",
        data: req.body,
      });

    try {
      var course = await db.Course.findOne({ _id });
      course.name = name;
      if (title) course.title = title;

      course.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "course updated",
            data: course,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  // delete course
  async deleteCourse(req, res) {
    var { _id, name, title } = req.body;
    if (!_id)
      return res.json({
        status: false,
        message: "key _id required for course",
        data: req.body,
      });

    try {
      var course = await db.Course.findOne({ _id });

      course.remove((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "course deleteed",
            data: course,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  // ------------------- Course

  /*  			Subject			   */

  async addSubject(req, res) {
    var { name, courseID, detail, img, isActive } = req.body;
    if (!name)
      return res.json({
        status: false,
        message: "key name required for subject",
        data: null,
      });

    try {
      var subject = new db.Subject();
      subject.name = name;
      subject.courseID = courseID;
      subject.detail = detail;
      subject.img = img;

      if (isActive) subject.isActive = isActive;

      subject.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "new subject added",
            data: subject,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  async getSubject(req, res) {
    try {
      const subject = await db.Subject.find().populate("courseID", "name");

      return res
        .status(200)
        .json({ status: true, message: `subject list`, data: subject });
    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "somthing worng", data: `${err}` });
    }
  }

  /*  			Subject			   */

  /*  	Sub		Subject			   */

  async addSubSubject(req, res) {
    var { name, courseID, subjectID, detail, img, isActive } = req.body;
    if (!name)
      return res.json({
        status: false,
        message: "key name required for subject",
        data: null,
      });

    try {
      var subSubject = new db.SubSubject();
      subSubject.name = name;
      subSubject.courseID = courseID;
      subSubject.subjectID = subjectID;
      subSubject.detail = detail;
      subSubject.img = img;

      if (isActive) subSubject.isActive = isActive;

      subSubject.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "new sub Subject added",
            data: subSubject,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  async getSubSubject(req, res) {
    try {
      const subSubject = await db.SubSubject.find();
      return res
        .status(200)
        .json({ status: true, message: `subSubject list`, data: subSubject });
    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "somthing worng", data: `${err}` });
    }
  }

  /*  		Sub	Subject			   */



  /* Chapter */

  async addChapter(req, res) {

    var { name, subject, subSubject, desc, img } = req.body;
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
      chapter.img = img;


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
        .json({ status: false, message: "somthing worng", data: `${err}` });
    }
  }


  /* Chapter */


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
        .json({ status: false, message: "somthing worng", data: `${err}` });
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
        .json({ status: false, message: "somthing worng", data: `${err}` });
    }

  }

  /* Video */

}

module.exports = AdminController;
