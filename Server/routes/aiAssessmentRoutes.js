const express = require("express");
const { generateQuiz, evaluateAnswers } = require("../controllers/aiAssessmentController");

const router = express.Router();

router.post("/generate-quiz", generateQuiz);
router.post("/evaluate-answers", evaluateAnswers);

module.exports = router;
