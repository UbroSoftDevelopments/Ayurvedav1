const db = require("../models");

class StudentController {
  constructor() {
    //
  }

  async studentRegister(req, res) {




    let { fullName, mobile, email, password, presentStatus, favSubject, purposeOfAyurveda, referralCode } = req.body;

    if (!fullName || !email || !mobile)
      return res.json({
        status: false,
        message: "Must provide Fullname ,  email , mobile",
        data: null,
      });

    var user = new db.Student();
    user.fullName = fullName;
    user.email = email;
    user.mobile = mobile;

    if (password) user.password = password;
    if (presentStatus) user.presentStatus = presentStatus;
    if (favSubject) user.favSubject = favSubject;
    if (purposeOfAyurveda) user.purposeOfAyurveda = purposeOfAyurveda;
    if (referralCode) user.referralCode = referralCode;


    user.save((err) => {
      if (!err) {
        var data = user.toObject();
        data.token = app.token({ email: user.email, _id: user._id });
        data.imageBaseUrl = app.uploadURL;
        return res.json({
          status: true,
          message: "Register successs",
          data,
          password,
        });
      } else
        return res.json({
          status: false,
          message: `User already found!`,
          data: err,
        });
    });
  }

  async studentLogin(req, res) {
    var { password, email } = req.body;
    if (!email || !password)
      return res.json({
        status: false,
        message: "Must provide email and password",
        data: null,
      });

    db.Student.findOne({ email })
      .lean()
      .then(async (doc) => {
        if (!doc)
          return res.json({
            status: false,
            message: "User not found!",
            data: null,
          });

        var st = password === doc.password;
        //await app.checkPassword(password,doc.password);
        if (st) {
          doc.token = app.token({ email: doc.email, _id: doc._id });
          doc.imageBaseUrl = app.uploadURL;
          if (doc.profile != "")
            doc.profile = app.setImageURL(`user/${doc.profile}`);

          return res.json({
            status: true,
            message: "login successs",
            data: doc,
          });
        } else
          return res.json({
            status: false,
            message: "Password did not match",
            data: null,
          });
      })
      .catch((err) => {
        return res.json({
          status: false,
          message: `User already found!`,
          data: err,
        });
      });
  }

  userSendOtp(req, res) {
    var { mobile } = req.body;
    if (!mobile) {
      res.json({
        status: false,
        message: "Must provide mobile number",
        data: null,
      });
      return;
    }

    db.User.findOne({ mobile })
      .then(async (doc) => {
        if (!doc)
          return res.json({
            status: false,
            message: "User not found!",
            data: null,
          });

        var otp = 1234; //app.otp(6);
        var token = app.token({ mobile, otp }, { expiresIn: "2h" });
        //var token = app.token({mobile,otp});
        res.json({
          status: true,
          message: "OTP has been sent on your mobile!",
          data: { otp, token },
        });
        return;
      })
      .catch((err) => {
        return res.json({ status: false, message: `${err}`, data: null });
      });
  }

  updatePassword(req, res) {
    var { mobile, otp, password } = req.body;
    if (!mobile || !otp || !password)
      return res.json({
        status: false,
        message: "Must provide mobile number,otp and password",
        data: null,
      });

    //app.checkToken(req,res,data=>{
    //return res.json({status:true,message:'data',data});
    if (parseInt(otp) != 1234)
      return res.json({
        status: true,
        message: "OTP Does not match!",
        data: null,
      });

    db.User.findOne({ mobile })
      .then(async (doc) => {
        if (!doc)
          return res.json({
            status: false,
            message: "User not found!",
            data: null,
          });
        doc.password = await app.setPassword(password);
        doc.save();
        return res.json({
          status: true,
          message: "Password has been updated successful.",
          data: doc,
        });
      })
      .catch((err) => {
        return res.json({ status: false, message: `${err}`, data: null });
      });
    //});
  }

  async getAllStudent(req, res) {
    try {
      const student = await db.Student.find();

      return res
        .status(200)
        .json({ status: true, message: `Student list 🧑‍🎓`, data: student });
    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
    }
  }

}

module.exports = StudentController;
