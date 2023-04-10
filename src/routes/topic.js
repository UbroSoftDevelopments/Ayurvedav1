const express = require("express");
const { checkAdminAuth } = require("../middleware");
const { TopicController } = require("../controllers");

const router = express.Router();
const uploader = require('../middleware/uploader');
var pics = uploader.single('photo');

router.post("/", checkAdminAuth, TopicController.addTopic);
router.get("/", TopicController.getTopic);
router.get("/:id", TopicController.getTopicById);
router.put("/", checkAdminAuth, TopicController.updateTopic);
router.delete("/:id", checkAdminAuth, TopicController.deleteTopic);
router.get("/course/:id", TopicController.getTopicByClassId);
router.get("/active/:id", TopicController.getActiveTopicByClassId);
router.post("/joinLiveClass", TopicController.joinLiveClassOfTopic)


module.exports = router;