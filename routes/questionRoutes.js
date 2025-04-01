const express = require("express");
const shopController = require("./../controllers/questionController");
const authController = require("./../controllers/authController.js");
const router = express.Router();

// router.param('id', tourController.);

router.route("/").get(shopController.getAllQuestions).post(authController.protect, authController.restrictTo("admin", "editor"), shopController.createQuestion)
router.route("/:id").get(shopController.getQuestion).patch(authController.protect, authController.restrictTo("admin", "editor"), shopController.updateQuestion).delete(authController.protect, authController.restrictTo("admin"), shopController.deleteQuestion)
router.route("/search/:keyword").get(shopController.getQuestionByKeyword)

module.exports = router;