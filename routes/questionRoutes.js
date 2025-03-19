const express = require("express");
const shopController = require("./../controllers/questionController");
const router = express.Router();

// router.param('id', tourController.);

router.route("/").get(shopController.getAllQuestions).post(shopController.createQuestion)
router.route("/:id").get(shopController.getQuestion).patch(shopController.updateQuestion).delete(shopController.deleteQuestion)
router.route("/search/:keyword").get(shopController.getQuestionByKeyword)

module.exports = router;