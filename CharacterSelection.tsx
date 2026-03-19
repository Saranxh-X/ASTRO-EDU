import React, { useState } from 'react';
import './CharacterSelection.css';

interface CharacterSelectionProps {
  onSelectCharacter: (color: string) => void;
}

const COLORS = [
  'red', 'blue', 'green', 'pink', 'orange', 'yellow', 
  'black', 'white', 'purple', 'brown', 'cyan', 'lime'
];

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelectCharacter }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onSelectCharacter(selected);
    }
  };

  return (
    <div className="au-panel character-panel">
      <h1 className="au-title">Customize</h1>
      
      <div className="color-grid">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`color-btn ${color} ${selected === color ? 'selected' : ''}`}
            onClick={() => setSelected(color)}
            aria-label={`Select ${color} character`}
          >
            {/* Simple CSS representation of crewmate using background color via CSS class */}
            <div className="crewmate">
              <div className="visor"></div>
              <div className="backpack"></div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="action-row">
        <button 
          className="au-button" 
          onClick={handleConfirm}
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.5, cursor: selected ? 'pointer' : 'not-allowed' }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection;
