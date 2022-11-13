var dotenv = require('dotenv')
const multer = require('multer');
const moment = require('moment-timezone');

dotenv.config()
const config = {
  port: process.env.PORT,
  dbUri: process.env.DB_URL,
  saltRounds: process.env.SALT,
  uploadDIR: process.env.UPLOAD_DIR,
  uploadURL: process.env.UPLOAD_URL,
  uploadFolder: 'upload',
  userApp: 'admin-user',
  webApp: 'cms-app'
};

config.url = (endpoints) => {
  return `${app.uploadURL}${endpoints}`;
}

config.setPassword = async (plaintext) => {

  const bcrypt = require('bcrypt')
  const promise = new Promise((resolve, reject) => {
    bcrypt.hash(plaintext, parseInt(config.saltRounds), function (err, hash) {
      if (!err)
        resolve(hash);
      else
        resolve(plaintext);
    });

  });

  return await promise.then();

}

config.checkPassword = async (plaintext, hash) => {
  const bcrypt = require('bcrypt')
  const promise = new Promise((resolve, reject) => {
    bcrypt.compare(plaintext, hash, function (err, result) {
      if (!err)
        resolve(result);
      else
        resolve(result);
    });

  });

  return await promise.then();

}


config.checkRequest = (req, res, reqData) => {
  var status = true, message = "";
  var data = req.body;

  reqData.map(input => {
    if (!data[input]) {
      status = false;
      message = `${input} required`;
    }

  })
  return res.json(status, message);
}

config.otp = (length = 4) => {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}


config.token = (store, expiresIn = null) => {
  const jwt = require('jsonwebtoken');
  // expires after half and hour (1800 seconds = 30 minutes)
  //let token = jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '10s' });
  let token = null;
  if (expiresIn != null)
    token = jwt.sign(store, process.env.TOKEN_SECRET, expiresIn);
  else
    token = jwt.sign(store, process.env.TOKEN_SECRET);

  return token;
}

config.checkToken = (req, res, run) => {
  const jwt = require('jsonwebtoken');
  var token = req.headers['token'] || req.body.token;
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.', err, token });

    run(err, decoded);
  });

}

config.saveImage = async (base64Str, dir = null) => {
  const { v4: uuidv4 } = require('uuid');

  var fs = require("fs");

  var base64Data = base64Str.split(',').pop();




  let file = '_' + uuidv4() + '_.jpg';
  if (!dir)
    dir = `/home/html/uploads/${file}`;
  else {
    config.mkdir(`/home/html/uploads/${dir}`);
    dir = `/home/html/uploads/${dir}/${file}`;
  }



  const promise = new Promise((resolve, reject) => {

    fs.writeFile(dir, base64Data, "base64", function (err) {
      if (!err)
        resolve(file);
      else
        resolve(err);
    });

  });

  return await promise.then();



}


config.mkdir = dir => {
  let fs = require('fs');
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Directory created successfully!');
    });
  }
}


config.setImageURL = (endpont) => {
  return `${process.env.BASE_URL}/uploads/${endpont}`;
}




config.saveFile = async (req, key, dist = null) => {
  if (!req.files || Object.keys(req.files).length === 0)
    return { status: !1, message: 'Select image first' };
  let file = req.files[key];

  if (2457600 < file.size)
    return { status: !1, message: 'image size less than ' + (2457600 / 2024).toFixed(0) + 'Mb' };



  if ((file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') || file.size < 1000)
    return { status: !1, message: 'Please enter valid image' };



  let file_name = Date.now() + '.jpg';
  var dir = '';

  if (!dist)
    dir = '/home/html/uploads/' + file_name;
  else {
    config.mkdir(`/home/html/uploads/${dist}`);
    dir = '/home/html/uploads/' + dist + '/' + file_name;
  }



  const promise = new Promise((resolve, reject) => {


    file.mv(dir, function (err) {
      if (err) {
        resolve({ status: !1, message: 'File path Can not found!' });
      }

      resolve({ status: true, message: 'Success', file: file_name })


    });



  });

  return promise.then()

}


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { // setting destination of uploading files        
    if (file.fieldname === "resume") { // if uploading resume
      cb(null, 'resumes');
    } else { // else uploading image
      cb(null, 'images');
    }
  },
  filename: (req, file, cb) => { // naming file
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") { // if uploading resume
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) { // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else { // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};




config.upload = async () => {
  return multer({
    storage: fileStorage,
    limits:
    {
      fileSize: '2mb'
    },
    fileFilter: fileFilter
  }
  ).fields(
    [
      {
        name: 'resume',
        maxCount: 1
      },
      {
        name: 'image',
        maxCount: 1
      }
    ]
  )

}


config.date = (date = null) => {
  if (!date)
    return moment.tz(Date.now(), process.env.TZ).format('YYYY-MM-DD');
  else
    return moment.tz(new Date(date), process.env.TZ).format('YYYY-MM-DD');
}

config.dateTime = (date = null) => {
  if (!date)
    return moment.tz(Date.now(), process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
  else
    return moment.tz(new Date(date), process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
}

config.timestamp = (date = null) => {
  if (!date)
    // return   new Date(date).getTime();
    return moment.tz(Date.now(), process.env.TZ).unix();
  else
    return moment.tz(new Date(date), process.env.TZ).unix();
}


global.app = config;

module.exports = config