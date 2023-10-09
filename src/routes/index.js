const express = require("express");
const multer = require('multer');
const router = express.Router();

router.get('/', (req, res, next) => {

  res.json({ status: true, message: 'Api is running. 🏃‍♀️' });
});


router.use('/user', multer().none(), require("./user"));
router.use('/admin', multer().none(), require("./admin"));
router.use('/student', require("./student"));
router.use('/category', require("./category"));
router.use('/chapter', require("./chapter"));
router.use('/course', require("./course"));
router.use('/sub-subject', require("./subSubject"));
router.use('/subject', require("./subject"));
router.use('/liveClass', require("./liveClass"));
router.use('/topic', require("./topic"));
router.use('/question', require("./question"));
router.use('/video', multer().none(), require("./video"));
router.use('/taskQ', multer().none(), require("./taskQuestion"));
router.use('/freeSession', multer().none(), require("./freeSession"));
router.use('/notes', require("./notes"));
router.use('/test-series', require("./testseries"));
router.use('/test-paper', require("./testpaper"));
router.use('/practice-paper', require("./practicePaper"));
router.use('/test-response', require("./testresponse"));
router.use('/config', require("./config"));
router.use('/discount', require("./discount"));
router.use('/report', require("./report"));
router.use('/faculty', require("./faculty"));
router.use('/performance', require("./performance"));
router.use('/order', require("./order"));
// Export the router
module.exports = router;