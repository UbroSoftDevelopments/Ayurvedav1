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
router.use('/notes', require("./notes"));
// Export the router
module.exports = router;