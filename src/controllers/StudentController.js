const db = require("../models");
const roles_list = require('../config/roles_list');
const { urlencoded } = require("express");
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
        // data.token = app.token({ email: user.email, _id: user._id, role: roles_list.Student });
        // data.imageBaseUrl = app.uploadURL;
        //  let url = `${app.baseUrl}/%23/save_student/${data.token}`;

        let _otp = app.otp(4);
        // console.log(_otp, mobile)
        var otpTbl = new db.Otp();
        otpTbl.mobile = mobile;
        otpTbl.otp = _otp;
        otpTbl.save((err) => {
          if (err) {
            return res.json({
              status: false,
              message: "Something went worng while sending the OTP",
              data: err
            });
          }
        });

        let msg =
          `Your OTP is *${_otp}*. 
(valid for *05* minutes)
Verify your email id by entering this OTP and get registered.

Pratyaksh AyurvedaYour`



        app.sendWhatsapp(mobile, msg, (resWhatsapp) => {
          if (!resWhatsapp.error) {
            if (resWhatsapp.res.statuscode == 200) {
              return res.json({
                status: true,
                message: "Please check whatsapp on this number: " + mobile + " OTP is send. and its valid till 5 min"
              });
            }
            return res.json({
              status: false,
              message: resWhatsapp.res.errormsg
            });
          }

        });






      } else
        return res.json({
          status: false,
          message: `User already found! Email/Phone already registered. Please Login.`,
          data: err,
        });
    });
  }

  async studentLogin(req, res) {
    var { password, user } = req.body;
    if (!user || !password)
      return res.json({
        status: false,
        message: "Must provide email/phone and password",
        data: null,
      });
    var _mobile = parseInt(user);


    if (isNaN(_mobile)) { _mobile = null }

    db.Student.findOne({ $or: [{ email: user }, { mobile: _mobile }] })
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

          if (doc.isVerifed != 1) {
            //Not Verfiy

            let _otp = app.otp(4);

            var otpTbl = new db.Otp();
            otpTbl.mobile = doc.mobile;
            otpTbl.otp = _otp;
            otpTbl.save((err) => {
              if (err) {
                return res.json({
                  status: false,
                  message: "Something went worng while sending the OTP",
                  data: err
                });
              }
            });

            let msg =
              `Your OTP is *${_otp}*. 
(valid for *05* minutes)
Verify your WhatsApp number by entering this OTP and get registered..

Pratyaksh Ayurveda`


            app.sendWhatsapp(doc.mobile, msg, (resWhatsapp) => {
              if (!resWhatsapp.error) {
                if (resWhatsapp.res.statuscode == 200) {
                  return res.json({
                    status: false,
                    message: "Please check whatsapp on this number: " + doc.mobile + " OTP is send. and its valid till 5 min",
                    data: doc
                  });
                }
                return res.json({
                  status: false,
                  message: resWhatsapp.res.errormsg
                });
              }

            });




          } else {


            doc.token = app.token({ email: doc.email, _id: doc._id, role: roles_list.Student });
            return res.json({
              status: true,
              message: "login successs",
              data: doc,
            });
          }
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
          data: null,
        });
      });
  }

  async checkStudent(req, res) {
    try {
      const student = await db.Student.findOne({ _id: req.userId });
      if (student) {
        return res
          .status(200)
          .json({ status: true, message: `Authorized Student 🧑‍🎓`, data: student });
      }
      return res
        .status(200)
        .json({ status: false, message: ` Student Not Found.. 🧑‍🎓'`, data: null });

    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
    }

  }


  async verfiyStudent(req, res) {
    try {

      var { mobile, otp } = req.body;
      const otpTbl = await db.Otp.find({ mobile });
      if (otpTbl) {
        let otpMatch = false;
        await otpTbl.forEach(element => {
          // console.log(mobile, otp, element)
          if (element.otp == otp) {
            otpMatch = true;
          }
        });
        if (otpMatch) {
          const student = await db.Student.findOne({ mobile });
          if (student) {
            //make it verfied
            student.isVerifed = 1;
            student.save((err) => {
              if (!err) {
                let token = app.token({ email: student.email, _id: student._id, role: roles_list.Student });
                return res.status(200).json({ status: true, message: `Successfully  verified 🧑‍🎓`, data: token });
              }
              else {
                return res.json({ status: false, message: `${err}`, data: err });
              }
            });
          } else {
            return res
              .status(200)
              .json({ status: false, message: `Not able to validate OTP Register again`, data: "" });
          }
        }
        else {
          return res
            .status(200)
            .json({ status: false, message: `Invalid OTP`, data: "" });
        }
      } else {
        return res
          .status(200)
          .json({ status: false, message: `OTP expire`, data: "" });
      }




    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
    }
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
      const student = await db.Student.find().sort({ "createdAt": -1 });

      return res
        .status(200)
        .json({ status: true, message: `Student list 🧑‍🎓`, data: student });
    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
    }
  }
  async getStudent(req, res) {
    try {
      var _id = req.params.id;
      const student = await db.Student.findOne({ _id });

      return res
        .status(200)
        .json({ status: true, message: `Student  🧑‍🎓`, data: student });
    } catch (err) {
      return res
        .status(403)
        .json({ status: false, message: "something went wrong 🤚", data: `${err}` });
    }
  }

  async deleteStudent(req, res) {
    var _id = req.params.id;

    try {
      var student = await db.Student.findOne({ _id });

      student.remove((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "student Deleted 😮‍💨",
            data: student,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  async updateStudent(req, res) {
    let { _id, fullName, password, presentStatus, favSubject, purposeOfAyurveda } = req.body;
    if (!_id)
      return res.json({
        status: false,
        message: "Must provide _id",
        data: null,
      });
    try {
      const student = await db.Student.findOne({ _id });
      if (presentStatus) student.presentStatus = presentStatus;
      if (favSubject) student.favSubject = favSubject;
      if (purposeOfAyurveda) student.purposeOfAyurveda = purposeOfAyurveda;
      if (fullName) student.fullName = fullName;
      if (password) student.password = password;

      student.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "Profile updated 😎",
            data: student,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });

    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }



  }

  async editStudentDiscription(req, res) {
    var { studentID, description } = req.body;
    try {

      if (!studentID || !description)
        return res.json({
          status: false,
          message: "key _id required for editStudentDiscription",
          data: req.body,
        });
      var student = await db.Student.findOne({ _id: studentID });
      student.dist = description;
      student.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "Student's description updated 😋",
            data: student,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });

    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  async getStudentPlan(req, res) {
    try {
      const subPlan = await db.studentPlan.find({ studentID: req.params.id }).populate('courseID').populate('subjectID').sort({ "createdAt": -1 });

      return res
        .status(200)
        .json({ status: true, message: `Product list`, data: subPlan });
    } catch (err) {
      return res.json({
        status: false,
        message: "something went wrong 🤚",
        data: `${err}`,
      });
    }
  }


  async addStudentPlan(req, res) {

    //NOT IN USE
    let { studentID, courseID, subjectID, testSeriesID, plan } = req.body;
    if (!studentID || !courseID || !plan) {
      return res.json({
        status: false,
        message: "Must provide all input 🙄",
        data: null,
      });
    }
    try {
      let findValue = { studentID: studentID };
      if (subjectID) findValue.subjectID = subjectID;
      if (testSeriesID) findValue.testSeriesID = testSeriesID;

      /* const studentData = await db.studentPlan.findOne(findValue);
       if (studentData) {
         findValue.plan = plan;
         findValue.studentData = studentData;
         return res.json({
           status: true,
           message: " Plan is already assign to student.💸 ",
           data: findValue,
         });
       }
 
       */
      const stdPlan = await db.studentPlan();
      stdPlan.studentID = studentID;
      stdPlan.courseID = courseID;
      if (subjectID) stdPlan.subjectID = subjectID;
      if (testSeriesID) stdPlan.testSeriesID = testSeriesID;
      stdPlan.plan = plan;

      stdPlan.save((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "New plan added. 💸",
            data: stdPlan,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }

  // delete Category
  async deleteStudentPlan(req, res) {
    var _id = req.params.id;

    try {
      var stdPlan = await db.studentPlan.findOne({ _id });

      stdPlan.remove((err) => {
        if (!err)
          return res.json({
            status: true,
            message: "Product Deleted 😮‍💨",
            data: stdPlan,
          });
        else return res.json({ status: false, message: `${err}`, data: err });
      });
    } catch (err) {
      return res.json({ status: false, message: `${err}`, data: err });
    }
  }
}

module.exports = StudentController;
