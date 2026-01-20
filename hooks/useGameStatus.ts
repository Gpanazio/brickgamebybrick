import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (rowsCleared: number, clearEventId: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  // Original Nintendo Scoring System
  const linePoints = [40, 100, 300, 1200];

  useEffect(() => {
    // Only update if we have a valid clear event (clearEventId > 0)
    // We trust that if clearEventId incremented, rowsCleared is correct (even if 0, though logic prevents that in useBoard)
    if (clearEventId > 0) {
      console.log('useGameStatus: Event received', { clearEventId, rowsCleared, level });
      if (rowsCleared > 0) {
        // Calculate points based on lines cleared (capped at 4 for safety)
        const linesIndex = Math.min(rowsCleared - 1, 3);
        const pointsEarned = linePoints[linesIndex] * (level + 1);

        console.log('Adding score:', pointsEarned);
        setScore((prev) => prev + pointsEarned);
        setRows((prev) => {
          const newRows = prev + rowsCleared;
          // Level up every 10 lines
          const newLevel = Math.floor(newRows / 10);
          if (newLevel > level) {
            setLevel(newLevel);
          }
          return newRows;
        });
      }
    }
  }, [clearEventId, rowsCleared, level]); // Added rowsCleared to dependency just in case

  const resetStatus = useCallback(() => {
    setScore(0);
    setRows(0);
    setLevel(0);
  }, []);

  return { score, setScore, rows, setRows, level, setLevel, resetStatus };
};