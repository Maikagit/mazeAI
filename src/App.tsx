import React, { useState, useEffect } from 'react';
import { MazeRenderer } from './components/MazeRenderer';
import { ConnectionStatus } from './components/ConnectionStatus';
import { useGameState } from './hooks/useGameState';
import { Ghost } from 'lucide-react';
import { socketService } from './services/socket';

function App() {
  const { gameState } = useGameState();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketService.on('connect', () => setIsConnected(true));
    socketService.on('disconnect', () => setIsConnected(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Ghost className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">Maze Runner</h1>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-gray-300">Use arrow keys to move the red player</p>
          <ConnectionStatus isConnected={isConnected} />
        </div>
        {gameState.gameStatus === 'finished' && (
          <p className="text-xl font-bold text-green-400 mt-2">
            Player {gameState.winner} wins!
          </p>
        )}
      </div>

      <div className="relative">
        <MazeRenderer
          maze={gameState.maze}
          players={gameState.players}
          cellSize={12} // Reduced cell size to fit the larger maze
        />
      </div>

      <div className="mt-8 flex gap-4">
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className="bg-gray-700 p-4 rounded-lg text-white"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: player.color }}
              />
              <span>Player {index + 1}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Position: ({player.x}, {player.y})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;