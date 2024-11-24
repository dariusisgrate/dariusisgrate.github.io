I am darius franklin studing in shis
my partner is sherwin
about me
<o><b>name :darius franklin</o></b>
<o><b>location:tamil nadu</o><b/>
<o><b>school:sacred heart international school</b></o>
import React, { useState } from "react";
import "./App.css";

// Sample questions
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
    answer: "Shakespeare",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Oxygen", "Osmium", "Ozone", "Opium"],
    answer: "Oxygen",
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Handle option selection
  const handleOptionSelect = (selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestionIndex] = selectedOption;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Calculate score
  const calculateScore = () => {
    return selectedAnswers.filter((answer, index) => answer === questions[index].answer).length;
  };

  return (
    <div className="App">
      <h1>Quiz App</h1>
      {quizCompleted ? (
        <div className="results">
          <h2>Quiz Completed!</h2>
          <p>Your score: {calculateScore()} / {questions.length}</p>
        </div>
      ) : (
        <div className="question-section">
          <h2>{questions[currentQuestionIndex].question}</h2>
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswers[currentQuestionIndex] === option ? "selected" : ""}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="navigation">
            <button onClick={handleNextQuestion}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
