const multer = require('multer');
const express = require("express");
const path = require('path')
const router = express.Router();
const app = express();



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // return  cb(null, 'html/web/uploads/');
    return  cb(null, 'html/uploads/');
   },
  filename: function (req, file, cb) {
     return cb(null , file.originalname);
  }
});
  
  

 const upload = multer({ storage : storage })
 module.exports = upload;