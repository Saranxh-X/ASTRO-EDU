import React from 'react';
import './SubtopicSelector.css';

interface SubtopicSelectorProps {
  subject: string;
  onSelectSubtopic: (subtopic: string) => void;
  onBack: () => void;
}

const TOPICS_DATA: Record<string, { id: string, name: string }[]> = {
  math: [
    { id: 'algebra', name: 'Algebra' },
    { id: 'geometry', name: 'Geometry' },
    { id: 'calculus', name: 'Calculus' }
  ],
  science: [
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' }
  ],
  history: [
    { id: 'world_war', name: 'World Wars' },
    { id: 'ancient', name: 'Ancient History' },
    { id: 'modern', name: 'Modern Era' }
  ],
  language: [
    { id: 'grammar', name: 'Grammar' },
    { id: 'vocab', name: 'Vocabulary' },
    { id: 'literature', name: 'Literature' }
  ],
  logic: [
    { id: 'puzzles', name: 'Puzzles' },
    { id: 'riddles', name: 'Riddles' },
    { id: 'patterns', name: 'Patterns' }
  ]
};

const SubtopicSelector: React.FC<SubtopicSelectorProps> = ({ subject, onSelectSubtopic, onBack }) => {
  const topics = TOPICS_DATA[subject] || [];

  return (
    <div className="au-panel subtopic-panel">
      <h1 className="au-title">{subject} Tasks</h1>
      
      <div className="subtopic-list">
        {topics.map((topic, index) => (
          <button
            key={topic.id}
            className="subtopic-card"
            onClick={() => onSelectSubtopic(topic.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="task-bullet"></div>
            <span className="task-name">{topic.name}</span>
            <span className="task-status">Pending</span>
          </button>
        ))}
      </div>

      <div className="action-row" style={{ marginTop: '30px' }}>
        <button className="au-button" onClick={onBack}>
          ← Back to Admin
        </button>
      </div>
    </div>
  );
};

export default SubtopicSelector;
