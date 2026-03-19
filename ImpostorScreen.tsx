import React, { useEffect } from 'react';
import './ImpostorScreen.css';

interface ImpostorScreenProps {
  playerColor: string;
  onRestart: () => void;
}

const ImpostorScreen: React.FC<ImpostorScreenProps> = ({ playerColor, onRestart }) => {
  useEffect(() => {
    // Auto restart after animation (4 seconds)
    const timer = setTimeout(() => {
      onRestart();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onRestart]);

  return (
    <div className="impostor-screen">
      <div className="defeat-text">DEFEAT</div>

      <div className="kill-animation-container">
        {/* Impostor (Always Red here, or random, we'll use Red as classic impostor) */}
        <div className={`impostor-body red`}>
          <div className="visor"></div>
          <div className="backpack"></div>
          <div className="knife"></div>
        </div>

        {/* Victim */}
        <div className={`victim-body ${playerColor}`}>
          <div className="visor"></div>
          <div className="backpack"></div>
        </div>
        
        {/* Flash effect on kill */}
        <div className="flash-overlay"></div>
      </div>
      
      <div className="restart-hint">You will be revived shortly...</div>
    </div>
  );
};

export default ImpostorScreen;
