const express = require("express");
const { checkAdminAuth } = require("../middleware");

const { CategoryController } = require("../controllers");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router
    .route("/")
    .post(pics, checkAdminAuth, CategoryController.addCategory)
    .get(checkAdminAuth, CategoryController.getCategory)
    .put(pics, checkAdminAuth, CategoryController.updateCategory);


router.delete("/:id", checkAdminAuth, CategoryController.deleteCategory);
router.get("/active", CategoryController.getActiveCategory);








module.exports = router;