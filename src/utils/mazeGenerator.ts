import { Cell } from '../types/maze';

export function generateMaze(width: number, height: number): Cell[][] {
  // Initialize the grid
  const grid: Cell[][] = Array(height)
    .fill(null)
    .map((_, y) =>
      Array(width)
        .fill(null)
        .map((_, x) => ({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
          isExit: false,
        }))
    );

  // Helper to get valid neighbors
  const getNeighbors = (cell: Cell): Cell[] => {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    if (y > 0) neighbors.push(grid[y - 1][x]); // top
    if (x < width - 1) neighbors.push(grid[y][x + 1]); // right
    if (y < height - 1) neighbors.push(grid[y + 1][x]); // bottom
    if (x > 0) neighbors.push(grid[y][x - 1]); // left

    return neighbors.filter(n => !n.visited);
  };

  // Remove walls between two cells
  const removeWalls = (current: Cell, next: Cell) => {
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx === 1) {
      current.walls.right = false;
      next.walls.left = false;
    } else if (dx === -1) {
      current.walls.left = false;
      next.walls.right = false;
    }

    if (dy === 1) {
      current.walls.bottom = false;
      next.walls.top = false;
    } else if (dy === -1) {
      current.walls.top = false;
      next.walls.bottom = false;
    }
  };

  // Recursive backtracker algorithm
  const stack: Cell[] = [];
  let current = grid[0][0];
  current.visited = true;

  while (true) {
    const neighbors = getNeighbors(current);
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push(current);
      removeWalls(current, next);
      next.visited = true;
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop()!;
    } else {
      break;
    }
  }

  // Set exit at the bottom right
  grid[height - 1][width - 1].isExit = true;

  return grid;
}