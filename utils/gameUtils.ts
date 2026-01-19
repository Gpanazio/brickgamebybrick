import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants';
import { BoardShape, Player } from '../types';

export const createBoard = (): BoardShape =>
  Array.from(Array(BOARD_HEIGHT), () =>
    Array.from(Array(BOARD_WIDTH), () => [0, 'clear', 'none'])
  );

export const checkCollision = (
  player: Player,
  board: BoardShape,
  { x: moveX, y: moveY }: { x: number; y: number }
) => {
  for (let y = 0; y < player.tetromino.shape.length; y += 1) {
    for (let x = 0; x < player.tetromino.shape[y].length; x += 1) {
      if (player.tetromino.shape[y][x] !== 0) {
        if (
          !board[y + player.pos.y + moveY] ||
          !board[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          board[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};