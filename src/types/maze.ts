export interface Cell {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isExit?: boolean;
}

export interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface GameState {
  maze: Cell[][];
  players: Player[];
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: string | null;
}

export interface MazeUpdate {
  type: 'MOVE_PLAYER';
  playerId: string;
  position: { x: number; y: number };
}

export interface GameStateUpdate {
  type: 'STATE_UPDATE';
  gameState: GameState;
}