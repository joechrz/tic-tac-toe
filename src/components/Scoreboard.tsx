import React from 'react';
import { CellValue } from '../utils/types';

interface ScoreboardProps {
  playerScore: number;
  computerScore: number;
  drawScore: number;
  playerSymbol: CellValue;
  computerSymbol: CellValue;
  onResetScores: () => void;
  onNewSetup: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  playerScore,
  computerScore,
  drawScore,
  playerSymbol,
  computerSymbol,
  onResetScores,
  onNewSetup,
}) => {
  return (
    <aside className="scoreboard">
      <h2>Score</h2>
      <div className="score-items">
        <div className="score-item player-score">
          <div className="score-label">
            <span className="score-icon">{playerSymbol}</span>
            <span>You</span>
          </div>
          <div className="score-value">{playerScore}</div>
        </div>

        <div className="score-item draw-score">
          <div className="score-label">
            <span className="score-icon">−</span>
            <span>Draw</span>
          </div>
          <div className="score-value">{drawScore}</div>
        </div>

        <div className="score-item computer-score">
          <div className="score-label">
            <span className="score-icon">{computerSymbol}</span>
            <span>Computer</span>
          </div>
          <div className="score-value">{computerScore}</div>
        </div>
      </div>

      <button className="reset-scores-btn" onClick={onResetScores}>
        Reset Scores
      </button>
      <button className="new-setup-btn" onClick={onNewSetup}>
        New Setup
      </button>
    </aside>
  );
};

export default Scoreboard;
