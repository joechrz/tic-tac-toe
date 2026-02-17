import React from 'react';
import Cell from './Cell';
import { Board as BoardClass } from '../utils/Board';

interface BoardProps {
  board: BoardClass;
  onCellClick: (index: number) => void;
  winningCells: number[];
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, winningCells, disabled }) => {
  return (
    <div className="board">
      {Array.from({ length: 9 }, (_, index) => (
        <Cell
          key={index}
          index={index}
          value={board.getCell(index)}
          isWinning={winningCells.includes(index)}
          onClick={() => onCellClick(index)}
          disabled={disabled || !board.isEmpty(index)}
        />
      ))}
    </div>
  );
};

export default Board;
