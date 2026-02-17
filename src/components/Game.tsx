import React, { useState, useEffect, useMemo } from 'react';
import Board from './Board';
import Scoreboard from './Scoreboard';
import { Board as BoardClass } from '../utils/Board';
import { WinChecker } from '../utils/WinChecker';
import { Player } from '../utils/Player';
import { AIPlayer } from '../utils/AIPlayer';
import { CellValue, GameState } from '../utils/types';

interface GameProps {
  playerSymbol: CellValue;
  playerGoesFirst: boolean;
  onNewSetup: () => void;
}

const Game: React.FC<GameProps> = ({ playerSymbol, playerGoesFirst, onNewSetup }) => {
  const computerSymbol: CellValue = playerSymbol === 'X' ? 'O' : 'X';

  const [board, setBoard] = useState(new BoardClass());
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>(playerGoesFirst ? playerSymbol : computerSymbol);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<CellValue>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const player = useMemo(() => new Player(playerSymbol, 'human'), [playerSymbol]);
  const computer = useMemo(() => new AIPlayer(computerSymbol, 'computer'), [computerSymbol]);
  const winChecker = useMemo(() => new WinChecker(), []);

  // Computer move effect
  useEffect(() => {
    if (gameState === 'playing' && currentPlayer === computerSymbol && !isComputerThinking) {
      setIsComputerThinking(true);

      setTimeout(() => {
        const bestMove = computer.getBestMove(board, playerSymbol);
        if (bestMove !== -1) {
          makeMove(bestMove);
        }
        setIsComputerThinking(false);
      }, 600);
    }
  }, [currentPlayer, gameState]);

  const makeMove = (index: number) => {
    if (gameState !== 'playing' || isComputerThinking) return;
    if (!board.isEmpty(index)) return;

    const newBoard = board.clone();
    newBoard.setCell(index, currentPlayer);
    setBoard(newBoard);

    // Check for win or draw
    const winResult = winChecker.checkWin(newBoard);
    if (winResult) {
      setGameState('won');
      setWinner(winResult.winner);
      setWinningCells(winResult.combination);

      if (winResult.winner === playerSymbol) {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
      } else {
        setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
      }
    } else if (winChecker.checkDraw(newBoard)) {
      setGameState('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      // Switch player
      setCurrentPlayer(currentPlayer === playerSymbol ? computerSymbol : playerSymbol);
    }
  };

  const handleCellClick = (index: number) => {
    if (currentPlayer !== playerSymbol || isComputerThinking) return;
    makeMove(index);
  };

  const handleNewGame = () => {
    setBoard(new BoardClass());
    setCurrentPlayer(playerGoesFirst ? playerSymbol : computerSymbol);
    setGameState('playing');
    setWinner(null);
    setWinningCells([]);
    setIsComputerThinking(false);
  };

  const handleResetScores = () => {
    setScores({ player: 0, computer: 0, draws: 0 });
  };

  const getTurnText = () => {
    if (gameState === 'won') {
      return winner === playerSymbol ? 'You win! 🎉' : 'Computer wins!';
    }
    if (gameState === 'draw') {
      return "It's a draw!";
    }
    if (isComputerThinking) {
      return 'Computer is thinking...';
    }
    return currentPlayer === playerSymbol ? 'Your turn' : "Computer's turn";
  };

  return (
    <div className="game-container">
      <div className="game-wrapper">
        <Scoreboard
          playerScore={scores.player}
          computerScore={scores.computer}
          drawScore={scores.draws}
          playerSymbol={playerSymbol}
          computerSymbol={computerSymbol}
          onResetScores={handleResetScores}
          onNewSetup={onNewSetup}
        />

        <main className="game-area">
          <div className="game-header">
            <h1 className="game-title">Tic-Tac-Toe</h1>
            <div className="turn-indicator">
              <span>{getTurnText()}</span>
            </div>
          </div>

          <Board
            board={board}
            onCellClick={handleCellClick}
            winningCells={winningCells}
            disabled={gameState !== 'playing' || isComputerThinking || currentPlayer !== playerSymbol}
          />

          <div className="game-status">
            {gameState === 'won' && (winner === playerSymbol ? 'You win! 🎉' : 'Computer wins!')}
            {gameState === 'draw' && "It's a draw!"}
          </div>

          <div className="game-controls">
            <button className="control-btn" onClick={handleNewGame}>
              New Game
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Game;
