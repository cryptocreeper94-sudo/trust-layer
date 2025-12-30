import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Play, Trophy, Pause, ArrowDown, RotateCw } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 24;

type Board = (string | null)[][];

interface Piece {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

const PIECES = {
  I: { shape: [[1, 1, 1, 1]], color: "#06b6d4" },
  O: { shape: [[1, 1], [1, 1]], color: "#eab308" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "#a855f7" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "#22c55e" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "#ef4444" },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: "#3b82f6" },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: "#f97316" },
};

const PIECE_NAMES = Object.keys(PIECES) as (keyof typeof PIECES)[];

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

function getRandomPiece(): Piece {
  const name = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
  const piece = PIECES[name];
  return {
    shape: piece.shape.map(row => [...row]),
    color: piece.color,
    x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2),
    y: 0,
  };
}

function rotatePiece(piece: Piece): Piece {
  const rows = piece.shape.length;
  const cols = piece.shape[0].length;
  const rotated: number[][] = [];
  
  for (let c = 0; c < cols; c++) {
    rotated.push([]);
    for (let r = rows - 1; r >= 0; r--) {
      rotated[c].push(piece.shape[r][c]);
    }
  }
  
  return { ...piece, shape: rotated };
}

function isValidPosition(board: Board, piece: Piece): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (boardY >= 0 && board[boardY][boardX]) {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
}

function clearLines(board: Board): { board: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { board: newBoard, linesCleared };
}

function calculateScore(lines: number, level: number): number {
  const baseScores = [0, 100, 300, 500, 800];
  return baseScores[lines] * (level + 1);
}

interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: Piece;
  score: number;
  level: number;
  lines: number;
  status: "menu" | "playing" | "paused" | "gameover";
  highScore: number;
}

