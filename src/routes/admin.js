const express = require("express");

const { StudentController, AdminController } = require("../controllers");
const { upload } = require("../middleware");

const router = express.Router();

router.post("/login", AdminController.login);
router.post("/signup", AdminController.signup);
router.put("/update-profile", AdminController.updateProfile);
router.put("/password", AdminController.updatePassword);

router.post("/category", AdminController.addCategory);
router.get("/category", AdminController.getCategory);
router.put("/category", AdminController.updateCategory);
router.delete("/category", AdminController.deleteCategory);

router.post("/course", AdminController.addCourse);
router.get("/course", AdminController.getCourse);

router.put("/course", AdminController.updateCourse);
router.delete("/course", AdminController.deleteCourse);

router.post("/subject", AdminController.addSubject);
router.get("/subject", AdminController.getSubject);

router.post("/sub-subject", AdminController.addSubSubject);
router.get("/sub-subject", AdminController.getSubSubject);


router.post("/chapter", AdminController.addChapter);
router.get("/chapter", AdminController.getChapter);

router.post("/video", AdminController.addVideo);
router.get("/video", AdminController.getVideo);
router.get("/chapterVideo/:id", AdminController.getVideoByChapterId);


module.exports = router;
