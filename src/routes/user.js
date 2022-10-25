const express = require("express");
const {checkAuth} = require("../middleware");
 const uploader = require('../middleware/uploader');
// var multer  = require('multer');
// var upload = multer({ dest: 'upload/'});
var type = uploader.single('file');
var facality = uploader.array('facality',5);
var pics = uploader.single('photo');

const {UserController} = require("../controllers");

const router = express.Router();

router.get('/', );


// router.post('/update-banner',checkAuth,pics, UserController.updateBanner);



//router.post('/edit-reply', checkAuth, UserController.editReply)

module.exports = router
