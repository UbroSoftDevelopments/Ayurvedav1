const express = require("express");
const { VideoController } = require("../controllers");
const router = express.Router();


router.post("/", VideoController.addVideo);
router.get("/", VideoController.getVideo);
router.put("/", VideoController.updateVideo);
router.delete("/", VideoController.deleteVideo);


router.get("/chapter/:id", VideoController.getVideoByChapterId);

module.exports = router;