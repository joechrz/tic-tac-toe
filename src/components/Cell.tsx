import React from 'react';
import { CellValue } from '../utils/types';

interface CellProps {
  index: number;
  value: CellValue;
  isWinning: boolean;
  onClick: () => void;
  disabled: boolean;
}

const Cell: React.FC<CellProps> = ({ index, value, isWinning, onClick, disabled }) => {
  const getCellClasses = () => {
    const classes = ['cell'];
    if (value) classes.push('filled');
    if (isWinning) classes.push('win');
    if (disabled) classes.push('disabled');
    return classes.join(' ');
  };

  const handleClick = () => {
    if (!disabled && !value) {
      onClick();
    }
  };

  return (
    <div
      className={getCellClasses()}
      onClick={handleClick}
      data-index={index}
    >
      {value && <span className={`mark ${value === 'X' ? 'x' : 'o'}`}>{value}</span>}
    </div>
  );
};

export default Cell;
