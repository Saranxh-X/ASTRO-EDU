import React, { useState } from 'react';
import './TestSetupScreen.css';

interface TestSetupScreenProps {
  subject: string;
  onStartTest: (questions: number, timerMinutes: number) => void;
  onBack: () => void;
}

const TestSetupScreen: React.FC<TestSetupScreenProps> = ({ subject, onStartTest, onBack }) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [timerMinutes, setTimerMinutes] = useState(10);

  const handleStart = () => {
    onStartTest(questionCount, timerMinutes);
  };

  return (
    <div className="test-setup-panel au-panel">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="main-title" style={{ fontSize: '2.5rem' }}>
        📝 Configure Test
      </h1>
      <h2 style={{ color: 'var(--au-cyan)', marginBottom: '30px' }}>{subject}</h2>
      
      <div className="setup-form">
        <div className="setup-group">
          <label>Number of Questions (Multiples of 5):</label>
          <div className="stepper-controls">
            <button 
              className="stepper-btn" 
              onClick={() => setQuestionCount(Math.max(5, questionCount - 5))}
              disabled={questionCount <= 5}
            >
              -
            </button>
            <span className="stepper-value">{questionCount}</span>
            <button 
              className="stepper-btn" 
              onClick={() => setQuestionCount(questionCount + 5)}
            >
              +
            </button>
          </div>
        </div>

        <div className="setup-group">
          <label>Time Limit (Minutes):</label>
          <div className="stepper-controls">
            <button 
              className="stepper-btn" 
              onClick={() => setTimerMinutes(Math.max(1, timerMinutes - 1))}
              disabled={timerMinutes <= 1}
            >
              -
            </button>
            <span className="stepper-value">{timerMinutes}</span>
            <button 
              className="stepper-btn" 
              onClick={() => setTimerMinutes(timerMinutes + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button className="start-test-btn au-button" onClick={handleStart}>
          START TEST
        </button>
      </div>
    </div>
  );
};

export default TestSetupScreen;
