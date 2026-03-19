import React from 'react';
import './SubjectSelector.css';

interface SubjectSelectorProps {
  onSelectSubject: (subject: string) => void;
}

const SUBJECTS = [
  { id: 'math', name: 'Mathematics', icon: '➗', color: 'var(--au-blue)' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'var(--au-green)' },
  { id: 'history', name: 'History', icon: '🏛️', color: 'var(--au-brown)' },
  { id: 'language', name: 'Language', icon: '📝', color: 'var(--au-yellow)' },
  { id: 'logic', name: 'Logic', icon: '🧩', color: 'var(--au-purple)' }
];

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelectSubject }) => {
  return (
    <div className="au-panel subject-panel">
      <h1 className="au-title">Admin Console</h1>
      <h2 className="subtitle">Select Task Category</h2>
      
      <div className="subject-grid">
        {SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            className="subject-card"
            style={{ '--target-bg': sub.color } as React.CSSProperties}
            onClick={() => onSelectSubject(sub.id)}
          >
            <div className="subject-icon">{sub.icon}</div>
            <div className="subject-name">{sub.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
