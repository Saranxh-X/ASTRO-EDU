import React from 'react';

interface SetupProps {
  subject: string;
  onStart: (opponent: 'computer' | 'player2') => void;
  onBack: () => void;
}

const OneVOneSetupScreen: React.FC<SetupProps> = ({ subject, onStart, onBack }) => {
  return (
    <div className="au-panel" style={{ width: '600px', textAlign: 'center', position: 'relative' }}>
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="main-title" style={{ fontSize: '3rem', color: 'var(--au-orange)' }}>1v1 BATTLE</h1>
      <h2 style={{ color: 'var(--au-cyan)', marginBottom: '40px' }}>Subject: {subject}</h2>
      
      <p style={{ margin: '20px 0', fontSize: '1.2rem' }}>Select your opponent setting:</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button 
          className="au-button primary" 
          onClick={() => onStart('computer')}
          style={{ borderColor: 'var(--au-purple)', flex: '1', padding: '20px' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤖</div>
          VS Computer
        </button>
        <button 
          className="au-button" 
          onClick={() => onStart('player2')}
          style={{ borderColor: 'var(--au-green)', flex: '1', padding: '20px' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
          VS Player 2 (Local)
        </button>
      </div>
    </div>
  );
};

export default OneVOneSetupScreen;
