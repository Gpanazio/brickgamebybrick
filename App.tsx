import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createBoard, checkCollision } from './utils/gameUtils';
import { usePlayer } from './hooks/usePlayer';
import { useBoard } from './hooks/useBoard';
import { useGameStatus } from './hooks/useGameStatus';
import { useInterval } from './hooks/useInterval';
import { Cell } from './components/Cell';
import { Display } from './components/Display';
import { Monolith } from './components/Monolith';
import { Power, RotateCw, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [scoreFlash, setScoreFlash] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const prevScoreRef = useRef(0);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { board, setBoard, rowsCleared, clearEventId } = useBoard(player, resetPlayer);
  const { score, rows, level, setScore, setRows, setLevel, resetStatus, addPoints } = useGameStatus(rowsCleared, clearEventId);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    setBoard(createBoard());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    resetStatus(); // Reset score, rows, level
    prevScoreRef.current = 0;
    setGameStarted(true);
    gameAreaRef.current?.focus();
  };

  const drop = useCallback(() => {
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
      setDropTime(Math.max(100, 1000 - (level * 100)));
    }

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  }, [player, board, level, rows, updatePlayerPos, setGameOver, setLevel]);

  const dropPlayer = useCallback(() => {
    setDropTime(null);
    // Soft Drop: 1 point per cell moved down
    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      addPoints(1);
    }
    drop();
  }, [drop, player, board, addPoints]);

  const hardDrop = useCallback(() => {
    let tmpY = 0;
    while (!checkCollision(player, board, { x: 0, y: tmpY + 1 })) {
      tmpY += 1;
    }
    // Hard Drop: 2 points per cell moved down
    addPoints(tmpY * 2);
    updatePlayerPos({ x: 0, y: tmpY, collided: true });
  }, [player, board, updatePlayerPos, addPoints]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      const { key } = e;
      if (key === 'ArrowLeft') movePlayer(-1);
      else if (key === 'ArrowRight') movePlayer(1);
      else if (key === 'ArrowDown') { e.preventDefault(); dropPlayer(); }
      else if (key === 'ArrowUp' || key === 'r' || key === 'R') { e.preventDefault(); playerRotate(board, 1); }
      else if (key === ' ') { e.preventDefault(); hardDrop(); }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      if (e.key === 'ArrowDown') setDropTime(Math.max(100, 1000 - (level * 100)));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, board, player, level, dropPlayer, hardDrop, playerRotate]);

  useInterval(() => {
    drop();
  }, dropTime);

  // Score flash effect when score increases significantly
  useEffect(() => {
    const scoreDiff = score - prevScoreRef.current;
    if (scoreDiff >= 100) {
      setScoreFlash(true);
      const timer = setTimeout(() => setScoreFlash(false), 500);
      return () => clearTimeout(timer);
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black font-sans text-white select-none outline-none"
      tabIndex={0}
      ref={gameAreaRef}
    >
      <Monolith />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-0 md:p-4">

        {/* Mobile HUD - Visible only on mobile */}
        <div className="md:hidden w-[300px] z-20">
          <div className="flex justify-between items-end border-l-2 border-[#FF0000] pl-3">
            <h1 className="text-xl font-black tracking-tighter leading-none text-white">BRICK<br /><span className="text-[#FF0000]">GAME</span></h1>
            <div className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest text-right">
              Liq.Glass<br />v4.5
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/80 border border-white/10 p-2 rounded-sm backdrop-blur-md">
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Score</span>
              <span className={`block font-brick text-lg leading-none ${scoreFlash ? 'text-red-500' : 'text-white'}`}>{score}</span>
            </div>
            <div className="bg-black/80 border border-white/10 p-2 rounded-sm backdrop-blur-md">
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Lines</span>
              <span className="block font-brick text-lg leading-none text-white">{rows}</span>
            </div>
            <div className="bg-black/80 border border-white/10 p-2 rounded-sm backdrop-blur-md">
              <span className="block font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Tier</span>
              <span className="block font-brick text-lg leading-none text-white">{level}</span>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row gap-0 md:gap-6 items-stretch w-full max-w-4xl justify-center">

          {/* Left Panel - Score & Status - Hidden on Mobile */}
          <div className="hidden md:flex flex-col w-56 justify-between">
            <div>
              <div className="mb-8 border-l-2 border-[#FF0000] pl-4">
                <h1 className="text-3xl font-black tracking-tighter leading-none mb-1">BRICK<br />GAME</h1>
                <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">Protocol: Liquidglass v4.5</p>
              </div>

              <div className="bg-black/80 border border-white/10 p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-sm">
                <Display label="Score" text={score.toLocaleString()} alert={score > 0} />
                <Display label="Lines" text={rows} />
                <Display label="Tier" text={level} />
              </div>
            </div>

            <div className="bg-black/60 border border-white/5 p-4 rounded-sm mt-4">
              <p className="font-mono text-[9px] text-neutral-600 mb-2 tracking-widest uppercase">System Log:</p>
              <div className="font-mono text-[10px] text-[#FF0000]/70 leading-relaxed uppercase whitespace-pre-line">
                {gameOver ? '> CRITICAL: SYSTEM_FAILURE\n> PROTOCOL_TERMINATED\n> LOG_ENTRY: ' + score : gameStarted ? '> STATUS: ACTIVE\n> CORE_SYNC: NOMINAL\n> RENDER_TARGET: LIQUID' : '> STATUS: STANDBY\n> WAITING_FOR_CORE...'}
              </div>
            </div>
          </div>

          {/* Center - Game Board */}
          <div className="relative group flex-shrink-0 z-10">
            <div className={`
                relative p-[2px] bg-black border transition-all duration-500 overflow-hidden rounded-sm
                ${gameOver ? 'border-[#FF0000] shadow-[0_0_80px_rgba(255,0,0,0.6)]' : 'border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]'}
                ${scoreFlash ? 'animate-score-flash' : ''}
             `}>

              {(!gameStarted || gameOver) && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-xl p-4 text-center">
                  {gameOver && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-black text-[#FF0000] tracking-[0.15em] mb-3 uppercase animate-glitch">Terminated</h2>
                      <div className="w-3/4 mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mb-3 animate-flicker"></div>
                      <p className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.2em]">Final Sequence</p>
                    </div>
                  )}
                  <button
                    onClick={startGame}
                    className="
                      group relative px-10 py-5 bg-transparent border border-neutral-800 
                      hover:border-[#FF0000] hover:bg-[#FF0000]/5 transition-all duration-500
                    "
                  >
                    <div className="flex items-center gap-4">
                      <Power size={18} className="text-[#FF0000] group-hover:rotate-180 transition-transform duration-700" />
                      <span className="font-mono font-bold tracking-[0.4em] text-sm text-neutral-300 group-hover:text-white">
                        {gameOver ? 'REINITIALIZE' : 'INIT_CORE'}
                      </span>
                    </div>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-600 group-hover:border-[#FF0000]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-600 group-hover:border-[#FF0000]"></div>
                  </button>
                </div>
              )}

              <div className="grid grid-rows-[repeat(20,minmax(0,1fr))] grid-cols-[repeat(10,minmax(0,1fr))] gap-[1px] bg-[#000000] w-[300px] h-[600px] relative z-10">
                {board.map((row, y) =>
                  row.map((cell, x) => (
                    <Cell key={`${x}-${y}`} type={cell[0]} color={cell[2]} />
                  ))
                )}
              </div>

              <div className="absolute inset-0 pointer-events-none bg-scanline-overlay opacity-20 z-20"></div>
            </div>
          </div>

          {/* Right Panel - Controls - Hidden on Mobile */}
          <div className="hidden md:flex flex-col w-56 justify-start">
            <h3 className="font-mono text-[10px] text-neutral-600 mb-4 uppercase tracking-[0.3em] border-b border-neutral-900 pb-3">Input Mapping</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-4 border border-white/5 bg-black/40 backdrop-blur-sm group hover:border-red-500/50 hover:bg-black/80 transition-all duration-300 rounded-sm">
                <RotateCw size={16} className="text-neutral-500 mb-2 group-hover:text-[#FF0000] transition-colors" />
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">Rotate</span>
              </div>
              <div className="flex flex-col items-center p-4 border border-white/5 bg-black/40 backdrop-blur-sm group hover:border-red-500/50 hover:bg-black/80 transition-all duration-300 rounded-sm">
                <ArrowDown size={16} className="text-neutral-500 mb-2 group-hover:text-[#FF0000] transition-colors" />
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">Nudge</span>
              </div>
              <div className="flex flex-col items-center p-4 border border-white/5 bg-black/40 backdrop-blur-sm group hover:border-red-500/50 hover:bg-black/80 transition-all duration-300 rounded-sm">
                <ArrowLeft size={16} className="text-neutral-500 mb-2 group-hover:text-[#FF0000] transition-colors" />
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">Port</span>
              </div>
              <div className="flex flex-col items-center p-4 border border-white/5 bg-black/40 backdrop-blur-sm group hover:border-red-500/50 hover:bg-black/80 transition-all duration-300 rounded-sm">
                <ArrowRight size={16} className="text-neutral-500 mb-2 group-hover:text-[#FF0000] transition-colors" />
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">Starb.</span>
              </div>
              <div className="col-span-2 flex flex-col items-center p-4 border border-white/5 bg-black/40 backdrop-blur-sm group hover:border-red-500/50 hover:bg-black/80 transition-all duration-300 rounded-sm">
                <div className="w-12 h-3 border border-neutral-800 mb-2 group-hover:border-[#FF0000]/50 transition-colors"></div>
                <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest group-hover:text-white transition-colors">Quantum Drop</span>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="border-t border-neutral-900 pt-4">
                <p className="font-mono text-[9px] text-neutral-700 uppercase tracking-widest text-center">v4.5 // Liquidglass</p>
              </div>
            </div>
          </div>

          {/* Mobile Controls Layer - Industrial Design */}
          <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 flex justify-between items-end z-50 pointer-events-none select-none">

            {/* D-Pad Container */}
            <div className="pointer-events-auto grid grid-cols-3 grid-rows-2 gap-2 w-[160px]">
              {/* Left */}
              <button
                onClick={() => movePlayer(-1)}
                className="col-start-1 row-start-2 w-14 h-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm flex items-center justify-center active:bg-red-900/40 active:border-red-500 active:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <ArrowLeft size={24} className="text-neutral-400" />
              </button>

              {/* Down */}
              <button
                onClick={() => dropPlayer()}
                className="col-start-2 row-start-2 w-14 h-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm flex items-center justify-center active:bg-red-900/40 active:border-red-500 active:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <ArrowDown size={24} className="text-neutral-400" />
              </button>

              {/* Right */}
              <button
                onClick={() => movePlayer(1)}
                className="col-start-3 row-start-2 w-14 h-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm flex items-center justify-center active:bg-red-900/40 active:border-red-500 active:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                <ArrowRight size={24} className="text-neutral-400" />
              </button>
            </div>

            {/* Action Button Container */}
            <div className="pointer-events-auto flex flex-col gap-4 items-end">
              {/* Hard Drop / Space */}
              <button
                onClick={() => hardDrop()}
                className="w-16 h-16 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm flex flex-col items-center justify-center active:bg-red-900/40 active:border-red-500 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
              >
                <div className="w-8 h-1 bg-neutral-600 group-active:bg-red-500 mb-1"></div>
                <span className="font-mono text-[8px] text-neutral-500 uppercase">DROP</span>
              </button>

              {/* Rotate */}
              <button
                onClick={() => playerRotate(board, 1)}
                className="w-20 h-20 bg-black/80 backdrop-blur-xl border border-white/20 rounded-sm flex flex-col items-center justify-center active:bg-red-900/40 active:border-red-500 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] group"
              >
                <RotateCw size={32} className="text-neutral-300 group-active:text-white mb-1" />
                <span className="font-mono text-[9px] text-neutral-500 uppercase group-active:text-red-400">ROT</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;