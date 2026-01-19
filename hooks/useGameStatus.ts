import { useState, useEffect, useCallback } from 'react';

export const useGameStatus = (rowsCleared: number) => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const calcScore = useCallback(() => {
    // Original Nintendo Scoring System
    const linePoints = [40, 100, 300, 1200];

    if (rowsCleared > 0) {
      setScore((prev) => prev + linePoints[rowsCleared - 1] * (level + 1));
      setRows((prev) => prev + rowsCleared);
      
      // Calculate level based on total lines cleared
      const newLevel = Math.floor((rows + rowsCleared) / 10);
      if (newLevel > level) {
        setLevel(newLevel);
      }
    }
  }, [rowsCleared, level, rows]);

  useEffect(() => {
    if (rowsCleared > 0) {
      calcScore();
    }
  }, [rowsCleared]); // Only run when rowsCleared changes

  return { score, setScore, rows, setRows, level, setLevel };
};