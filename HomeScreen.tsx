import React from 'react';
import './HomeScreen.css';

interface HomeScreenProps {
  onSelectMode: (mode: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="home-panel au-panel">
      <h1 className="main-title" style={{ marginBottom: '10px' }}>ASTRO COMMAND</h1>
      <p className="subtitle" style={{marginBottom: '40px', fontSize: '1.2rem', textAlign: 'center'}}>Select Your Mission</p>

      <div className="branch-layout">
        <svg className="branch-lines" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="50" y1="0" x2="50" y2="20" stroke="var(--au-cyan)" strokeWidth="2" />
          <line x1="25" y1="20" x2="75" y2="20" stroke="var(--au-cyan)" strokeWidth="2" />
          <line x1="25" y1="20" x2="25" y2="50" stroke="var(--au-cyan)" strokeWidth="2" />
          <line x1="75" y1="20" x2="75" y2="50" stroke="var(--au-cyan)" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="var(--au-cyan)" strokeWidth="2" />
        </svg>

        <div className="branch-nodes">
          <div className="branch-row top-node">
            <button className="au-button mode-btn node primary" onClick={() => onSelectMode('learn')}>
              Learn
            </button>
          </div>
          <div className="branch-row middle-nodes">
            <button className="au-button mode-btn node" onClick={() => onSelectMode('practice')}>
              Practice
            </button>
            <button className="au-button mode-btn node" onClick={() => onSelectMode('test')}>
              Test
            </button>
          </div>
          <div className="branch-row bottom-node">
            <button className="au-button mode-btn node ai-chat" onClick={() => onSelectMode('ai_chat')}>
              AI Chatbot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
