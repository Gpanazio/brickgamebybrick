import { useState, useEffect, useRef } from 'react';
import { createBoard } from '../utils/gameUtils';
import { Player, BoardShape } from '../types';

export const useBoard = (player: Player, resetPlayer: () => void) => {
  const [stage, setStage] = useState<BoardShape>(createBoard());
  const [rowsCleared, setRowsCleared] = useState(0);
  const [clearEventId, setClearEventId] = useState(0);

  // Refs to track side effects from the pure update function
  const pendingResetRef = useRef(false);
  const pendingClearedRowsRef = useRef(0);

  useEffect(() => {
    // Handle side effects after render
    if (pendingResetRef.current) {
      resetPlayer();
      pendingResetRef.current = false;
    }

    if (pendingClearedRowsRef.current > 0) {
      // Create a stable local variable for the count before resetting ref
      const count = pendingClearedRowsRef.current;
      setRowsCleared(count);
      setClearEventId(prev => prev + 1);
      pendingClearedRowsRef.current = 0;
    }
  }, [stage, resetPlayer]);

  useEffect(() => {
    const sweepRows = (newStage: BoardShape) => {
      let clearedCount = 0;
      const swept = newStage.reduce((ack, row) => {
        // If no 0s found, row is full
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          clearedCount++;
          console.log('Row cleared! Total for this move:', clearedCount);
          // Add new empty row at top
          // Critical: Create NEW array instances to avoid shared reference bugs
          ack.unshift(Array.from({ length: newStage[0].length }, () => [0, 'clear', 'none']));
          return ack;
        }
        ack.push(row);
        return ack;
      }, [] as BoardShape);

      return { swept, clearedCount };
    };

    const updateStage = (prevStage: BoardShape) => {
      // First, flush any old pending state (though strictly shouldn't be needed)
      // Deep copy the stage
      const newStage = prevStage.map((row) =>
        row.map((cell) => [...cell])
      ) as BoardShape;

      // Draw the tetromino
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const targetY = y + player.pos.y;
            const targetX = x + player.pos.x;
            if (newStage[targetY] && newStage[targetY][targetX]) {
              newStage[targetY][targetX] = [
                player.tetromino.type,
                'merged',
                player.tetromino.color
              ];
            }
          }
        });
      });

      // Check collision implies we just placed a piece
      if (player.collided) {
        pendingResetRef.current = true;
        const { swept, clearedCount } = sweepRows(newStage);
        pendingClearedRowsRef.current = clearedCount;
        return swept;
      }

      return prevStage;
    };

    // Only update stage if collided (piece locked)
    if (player.collided) {
      setStage((prev) => updateStage(prev));
    }
  }, [player.collided, player.pos.x, player.pos.y, player.tetromino.shape, player.tetromino.type, player.tetromino.color]);

  // Render the moving piece on top of the stage
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

  return { board, setBoard: setStage, rowsCleared, clearEventId };
};