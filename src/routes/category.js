const express = require("express");

const { CategoryController } = require("../controllers");
const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", pics, CategoryController.addCategory);
router.get("/", CategoryController.getCategory);
router.put("/", pics, CategoryController.updateCategory);
router.delete("/", CategoryController.deleteCategory);

router.get("/active", CategoryController.getActiveCategory);








module.exports = router;