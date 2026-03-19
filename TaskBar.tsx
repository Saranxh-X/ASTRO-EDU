import React from 'react';
import './TaskBar.css';

interface TaskBarProps {
  progress: number; // 0 to 100
}

const TaskBar: React.FC<TaskBarProps> = ({ progress }) => {
  return (
    <div className="task-bar-container">
      <div className="task-label">TOTAL TASKS COMPLETED</div>
      <div className="task-bar-track">
        <div 
          className="task-bar-fill" 
          style={{ width: `${progress}%` }}
        >
          {/* Highlight effect for the glossy look */}
          <div className="task-bar-glint"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskBar;
