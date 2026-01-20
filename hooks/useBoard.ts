import { useState, useEffect, useRef, useCallback } from 'react';
import { createBoard } from '../utils/gameUtils';
import { Player, BoardShape } from '../types';

export const useBoard = (player: Player, resetPlayer: () => void) => {
  const [stage, setStage] = useState<BoardShape>(createBoard());
  const [rowsCleared, setRowsCleared] = useState(0);
  const [clearEventId, setClearEventId] = useState(0);

  // Track if we need to call resetPlayer after the state update
  const needsResetRef = useRef(false);

  // Handle resetPlayer call AFTER render cycle completes
  useEffect(() => {
    if (needsResetRef.current) {
      needsResetRef.current = false;
      resetPlayer();
    }
  });

  const sweepRows = useCallback((newStage: BoardShape): { swept: BoardShape; clearedCount: number } => {
    let clearedCount = 0;
    const swept = newStage.reduce((ack, row) => {
      // If no 0s found, row is full
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        clearedCount++;
        console.log('Row cleared! Total for this move:', clearedCount);
        // Add new empty row at top
        ack.unshift(Array.from({ length: newStage[0].length }, () => [0, 'clear', 'none']));
        return ack;
      }
      ack.push(row);
      return ack;
    }, [] as BoardShape);

    return { swept, clearedCount };
  }, []);

  useEffect(() => {
    // Only process when piece is locked (collided)
    if (!player.collided) return;

    setStage((prevStage) => {
      // Deep copy the stage
      const newStage = prevStage.map((row) =>
        row.map((cell) => [...cell])
      ) as BoardShape;

      // Draw the tetromino onto the stage
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

      // Check for completed rows
      const { swept, clearedCount } = sweepRows(newStage);

      // Schedule resetPlayer for after render
      needsResetRef.current = true;

      // IMMEDIATELY update rowsCleared and clearEventId if lines were cleared
      // This happens synchronously within the same render batch
      if (clearedCount > 0) {
        console.log('useBoard: Lines cleared!', clearedCount);
        // Use functional updates to ensure state is set correctly
        setRowsCleared(clearedCount);
        setClearEventId((prev) => prev + 1);
      }

      return swept;
    });
  }, [player.collided, player.pos.x, player.pos.y, player.tetromino.shape, player.tetromino.type, player.tetromino.color, sweepRows]);

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