export default function Tetris() {
  const [, navigate] = useLocation();
  const gameLoopRef = useRef<number | null>(null);
  const lastDropRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: getRandomPiece(),
    score: 0,
    level: 0,
    lines: 0,
    status: "menu",
    highScore: parseInt(localStorage.getItem("tetris_highscore") || "0"),
  }));

  const startGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: getRandomPiece(),
      nextPiece: getRandomPiece(),
      score: 0,
      level: 0,
      lines: 0,
      status: "playing",
      highScore: parseInt(localStorage.getItem("tetris_highscore") || "0"),
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(s => ({
      ...s,
      status: s.status === "playing" ? "paused" : "playing",
    }));
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== "playing") {
        if (e.key === "Enter" && gameState.status === "menu") {
          startGame();
        }
        return;
      }
      
      keysRef.current.add(e.key);
      
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      setGameState(prev => {
        if (!prev.currentPiece || prev.status !== "playing") return prev;
        
        let newPiece = { ...prev.currentPiece };
        
        if (e.key === "ArrowLeft") {
          newPiece = { ...newPiece, x: newPiece.x - 1 };
          if (!isValidPosition(prev.board, newPiece)) return prev;
        } else if (e.key === "ArrowRight") {
          newPiece = { ...newPiece, x: newPiece.x + 1 };
          if (!isValidPosition(prev.board, newPiece)) return prev;
        } else if (e.key === "ArrowUp" || e.key === "x") {
          newPiece = rotatePiece(newPiece);
          if (!isValidPosition(prev.board, newPiece)) {
            // Wall kick attempts
            const kicks = [1, -1, 2, -2];
            let valid = false;
            for (const kick of kicks) {
              const kicked = { ...newPiece, x: newPiece.x + kick };
              if (isValidPosition(prev.board, kicked)) {
                newPiece = kicked;
                valid = true;
                break;
              }
            }
            if (!valid) return prev;
          }
        } else if (e.key === " ") {
          // Hard drop
          while (isValidPosition(prev.board, { ...newPiece, y: newPiece.y + 1 })) {
            newPiece = { ...newPiece, y: newPiece.y + 1 };
          }
          // Place immediately
          const newBoard = placePiece(prev.board, newPiece);
          const { board: clearedBoard, linesCleared } = clearLines(newBoard);
          const newLines = prev.lines + linesCleared;
          const newLevel = Math.floor(newLines / 10);
          const newScore = prev.score + calculateScore(linesCleared, prev.level);
          
          const nextPiece = prev.nextPiece;
          if (!isValidPosition(clearedBoard, { ...nextPiece, x: Math.floor((BOARD_WIDTH - nextPiece.shape[0].length) / 2), y: 0 })) {
            // Game over
            if (newScore > prev.highScore) {
              localStorage.setItem("tetris_highscore", newScore.toString());
            }
            return { ...prev, board: clearedBoard, score: newScore, status: "gameover", highScore: Math.max(newScore, prev.highScore) };
          }
          
          return {
            ...prev,
            board: clearedBoard,
            currentPiece: { ...nextPiece, x: Math.floor((BOARD_WIDTH - nextPiece.shape[0].length) / 2), y: 0 },
            nextPiece: getRandomPiece(),
            score: newScore,
            lines: newLines,
            level: newLevel,
          };
        } else if (e.key === "Escape") {
          return { ...prev, status: "paused" };
        } else {
          return prev;
        }
        
        return { ...prev, currentPiece: newPiece };
      });
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState.status, startGame]);

  // Game loop
  useEffect(() => {
    if (gameState.status !== "playing") {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }
    
    const dropInterval = Math.max(100, 1000 - gameState.level * 100);
    
    const gameLoop = (timestamp: number) => {
      const softDrop = keysRef.current.has("ArrowDown");
      const interval = softDrop ? 50 : dropInterval;
      
      if (timestamp - lastDropRef.current > interval) {
        lastDropRef.current = timestamp;
        
        setGameState(prev => {
          if (!prev.currentPiece || prev.status !== "playing") return prev;
          
          const movedPiece = { ...prev.currentPiece, y: prev.currentPiece.y + 1 };
          
          if (isValidPosition(prev.board, movedPiece)) {
            return { ...prev, currentPiece: movedPiece };
          }
          
          // Can't move down, place the piece
          const newBoard = placePiece(prev.board, prev.currentPiece);
          const { board: clearedBoard, linesCleared } = clearLines(newBoard);
          const newLines = prev.lines + linesCleared;
          const newLevel = Math.floor(newLines / 10);
          const newScore = prev.score + calculateScore(linesCleared, prev.level);
          
          const nextPiece = prev.nextPiece;
          const spawnedPiece = { ...nextPiece, x: Math.floor((BOARD_WIDTH - nextPiece.shape[0].length) / 2), y: 0 };
          
          if (!isValidPosition(clearedBoard, spawnedPiece)) {
            if (newScore > prev.highScore) {
              localStorage.setItem("tetris_highscore", newScore.toString());
            }
            return { ...prev, board: clearedBoard, currentPiece: null, score: newScore, status: "gameover", highScore: Math.max(newScore, prev.highScore) };
          }
          
          return {
            ...prev,
            board: clearedBoard,
            currentPiece: spawnedPiece,
            nextPiece: getRandomPiece(),
            score: newScore,
            lines: newLines,
            level: newLevel,
          };
        });
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState.status, gameState.level]);

  // Touch controls
  const handleTouchControl = (action: string) => {
    if (gameState.status !== "playing" || !gameState.currentPiece) return;
    
    setGameState(prev => {
      if (!prev.currentPiece) return prev;
      
      let newPiece = { ...prev.currentPiece };
      
      if (action === "left") {
        newPiece = { ...newPiece, x: newPiece.x - 1 };
        if (!isValidPosition(prev.board, newPiece)) return prev;
      } else if (action === "right") {
        newPiece = { ...newPiece, x: newPiece.x + 1 };
        if (!isValidPosition(prev.board, newPiece)) return prev;
      } else if (action === "rotate") {
        newPiece = rotatePiece(newPiece);
        if (!isValidPosition(prev.board, newPiece)) {
          const kicks = [1, -1, 2, -2];
          let valid = false;
          for (const kick of kicks) {
            const kicked = { ...newPiece, x: newPiece.x + kick };
            if (isValidPosition(prev.board, kicked)) {
              newPiece = kicked;
              valid = true;
              break;
            }
          }
          if (!valid) return prev;
        }
      } else if (action === "drop") {
        while (isValidPosition(prev.board, { ...newPiece, y: newPiece.y + 1 })) {
          newPiece = { ...newPiece, y: newPiece.y + 1 };
        }
      }
      
      return { ...prev, currentPiece: newPiece };
    });
  };

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);
    
    if (gameState.currentPiece) {
      // Ghost piece
      let ghostY = gameState.currentPiece.y;
      while (isValidPosition(gameState.board, { ...gameState.currentPiece, y: ghostY + 1 })) {
        ghostY++;
      }
      
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const boardY = ghostY + y;
            const boardX = gameState.currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH && !displayBoard[boardY][boardX]) {
              displayBoard[boardY][boardX] = gameState.currentPiece.color + "40"; // Ghost with opacity
            }
          }
        }
      }
      
      // Current piece
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const boardY = gameState.currentPiece.y + y;
            const boardX = gameState.currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = gameState.currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  if (gameState.status === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <BackButton />
            <h1 className="text-3xl font-bold">Tetris</h1>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🧱</span>
                Classic Tetris
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2">Controls:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>← → to move left/right</li>
                  <li>↑ to rotate</li>
                  <li>↓ to soft drop</li>
                  <li>Space for hard drop</li>
                </ul>
              </div>

              {gameState.highScore > 0 && (
                <div className="text-center">
                  <p className="text-amber-400">High Score: {gameState.highScore.toLocaleString()}</p>
                </div>
              )}

              <Button onClick={startGame} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-6 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="font-bold">Tetris</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={togglePause} className="hover:bg-white/10">
              <Pause className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={startGame} className="hover:bg-white/10">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center p-4">
        {/* Stats */}
        <div className="flex justify-between w-full max-w-xs mb-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400">Score</p>
            <p className="font-bold text-lg">{gameState.score.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Level</p>
            <p className="font-bold text-lg">{gameState.level}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400">Lines</p>
            <p className="font-bold text-lg">{gameState.lines}</p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Game Board */}
          <div 
            className="bg-black/50 rounded-lg p-1 border border-white/20"
            style={{ width: BOARD_WIDTH * CELL_SIZE + 8, height: BOARD_HEIGHT * CELL_SIZE + 8 }}
          >
            <div className="grid" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)` }}>
              {displayBoard.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="border border-gray-800/50"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: cell || "transparent",
                      boxShadow: cell && !cell.includes("40") ? `inset 0 0 10px rgba(255,255,255,0.3)` : undefined,
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Next Piece */}
          <div className="bg-black/30 rounded-lg p-3 border border-white/20 hidden md:block">
            <p className="text-xs text-gray-400 mb-2">Next</p>
            <div className="w-16 h-16 flex items-center justify-center">
              {gameState.nextPiece.shape.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: cell ? gameState.nextPiece.color : "transparent",
                        boxShadow: cell ? `inset 0 0 5px rgba(255,255,255,0.3)` : undefined,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Touch Controls */}
        <div className="mt-6 grid grid-cols-4 gap-2 md:hidden">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white"
            onTouchStart={() => handleTouchControl("left")}
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white"
            onTouchStart={() => handleTouchControl("rotate")}
          >
            <RotateCw className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white"
            onTouchStart={() => handleTouchControl("drop")}
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white"
            onTouchStart={() => handleTouchControl("right")}
          >
            →
          </Button>
        </div>
      </div>

      {/* Pause Overlay */}
      <AnimatePresence>
        {gameState.status === "paused" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <Pause className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <h2 className="text-2xl font-bold mb-4">Paused</h2>
              <div className="space-y-2">
                <Button onClick={togglePause} className="bg-purple-600 hover:bg-purple-500 px-8 w-full">
                  Resume
                </Button>
                <Button onClick={startGame} variant="outline" className="w-full">
                  Restart
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState.status === "gameover" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center border-2 border-purple-500/50"
            >
              {gameState.score >= gameState.highScore && gameState.score > 0 ? (
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              ) : (
                <span className="text-5xl block mb-4">🧱</span>
              )}
              <h2 className="text-3xl font-bold mb-2">Game Over</h2>
              <p className="text-2xl text-white mb-2">{gameState.score.toLocaleString()}</p>
              <p className="text-gray-400 mb-4">Level {gameState.level} • {gameState.lines} lines</p>
              {gameState.score >= gameState.highScore && gameState.score > 0 && (
                <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  New High Score!
                </Badge>
              )}
              <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-500 px-8">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
