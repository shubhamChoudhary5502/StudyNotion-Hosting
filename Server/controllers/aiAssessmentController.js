require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate Quiz Questions from Course Content
const generateQuiz = async (req, res) => {
  try {
    const { topic, numQuestions } = req.body;

    const prompt = `Generate ${numQuestions} multiple-choice questions (MCQs) on the topic "${topic}". Format as JSON: [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "B" }]`;

    const response = await openai.createCompletion({
      model: "gpt-4",
      prompt,
      max_tokens: 500,
    });

    const quiz = JSON.parse(response.data.choices[0].text.trim());
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Evaluate User Responses
const evaluateAnswers = async (req, res) => {
  try {
    const { questions, userAnswers } = req.body;

    let correctCount = 0;
    const results = questions.map((q, index) => {
      const isCorrect = q.answer === userAnswers[index];
      if (isCorrect) correctCount++;
      return { question: q.question, correct: isCorrect, correctAnswer: q.answer };
    });

    res.json({ score: correctCount, total: questions.length, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateQuiz, evaluateAnswers };
