const express = require("express");
const { ConfigController } = require("../controllers");
const router = express.Router();
const { checkAdminAuth } = require("../middleware");


router.post("/", checkAdminAuth, ConfigController.addCofig);
router.put("/", checkAdminAuth, ConfigController.updateConfig);
router.get("/", ConfigController.getConfig);


module.exports = router;