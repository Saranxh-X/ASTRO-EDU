import React from 'react';

interface BlasterGameProps {
  onBack: () => void;
}

const BlasterGameScreen: React.FC<BlasterGameProps> = ({ onBack }) => {
  return (
    <div style={{ width: '100%', minHeight: '770px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div className="au-panel" style={{ padding: '15px 30px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="au-button" style={{ padding: '8px 16px', fontSize: '1rem' }} onClick={onBack}>← Back</button>
        <h2 style={{ margin: 0, color: 'var(--au-pink)', letterSpacing: '2px' }}>GAME BLASTER</h2>
        <div style={{ width: '80px' }}></div>
      </div>
      <div className="au-panel" style={{ flex: 1, padding: '10px', overflow: 'hidden', backgroundColor: 'black' }}>
        <iframe 
          src="/game_blaster/index.html" 
          width="100%" 
          height="720px" 
          style={{ border: 'none' }}
          scrolling="no"
          title="Game Blaster"
        />
      </div>
    </div>
  );
};

export default BlasterGameScreen;
