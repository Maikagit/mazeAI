import React from 'react';
import { Cell, Player } from '../types/maze';

interface MazeRendererProps {
  maze: Cell[][];
  players: Player[];
  cellSize: number;
}

export const MazeRenderer: React.FC<MazeRendererProps> = ({ maze, players, cellSize }) => {
  const width = maze[0].length * cellSize;
  const height = maze.length * cellSize;

  return (
    <div className="relative overflow-hidden bg-gray-900 rounded-lg shadow-xl">
      <svg width={width} height={height}>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <rect width={cellSize} height={cellSize} fill="#1a1a1a" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Exit marker */}
        {maze.map((row, y) =>
          row.map((cell, x) => (
            cell.isExit && (
              <g key={`exit-${x}-${y}`}>
                <rect
                  x={x * cellSize}
                  y={y * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#FFD700"
                  opacity={0.3}
                />
                <path
                  d={`M${x * cellSize + cellSize/4},${y * cellSize + cellSize/2} L${x * cellSize + cellSize*3/4},${y * cellSize + cellSize/2}`}
                  stroke="#FFD700"
                  strokeWidth="3"
                />
                <path
                  d={`M${x * cellSize + cellSize/2},${y * cellSize + cellSize/4} L${x * cellSize + cellSize/2},${y * cellSize + cellSize*3/4}`}
                  stroke="#FFD700"
                  strokeWidth="3"
                />
              </g>
            )
          ))
        )}

        {/* Maze walls */}
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <g key={`${x}-${y}`} transform={`translate(${x * cellSize},${y * cellSize})`}>
              {cell.walls.top && (
                <line
                  x1="0"
                  y1="0"
                  x2={cellSize}
                  y2="0"
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
              {cell.walls.right && (
                <line
                  x1={cellSize}
                  y1="0"
                  x2={cellSize}
                  y2={cellSize}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
              {cell.walls.bottom && (
                <line
                  x1="0"
                  y1={cellSize}
                  x2={cellSize}
                  y2={cellSize}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
              {cell.walls.left && (
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={cellSize}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
            </g>
          ))
        )}
        
        {/* Players */}
        {players.map((player) => (
          <g key={player.id}>
            <circle
              cx={player.x * cellSize + cellSize / 2}
              cy={player.y * cellSize + cellSize / 2}
              r={cellSize / 3}
              fill={player.color}
              className="transition-all duration-200 ease-in-out"
            />
            <circle
              cx={player.x * cellSize + cellSize / 2}
              cy={player.y * cellSize + cellSize / 2}
              r={cellSize / 2}
              fill={player.color}
              opacity={0.2}
              className="transition-all duration-200 ease-in-out"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};