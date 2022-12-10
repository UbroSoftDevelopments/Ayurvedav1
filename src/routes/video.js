const express = require("express");
const { VideoController } = require("../controllers");
const router = express.Router();
const { checkAdminAuth } = require("../middleware");


router.post("/", checkAdminAuth, VideoController.addVideo);
router.get("/", VideoController.getVideo);
router.put("/", checkAdminAuth, VideoController.updateVideo);
router.delete("/:id", checkAdminAuth, VideoController.deleteVideo);

//only demo is allowed is pending todo
router.get("/chapter/:id", VideoController.getVideoByChapterId);

module.exports = router;