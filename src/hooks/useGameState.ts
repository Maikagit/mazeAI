import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, MazeUpdate, GameStateUpdate } from '../types/maze';
import { generateMaze } from '../utils/mazeGenerator';
import { socketService } from '../services/socket';

const MAZE_WIDTH = 60;
const MAZE_HEIGHT = 60;
const AI_MOVE_INTERVAL = 500; // AI moves every 500ms

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    maze: generateMaze(MAZE_WIDTH, MAZE_HEIGHT),
    players: [
      { id: '1', x: 0, y: 0, color: '#FF6B6B' },
      { id: '2', x: 0, y: MAZE_HEIGHT - 1, color: '#4ECDC4' } // Changed starting position
    ],
    gameStatus: 'playing',
    winner: null
  });

  const checkWinCondition = useCallback((player: Player) => {
    const cell = gameState.maze[player.y][player.x];
    if (cell.isExit) {
      setGameState(prev => ({
        ...prev,
        gameStatus: 'finished',
        winner: player.id
      }));
      return true;
    }
    return false;
  }, [gameState.maze]);

  const movePlayer = useCallback((playerId: string, newX: number, newY: number) => {
    setGameState(prev => {
      const newPlayers = prev.players.map(p => 
        p.id === playerId ? { ...p, x: newX, y: newY } : p
      );
      
      const movedPlayer = newPlayers.find(p => p.id === playerId);
      if (movedPlayer) {
        checkWinCondition(movedPlayer);
      }

      return {
        ...prev,
        players: newPlayers
      };
    });
  }, [checkWinCondition]);

  const canMove = useCallback((playerId: string, direction: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return false;

    const currentCell = gameState.maze[player.y][player.x];
    
    switch (direction) {
      case 'ArrowUp':
        return !currentCell.walls.top && player.y > 0;
      case 'ArrowRight':
        return !currentCell.walls.right && player.x < MAZE_WIDTH - 1;
      case 'ArrowDown':
        return !currentCell.walls.bottom && player.y < MAZE_HEIGHT - 1;
      case 'ArrowLeft':
        return !currentCell.walls.left && player.x > 0;
      default:
        return false;
    }
  }, [gameState.maze, gameState.players]);

  // AI movement logic
  const moveAI = useCallback(() => {
    const aiPlayer = gameState.players[1];
    if (!aiPlayer || gameState.gameStatus !== 'playing') return;

    const directions = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
    const validMoves = directions.filter(dir => canMove(aiPlayer.id, dir));

    if (validMoves.length > 0) {
      const randomDirection = validMoves[Math.floor(Math.random() * validMoves.length)];
      let newX = aiPlayer.x;
      let newY = aiPlayer.y;

      switch (randomDirection) {
        case 'ArrowUp':
          newY--;
          break;
        case 'ArrowRight':
          newX++;
          break;
        case 'ArrowDown':
          newY++;
          break;
        case 'ArrowLeft':
          newX--;
          break;
      }

      movePlayer(aiPlayer.id, newX, newY);
    }
  }, [gameState.players, gameState.gameStatus, canMove, movePlayer]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const player = gameState.players[0]; // Local player
    let newX = player.x;
    let newY = player.y;

    switch (e.key) {
      case 'ArrowUp':
        newY = player.y - 1;
        break;
      case 'ArrowRight':
        newX = player.x + 1;
        break;
      case 'ArrowDown':
        newY = player.y + 1;
        break;
      case 'ArrowLeft':
        newX = player.x - 1;
        break;
      default:
        return;
    }

    if (canMove(player.id, e.key)) {
      movePlayer(player.id, newX, newY);
      
      const update: MazeUpdate = {
        type: 'MOVE_PLAYER',
        playerId: player.id,
        position: { x: newX, y: newY }
      };
      socketService.sendMove(update);
    }
  }, [gameState, canMove, movePlayer]);

  useEffect(() => {
    socketService.connect();

    socketService.on('playerMove', (update: MazeUpdate) => {
      if (update.playerId !== gameState.players[0].id) {
        movePlayer(update.playerId, update.position.x, update.position.y);
      }
    });

    socketService.on('gameStateUpdate', (update: GameStateUpdate) => {
      setGameState(update.gameState);
    });

    window.addEventListener('keydown', handleKeyDown);
    
    // AI movement interval
    const aiInterval = setInterval(moveAI, AI_MOVE_INTERVAL);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      socketService.disconnect();
      clearInterval(aiInterval);
    };
  }, [handleKeyDown, gameState.players, movePlayer, moveAI]);

  return { gameState, movePlayer };
}