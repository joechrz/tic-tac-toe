import React, { useState } from 'react';
import { CellValue } from '../utils/types';

interface SetupModalProps {
  onStartGame: (symbol: CellValue, goesFirst: boolean) => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ onStartGame }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<CellValue>('X');
  const [goesFirst, setGoesFirst] = useState(true);

  const handleStart = () => {
    onStartGame(selectedSymbol, goesFirst);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h1>Tic-Tac-Toe</h1>
        <p className="modal-subtitle">Configure your game</p>

        <div className="setup-options">
          <div className="option-group">
            <label>Choose your symbol:</label>
            <div className="symbol-selector">
              <button
                className={`symbol-btn ${selectedSymbol === 'X' ? 'active' : ''}`}
                onClick={() => setSelectedSymbol('X')}
                data-symbol="X"
              >
                <span className="symbol-display">X</span>
              </button>
              <button
                className={`symbol-btn ${selectedSymbol === 'O' ? 'active' : ''}`}
                onClick={() => setSelectedSymbol('O')}
                data-symbol="O"
              >
                <span className="symbol-display">O</span>
              </button>
            </div>
          </div>

          <div className="option-group">
            <label>Who goes first?</label>
            <div className="first-selector">
              <button
                className={`first-btn ${goesFirst ? 'active' : ''}`}
                onClick={() => setGoesFirst(true)}
                data-first="player"
              >
                You
              </button>
              <button
                className={`first-btn ${!goesFirst ? 'active' : ''}`}
                onClick={() => setGoesFirst(false)}
                data-first="computer"
              >
                Computer
              </button>
            </div>
          </div>
        </div>

        <button className="start-btn" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default SetupModal;
