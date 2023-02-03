const express = require("express");
const { FreeSessionController } = require("../controllers");
const router = express.Router();
const { checkAdminAuth } = require("../middleware");



router.post("/", FreeSessionController.addSession);
router.get("/", checkAdminAuth, FreeSessionController.getSession);
router.put("/", checkAdminAuth, FreeSessionController.updateSession);
router.delete("/:id", checkAdminAuth, FreeSessionController.deleteSession);


module.exports = router;