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

const SCORE_FLASH_THRESHOLD = 100;
const SCORE_FLASH_DURATION_MS = 900;

const App: React.FC = () => {
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [scoreFlash, setScoreFlash] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const scoreFlashTimeoutRef = useRef<number | null>(null);
  const previousScoreRef = useRef(0);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { board, setBoard, rowsCleared } = useBoard(player, resetPlayer);
  const { score, rows, level, setScore, setRows, setLevel } = useGameStatus(rowsCleared);

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
    setScore(0);
    setRows(0);
    setLevel(0);
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
    drop();
  }, [drop]);

  const hardDrop = useCallback(() => {
    let tmpY = 0;
    while (!checkCollision(player, board, { x: 0, y: tmpY + 1 })) {
      tmpY += 1;
    }
    updatePlayerPos({ x: 0, y: tmpY, collided: true });
  }, [player, board, updatePlayerPos]);

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

  useEffect(() => {
    const delta = score - previousScoreRef.current;
    if (delta > SCORE_FLASH_THRESHOLD && !gameOver) {
      setScoreFlash(true);
      if (scoreFlashTimeoutRef.current) {
        window.clearTimeout(scoreFlashTimeoutRef.current);
      }
      scoreFlashTimeoutRef.current = window.setTimeout(() => {
        setScoreFlash(false);
      }, SCORE_FLASH_DURATION_MS);
    }
    previousScoreRef.current = score;
  }, [score, gameOver]);

  useEffect(() => {
    return () => {
      if (scoreFlashTimeoutRef.current) {
        window.clearTimeout(scoreFlashTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-void font-sans text-white select-none outline-none"
      tabIndex={0}
      ref={gameAreaRef}
    >
      <Monolith />

      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="relative flex flex-col md:flex-row gap-8 items-start w-full max-w-5xl justify-center">
          
          <div className="hidden md:flex flex-col w-64 pt-8">
             <div className="mb-12 border-l-2 border-[#FF0000] pl-4">
               <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">BRICK<br/>SYSTEM</h1>
               <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Protocol: Liquidglass v4.5</p>
             </div>

             <div className="bg-void/90 border border-neutral-800 p-6 shadow-2xl backdrop-blur-md">
               <Display label="Score" text={score.toLocaleString()} alert={score > 0} />
               <Display label="Lines" text={rows} />
               <Display label="Tier" text={level} />
               
               <div className="mt-8 pt-8 border-t border-neutral-800">
                  <p className="font-mono text-[9px] text-neutral-600 mb-2 tracking-widest uppercase">System Log:</p>
                  <div className="font-mono text-[11px] text-[#FF0000]/70 h-24 overflow-hidden leading-relaxed uppercase">
                    {gameOver ? '> CRITICAL: SYSTEM_FAILURE\n> PROTOCOL_TERMINATED\n> LOG_ENTRY: ' + score : gameStarted ? '> STATUS: ACTIVE\n> CORE_SYNC: NOMINAL\n> RENDER_TARGET: LIQUID' : '> STATUS: STANDBY\n> WAITING_FOR_CORE...'}
                  </div>
               </div>
             </div>
          </div>

          <div className="relative group">
             {/* The Board Container */}
             <div className={`
                relative p-[2px] bg-neutral-900 border-2 transition-all duration-1000 overflow-hidden rounded-sm
                ${gameOver ? 'border-[#FF0000] shadow-[0_0_80px_rgba(255,0,0,0.5)]' : 'border-neutral-800 shadow-2xl'}
                ${scoreFlash && !gameOver ? 'score-flash' : ''}
             `}>
               
               {(!gameStarted || gameOver) && (
                 <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-xl p-6 text-center overflow-hidden">
                   {gameOver && (
                     <div className="mb-10 animate-flicker">
                        <h2 className="text-4xl font-black text-[#FF0000] tracking-[0.2em] mb-4 uppercase glitch animate-flicker" data-text="Terminated">Terminated</h2>
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF0000] to-transparent mb-4"></div>
                        <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.3em]">Final Sequence Complete</p>
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
                     {/* Button corner accents */}
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

          <div className="flex flex-col w-64 pt-8 md:pl-8">
            <div className="hidden md:block">
              <h3 className="font-mono text-[10px] text-neutral-600 mb-6 uppercase tracking-[0.3em] border-b border-neutral-900 pb-3">Input Mapping</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 border border-neutral-900 bg-void/50 group hover:border-neutral-700 transition-colors">
                   <RotateCw size={16} className="text-neutral-600 mb-3 group-hover:text-[#FF0000] transition-colors"/>
                   <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Rotate</span>
                </div>
                <div className="flex flex-col items-center p-4 border border-neutral-900 bg-void/50 group hover:border-neutral-700 transition-colors">
                   <ArrowDown size={16} className="text-neutral-600 mb-3 group-hover:text-[#FF0000] transition-colors"/>
                   <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Nudge</span>
                </div>
                 <div className="flex flex-col items-center p-4 border border-neutral-900 bg-void/50 group hover:border-neutral-700 transition-colors">
                   <ArrowLeft size={16} className="text-neutral-600 mb-3 group-hover:text-[#FF0000] transition-colors"/>
                   <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Port</span>
                </div>
                 <div className="flex flex-col items-center p-4 border border-neutral-900 bg-void/50 group hover:border-neutral-700 transition-colors">
                   <ArrowRight size={16} className="text-neutral-600 mb-3 group-hover:text-[#FF0000] transition-colors"/>
                   <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Starb.</span>
                </div>
                 <div className="col-span-2 flex flex-col items-center p-4 border border-neutral-900 bg-void/50 group hover:border-neutral-700 transition-colors">
                   <div className="w-12 h-3 border border-neutral-800 mb-3 group-hover:border-[#FF0000]/50 transition-colors"></div>
                   <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">Quantum Drop</span>
                </div>
              </div>
            </div>
            
            {/* Mobile Controls Layer */}
            <div className="md:hidden fixed bottom-8 left-8 right-8 flex justify-between z-50 pointer-events-none">
                <div className="flex gap-3 pointer-events-auto">
                  <button onClick={() => movePlayer(-1)} className="p-5 bg-[#0a0a0a]/95 rounded-full border border-neutral-800 active:bg-[#FF0000]/20 active:border-[#FF0000] transition-all"><ArrowLeft size={22}/></button>
                  <button onClick={() => movePlayer(1)} className="p-5 bg-[#0a0a0a]/95 rounded-full border border-neutral-800 active:bg-[#FF0000]/20 active:border-[#FF0000] transition-all"><ArrowRight size={22}/></button>
                </div>
                <div className="flex gap-3 pointer-events-auto">
                  <button onClick={() => dropPlayer()} className="p-5 bg-[#0a0a0a]/95 rounded-full border border-neutral-800 active:bg-[#FF0000]/20 active:border-[#FF0000] transition-all"><ArrowDown size={22}/></button>
                  <button onClick={() => playerRotate(board, 1)} className="p-5 bg-[#0a0a0a]/95 rounded-full border border-neutral-800 active:bg-[#FF0000]/20 active:border-[#FF0000] transition-all"><RotateCw size={22}/></button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
