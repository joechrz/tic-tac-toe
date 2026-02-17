import React, { useState } from 'react';
import Game from './Game';
import SetupModal from './SetupModal';
import { CellValue } from '../utils/types';

const App: React.FC = () => {
  const [showSetup, setShowSetup] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState<CellValue>('X');
  const [playerGoesFirst, setPlayerGoesFirst] = useState(true);

  const handleStartGame = (symbol: CellValue, goesFirst: boolean) => {
    setPlayerSymbol(symbol);
    setPlayerGoesFirst(goesFirst);
    setShowSetup(false);
  };

  const handleNewSetup = () => {
    setShowSetup(true);
  };

  return (
    <>
      {showSetup ? (
        <SetupModal onStartGame={handleStartGame} />
      ) : (
        <Game
          playerSymbol={playerSymbol}
          playerGoesFirst={playerGoesFirst}
          onNewSetup={handleNewSetup}
        />
      )}
    </>
  );
};

export default App;
