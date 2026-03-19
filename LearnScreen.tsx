import React from 'react';
import './LearnScreen.css';

interface LearnScreenProps {
  onSelectOption: (option: 'video' | 'library') => void;
  onBack: () => void;
}

const LearnScreen: React.FC<LearnScreenProps> = ({ onSelectOption, onBack }) => {
  return (
    <div className="learn-panel au-panel">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="main-title">LEARNING HUB</h1>
      <p className="subtitle" style={{marginBottom: '30px'}}>Select your preferred learning method</p>
      
      <div className="options-container">
        <div className="option-card video-card" onClick={() => onSelectOption('video')}>
          <div className="icon-wrapper">
            <span className="icon">🎥</span>
          </div>
          <h2>Video Lectures</h2>
          <p>Watch guided instructions</p>
        </div>
        <div className="option-card library-card" onClick={() => onSelectOption('library')}>
          <div className="icon-wrapper">
            <span className="icon">📚</span>
          </div>
          <h2>Library</h2>
          <p>Read theory and documents</p>
        </div>
      </div>
    </div>
  );
};

export default LearnScreen;
