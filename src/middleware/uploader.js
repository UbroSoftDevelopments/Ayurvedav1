const multer = require('multer');
const path = require('path')
const config = require("../config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // return  cb(null, 'html/web/uploads/');
    return cb(null, config.uploadFolder);
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  }
});

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: config.uploadFolder,
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});





const upload = multer({ storage: storage })
module.exports = upload;
