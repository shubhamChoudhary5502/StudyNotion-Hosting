import { useState } from "react";

function AIQuiz() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(null);

  const generateQuiz = async () => {
    const res = await fetch("/api/ai-assessment/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, numQuestions }),
    });

    const data = await res.json();
    setQuiz(data.quiz);
    setUserAnswers(new Array(data.quiz.length).fill(""));
  };

  const submitAnswers = async () => {
    const res = await fetch("/api/ai-assessment/evaluate-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: quiz, userAnswers }),
    });

    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <h2>AI-Based Quiz Generator</h2>
      <input 
        type="text" 
        placeholder="Enter topic (e.g., JavaScript)" 
        value={topic} 
        onChange={(e) => setTopic(e.target.value)} 
      />
      <button onClick={generateQuiz}>Generate Quiz</button>

      {quiz.length > 0 && (
        <div>
          <h3>Quiz Questions</h3>
          {quiz.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((opt, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={opt}
                    onChange={() => {
                      const newAnswers = [...userAnswers];
                      newAnswers[index] = opt;
                      setUserAnswers(newAnswers);
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitAnswers}>Submit</button>
        </div>
      )}

      {results && (
        <div>
          <h3>Results</h3>
          <p>Score: {results.score} / {results.total}</p>
          {results.results.map((r, index) => (
            <p key={index} style={{ color: r.correct ? "green" : "red" }}>
              {r.question} - {r.correct ? "Correct" : `Wrong (Correct: ${r.correctAnswer})`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIQuiz;
