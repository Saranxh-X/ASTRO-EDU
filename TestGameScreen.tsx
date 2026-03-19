import React, { useState, useEffect } from 'react';
import './TestGameScreen.css';

interface TestGameScreenProps {
  subject: string;
  questionCount: number;
  timerMinutes: number;
  onFinish: (score: number, total: number) => void;
}

const mockQuestions = [
  { text: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: 2 },
  { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { text: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: 1 },
  { text: "H2O is the chemical formula for?", options: ["Water", "Salt", "Oxygen", "Gold"], answer: 0 },
  { text: "Who wrote Romeo and Juliet?", options: ["Dickens", "Hemingway", "Shakespeare", "Twain"], answer: 2 },
];

const TestGameScreen: React.FC<TestGameScreenProps> = ({ subject, questionCount, timerMinutes, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerMinutes * 60);

  // Fallback if not enough mock questions (loop through them)
  const currentQuestion = mockQuestions[currentQuestionIndex % mockQuestions.length];

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(score, questionCount);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score, questionCount, onFinish]);

  const handleAnswerClick = (index: number) => {
    let newScore = score;
    if (index === currentQuestion.answer) {
      newScore += 1;
      setScore(newScore);
    }
    
    if (currentQuestionIndex + 1 < questionCount) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onFinish(newScore, questionCount);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="test-game-container au-panel">
      <div className="test-header">
        <div className="test-progress">
          Question {currentQuestionIndex + 1} / {questionCount}
        </div>
        <div className="test-subject">{subject}</div>
        <div className={`test-timer ${timeLeft <= 60 ? 'warning' : ''}`}>
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="question-box">
        <h2>{currentQuestion.text}</h2>
      </div>

      <div className="options-grid">
        {currentQuestion.options.map((opt, i) => (
          <button 
            key={i} 
            className="option-btn"
            onClick={() => handleAnswerClick(i)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestGameScreen;
