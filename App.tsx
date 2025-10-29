
import React, { useState, useCallback } from 'react';
import { GameMode, GameState } from './types';
import HomeScreen from './components/HomeScreen';
import GameContainer from './components/GameContainer';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Home);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const handleStartGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameState(GameState.Playing);
  }, []);

  const handleGameEnd = useCallback(() => {
    setGameState(GameState.Home);
    setGameMode(null);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        if (gameMode) {
          return <GameContainer mode={gameMode} onGameEnd={handleGameEnd} />;
        }
        // Fallback to home if mode is not set
        return <HomeScreen onStartGame={handleStartGame} />;
      case GameState.Home:
      default:
        return <HomeScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-100 via-sky-100 to-gray-100 opacity-50 z-0"></div>
      <main className="relative z-10 w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
