import React from 'react';
import './SubjectListScreen.css';

interface SubjectListScreenProps {
  mode: 'video' | 'library' | 'mario' | 'game2' | '1v1' | 'test';
  onSelectSubject: (subject: string) => void;
  onBack: () => void;
}

const subjects = [
  { id: 'sub1', name: 'Subject 1', color: 'var(--au-red)' },
  { id: 'sub2', name: 'Subject 2', color: 'var(--au-blue)' },
  { id: 'sub3', name: 'Subject 3', color: 'var(--au-green)' },
  { id: 'sub4', name: 'Subject 4', color: 'var(--au-yellow)' },
  { id: 'sub5', name: 'Subject 5', color: 'var(--au-pink)' }
];

const SubjectListScreen: React.FC<SubjectListScreenProps> = ({ mode, onSelectSubject, onBack }) => {
  const getTitle = () => {
    switch(mode) {
      case 'video': return '📺 Video Lectures';
      case 'library': return '📖 Library';
      case 'mario': return '🍄 Mario Practice';
      case 'game2': return '🎮 Game 2';
      case '1v1': return '⚔️ 1v1 Battle';
      case 'test': return '📝 Custom Test';
      default: return 'Select Subject';
    }
  };

  return (
    <div className="subject-list-panel au-panel">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="main-title" style={{ fontSize: '2.5rem' }}>
        {getTitle()}
      </h1>
      <p className="subtitle" style={{marginBottom: '30px'}}>Select a Subject to begin</p>
      
      <div className="subjects-grid">
        {subjects.map((sub) => (
          <button 
            key={sub.id} 
            className="subject-card"
            style={{ borderColor: sub.color }}
            onClick={() => onSelectSubject(sub.name)}
          >
            <div className="subject-icon" style={{ backgroundColor: sub.color }}></div>
            <h3 style={{ color: sub.color }}>{sub.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectListScreen;
