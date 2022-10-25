const express = require("express");

const {UserController,AdminController} = require("../controllers");
const {upload} = require("../middleware");

const router = express.Router();

router.post('/login', AdminController.login);
router.post('/signup', AdminController.signup);
router.put('/update-profile', AdminController.updateProfile);
router.put('/password', AdminController.updatePassword);

router.post('/category', AdminController.addCategory);
router.get('/category', AdminController.getCategory);
router.put('/category', AdminController.updateCategory);
router.delete('/category', AdminController.deleteCategory);

router.post('/branch', AdminController.addBranch);
router.get('/branch', AdminController.getBranch);

router.post('/demo-course', AdminController.addDemoCourse);
router.get('/demo-course', AdminController.getDemoCourse);



module.exports = router
