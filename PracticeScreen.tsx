import React from 'react';
import './PracticeScreen.css';

interface PracticeScreenProps {
  onSelectGame: (game: 'mario' | 'codex' | '1v1' | 'blaster') => void;
  onBack: () => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ onSelectGame, onBack }) => {
  return (
    <div className="practice-panel au-panel">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="main-title">PRACTICE ARENA</h1>
      <p className="subtitle" style={{marginBottom: '30px'}}>Choose your training simulation</p>
      
      <div className="options-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div className="option-card mario-card" onClick={() => onSelectGame('mario')}>
          <div className="icon-wrapper">
            <span className="icon">🍄</span>
          </div>
          <h2>Mario</h2>
          <p>Platformer Challenge</p>
        </div>
        
        <div className="option-card game2-card" onClick={() => onSelectGame('codex')} style={{ borderColor: 'var(--au-cyan)' }}>
          <div className="icon-wrapper" style={{ backgroundColor: 'var(--au-cyan)' }}>
            <span className="icon">💻</span>
          </div>
          <h2 style={{ color: 'var(--au-cyan)' }}>Coding</h2>
          <p>Terminal Challenge</p>
        </div>

        <div className="option-card game3-card" onClick={() => onSelectGame('1v1')}>
          <div className="icon-wrapper">
            <span className="icon">⚔️</span>
          </div>
          <h2>1 v 1 Battle</h2>
          <p>Challenge a rival!</p>
        </div>

        <div className="option-card mario-card" onClick={() => onSelectGame('blaster')} style={{ borderColor: 'var(--au-pink)' }}>
          <div className="icon-wrapper" style={{ backgroundColor: 'var(--au-pink)' }}>
            <span className="icon">🚀</span>
          </div>
          <h2 style={{ color: 'var(--au-pink)' }}>Game Blaster</h2>
          <p>Space Shooter</p>
        </div>
      </div>
    </div>
  );
};

export default PracticeScreen;
