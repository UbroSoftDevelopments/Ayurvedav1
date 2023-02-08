const express = require("express");
const multer = require('multer');
const router = express.Router();

router.get('/', (req, res, next) => {

  res.json({ status: true, message: 'Api is running. 🏃‍♀️' });
});


router.use('/user', multer().none(), require("./user"));
router.use('/admin', multer().none(), require("./admin"));
router.use('/student', multer().none(), require("./student"));
router.use('/category', require("./category"));
router.use('/chapter', require("./chapter"));
router.use('/course', require("./course"));
router.use('/sub-subject', require("./subSubject"));
router.use('/subject', require("./subject"));
router.use('/question', require("./question"));
router.use('/video', multer().none(), require("./video"));
router.use('/taskQ', multer().none(), require("./taskQuestion"));
router.use('/freeSession', multer().none(), require("./freeSession"));
router.use('/notes', require("./notes"));
router.use('/test-series', require("./testseries"));
router.use('/test-paper', require("./testpaper"));
router.use('/test-response', require("./testresponse"));
router.use('/config', require("./config"));
router.use('/discount', require("./discount"));
router.use('/report', require("./report"));
router.use('/faculty', require("./faculty"));
// Export the router
module.exports = router;