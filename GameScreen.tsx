import React, { useState, useEffect } from 'react';
import './GameScreen.css';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

// Dummy question generator based on subtopic
const generateQuestions = (subtopic: string): Question[] => {
  return [
    { id: 1, text: `What is the core concept of ${subtopic}?`, options: ['A', 'B', 'Correct Answer', 'D'], correctIndex: 2 },
    { id: 2, text: `Who discovered ${subtopic}?`, options: ['Einstein', 'Newton', 'Curie', 'Correct Dude'], correctIndex: 3 },
    { id: 3, text: `Why is ${subtopic} important?`, options: ['Because YES', 'It is not', 'Correct Reason', 'IDK'], correctIndex: 2 },
    { id: 4, text: `Advanced ${subtopic} query?`, options: ['Correct Option', 'Wrong', 'Wrong', 'Wrong'], correctIndex: 0 },
    { id: 5, text: `Final ${subtopic} evaluation?`, options: ['W', 'X', 'Y', 'Correct Z'], correctIndex: 3 },
  ];
};

interface Asteroid {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  question: Question;
}

interface GameScreenProps {
  subtopic: string | null;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  onGameComplete: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ subtopic, onCorrectAnswer, onWrongAnswer, onGameComplete }) => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<Asteroid | null>(null);

  useEffect(() => {
    if (!subtopic) return;
    const questions = generateQuestions(subtopic);
    
    const initialAsteroids = questions.map((q, i) => ({
      id: q.id,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      speed: Math.random() * 2 + 0.5,
      size: Math.random() * 40 + 60, // 60px to 100px
      question: q
    }));
    
    setAsteroids(initialAsteroids);
  }, [subtopic]);

  // Floating animation effect
  useEffect(() => {
    if (activeQuestion) return; // Pause floating when answering

    const interval = setInterval(() => {
      setAsteroids(prev => prev.map(ast => {
        let newX = ast.x + (Math.random() - 0.5) * ast.speed;
        let newY = ast.y + (Math.random() - 0.5) * ast.speed;
        
        // Bounce off walls
        if (newX < 5 || newX > 95) newX = ast.x;
        if (newY < 5 || newY > 95) newY = ast.y;
        
        return { ...ast, x: newX, y: newY };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [activeQuestion]);

  const handleAsteroidClick = (asteroid: Asteroid) => {
    setActiveQuestion(asteroid);
  };

  const handleAnswerSubmit = (selectedIndex: number) => {
    if (!activeQuestion) return;
    
    if (selectedIndex === activeQuestion.question.correctIndex) {
      // Destroy asteroid
      const newAsteroids = asteroids.filter(a => a.id !== activeQuestion.id);
      setAsteroids(newAsteroids);
      onCorrectAnswer();
      
      if (newAsteroids.length === 0) {
        onGameComplete();
      }
    } else {
      onWrongAnswer();
    }
    
    setActiveQuestion(null);
  };

  return (
    <div className="game-screen">
      {/* Reticle UI */}
      <div className="crosshair">
        <div className="ch-hor"></div>
        <div className="ch-ver"></div>
        <div className="ch-circle"></div>
      </div>

      {asteroids.map((ast) => (
        <div
          key={ast.id}
          className="asteroid"
          style={{
            left: `${ast.x}%`,
            top: `${ast.y}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
          }}
          onClick={() => handleAsteroidClick(ast)}
        >
          {/* Simple CSS Asteroid surface */}
          <div className="crater c1"></div>
          <div className="crater c2"></div>
        </div>
      ))}

      {activeQuestion && (
        <div className="question-modal-overlay">
          <div className="au-panel question-panel">
            <h2 className="au-title" style={{fontSize: '2rem'}}>Incoming Task</h2>
            <p className="question-text">{activeQuestion.question.text}</p>
            
            <div className="options-grid">
              {activeQuestion.question.options.map((opt, idx) => (
                <button 
                  key={idx} 
                  className="au-button option-btn"
                  onClick={() => handleAnswerSubmit(idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
