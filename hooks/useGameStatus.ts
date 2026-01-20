import { useState, useEffect, useCallback, useRef } from 'react';

export const useGameStatus = (rowsCleared: number, clearEventId: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  // Ref to track the last processed clearEventId to avoid double-processing
  const lastProcessedEventRef = useRef(0);
  // Ref for stable level access in calculations
  const levelRef = useRef(0);
  levelRef.current = level;

  // Original Nintendo Scoring System
  const linePoints = [40, 100, 300, 1200];

  // Manual point addition for drops (Soft Drop / Hard Drop)
  // This fires immediately and doesn't depend on the line-clear chain
  const addPoints = useCallback((points: number) => {
    if (points > 0) {
      setScore((prev) => prev + points);
    }
  }, []);

  useEffect(() => {
    // Check for new clear events that haven't been processed yet
    if (clearEventId > lastProcessedEventRef.current && rowsCleared > 0) {
      lastProcessedEventRef.current = clearEventId;

      const currentLevel = levelRef.current;
      console.log('useGameStatus: Event received', { clearEventId, rowsCleared, level: currentLevel });

      // Calculate points based on lines cleared (capped at 4 for safety)
      const linesIndex = Math.min(rowsCleared - 1, 3);
      const pointsEarned = linePoints[linesIndex] * (currentLevel + 1);

      console.log('Adding line-clear score:', pointsEarned);
      setScore((prev) => prev + pointsEarned);

      setRows((prev) => {
        const newRows = prev + rowsCleared;
        // Level up every 10 lines
        const newLevel = Math.floor(newRows / 10);
        if (newLevel > currentLevel) {
          setLevel(newLevel);
        }
        return newRows;
      });
    }
  }, [clearEventId, rowsCleared]);

  const resetStatus = useCallback(() => {
    setScore(0);
    setRows(0);
    setLevel(0);
    lastProcessedEventRef.current = 0;
  }, []);

  return { score, setScore, rows, setRows, level, setLevel, resetStatus, addPoints };
};