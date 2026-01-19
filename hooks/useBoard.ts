import { useState, useEffect } from 'react';
import { createBoard } from '../utils/gameUtils';
import { Player, BoardShape } from '../types';

export const useBoard = (player: Player, resetPlayer: () => void) => {
  const [stage, setStage] = useState<BoardShape>(createBoard());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage: BoardShape) => {
      return newStage.reduce((ack, row) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          ack.unshift(new Array(newStage[0].length).fill([0, 'clear', 'none']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as BoardShape);
    };

    const updateStage = (prevStage: BoardShape) => {
      const newStage = prevStage.map((row) =>
        row.map((cell) => [...cell])
      ) as BoardShape;

      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              player.tetromino.type,
              'merged',
              player.tetromino.color
            ];
          }
        });
      });

      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return prevStage;
    };

    if (player.collided) {
      setStage((prev) => updateStage(prev));
    }
  }, [player.collided, player.pos.x, player.pos.y, player.tetromino.shape, player.tetromino.type, player.tetromino.color, resetPlayer]);

  const board = stage.map(row => row.map(cell => [...cell])) as BoardShape;
  
  if (!player.collided) {
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const targetY = y + player.pos.y;
            const targetX = x + player.pos.x;
            if (board[targetY] && board[targetY][targetX]) {
                board[targetY][targetX] = [
                  player.tetromino.type,
                  'clear',
                  player.tetromino.color
                ];
            }
          }
        });
      });
  }

  return { board, setBoard: setStage, rowsCleared };
};