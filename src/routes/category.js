const express = require("express");
const { checkAdminAuth } = require("../middleware");

const { CategoryController } = require("../controllers");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router
    .route("/")
    .post(pics, CategoryController.addCategory)
    .get(CategoryController.getCategory)
    .put(pics, CategoryController.updateCategory);


router.delete("/:id", CategoryController.deleteCategory);
router.get("/active", CategoryController.getActiveCategory);








module.exports = router;