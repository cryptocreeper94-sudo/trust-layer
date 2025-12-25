import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Play, Trophy, Pause, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

const CELL_SIZE = 20;
const GAME_SPEED = 150;
const GHOST_SPEED = 200;
const POWER_DURATION = 5000;

type Direction = "up" | "down" | "left" | "right";
type Position = { x: number; y: number };

// Simple maze layout: 0 = wall, 1 = pellet, 2 = power pellet, 3 = empty (eaten), 4 = ghost house
const MAZE_TEMPLATE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
  [0,2,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,2,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
  [0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,0],
  [0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0],
  [0,0,0,0,1,0,1,0,0,4,0,0,1,0,1,0,0,0,0],
  [1,1,1,1,1,1,1,0,4,4,4,0,1,1,1,1,1,1,1],
  [0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0],
  [0,0,0,0,1,0,1,1,1,1,1,1,1,0,1,0,0,0,0],
  [0,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0],
  [0,2,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,2,0],
  [0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0],
  [0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const MAZE_WIDTH = MAZE_TEMPLATE[0].length;
const MAZE_HEIGHT = MAZE_TEMPLATE.length;

interface Ghost {
  x: number;
  y: number;
  direction: Direction;
  color: string;
  scared: boolean;
}

interface GameState {
  pacman: Position;
  direction: Direction;
  nextDirection: Direction;
  ghosts: Ghost[];
  maze: number[][];
  score: number;
  lives: number;
  status: "menu" | "playing" | "paused" | "gameover" | "win";
  highScore: number;
  powerMode: boolean;
  powerTimer: number | null;
}

function createInitialState(): GameState {
  return {
    pacman: { x: 9, y: 15 },
    direction: "right",
    nextDirection: "right",
    ghosts: [
      { x: 9, y: 9, direction: "up", color: "#ef4444", scared: false },
      { x: 8, y: 9, direction: "left", color: "#ec4899", scared: false },
      { x: 10, y: 9, direction: "right", color: "#06b6d4", scared: false },
      { x: 9, y: 8, direction: "down", color: "#f97316", scared: false },
    ],
    maze: MAZE_TEMPLATE.map(row => [...row]),
    score: 0,
    lives: 3,
    status: "menu",
    highScore: parseInt(localStorage.getItem("pacman_highscore") || "0"),
    powerMode: false,
    powerTimer: null,
  };
}

function canMove(maze: number[][], x: number, y: number): boolean {
  if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) {
    // Tunnel wrapping
    return y === 9 && (x === -1 || x === MAZE_WIDTH);
  }
  return maze[y][x] !== 0;
}

function wrapPosition(x: number, y: number): Position {
  if (x < 0) return { x: MAZE_WIDTH - 1, y };
  if (x >= MAZE_WIDTH) return { x: 0, y };
  return { x, y };
}

function getNextPosition(pos: Position, dir: Direction): Position {
  switch (dir) {
    case "up": return { x: pos.x, y: pos.y - 1 };
    case "down": return { x: pos.x, y: pos.y + 1 };
    case "left": return { x: pos.x - 1, y: pos.y };
    case "right": return { x: pos.x + 1, y: pos.y };
  }
}

export default function Pacman() {
  const [, navigate] = useLocation();
  const gameLoopRef = useRef<number | null>(null);
  const lastMoveRef = useRef(0);
  const lastGhostMoveRef = useRef(0);
  
  const [gameState, setGameState] = useState<GameState>(createInitialState);

  const startGame = useCallback(() => {
    setGameState({
      ...createInitialState(),
      status: "playing",
      highScore: parseInt(localStorage.getItem("pacman_highscore") || "0"),
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
      
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      
      setGameState(prev => {
        let newDirection = prev.nextDirection;
        
        if (e.key === "ArrowUp") newDirection = "up";
        else if (e.key === "ArrowDown") newDirection = "down";
        else if (e.key === "ArrowLeft") newDirection = "left";
        else if (e.key === "ArrowRight") newDirection = "right";
        else if (e.key === "Escape") return { ...prev, status: "paused" };
        else return prev;
        
        return { ...prev, nextDirection: newDirection };
      });
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.status, startGame]);

  // Game loop
  useEffect(() => {
    if (gameState.status !== "playing") {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }
    
    const gameLoop = (timestamp: number) => {
      // Pac-Man movement
      if (timestamp - lastMoveRef.current > GAME_SPEED) {
        lastMoveRef.current = timestamp;
        
        setGameState(prev => {
          if (prev.status !== "playing") return prev;
          
          // Try to move in next direction, otherwise continue current direction
          let moveDir = prev.nextDirection;
          let nextPos = getNextPosition(prev.pacman, moveDir);
          
          if (!canMove(prev.maze, nextPos.x, nextPos.y)) {
            moveDir = prev.direction;
            nextPos = getNextPosition(prev.pacman, moveDir);
          }
          
          if (!canMove(prev.maze, nextPos.x, nextPos.y)) {
            return prev; // Can't move at all
          }
          
          nextPos = wrapPosition(nextPos.x, nextPos.y);
          
          const newMaze = prev.maze.map(row => [...row]);
          let newScore = prev.score;
          let powerMode = prev.powerMode;
          let ghosts = prev.ghosts;
          
          // Eat pellet
          if (newMaze[nextPos.y][nextPos.x] === 1) {
            newMaze[nextPos.y][nextPos.x] = 3;
            newScore += 10;
          } else if (newMaze[nextPos.y][nextPos.x] === 2) {
            newMaze[nextPos.y][nextPos.x] = 3;
            newScore += 50;
            powerMode = true;
            ghosts = ghosts.map(g => ({ ...g, scared: true }));
            
            // Set power timer
            if (prev.powerTimer) clearTimeout(prev.powerTimer);
          }
          
          // Check if all pellets eaten
          const pelletsLeft = newMaze.flat().filter(c => c === 1 || c === 2).length;
          if (pelletsLeft === 0) {
            if (newScore > prev.highScore) {
              localStorage.setItem("pacman_highscore", newScore.toString());
            }
            return { ...prev, maze: newMaze, score: newScore, status: "win", highScore: Math.max(newScore, prev.highScore) };
          }
          
          // Check ghost collision
          for (const ghost of ghosts) {
            if (ghost.x === nextPos.x && ghost.y === nextPos.y) {
              if (ghost.scared) {
                // Eat ghost
                newScore += 200;
                ghosts = ghosts.map(g => 
                  g === ghost ? { ...g, x: 9, y: 9, scared: false } : g
                );
              } else {
                // Lose life
                const newLives = prev.lives - 1;
                if (newLives <= 0) {
                  if (newScore > prev.highScore) {
                    localStorage.setItem("pacman_highscore", newScore.toString());
                  }
                  return { ...prev, lives: 0, score: newScore, status: "gameover", highScore: Math.max(newScore, prev.highScore) };
                }
                // Reset positions
                return {
                  ...prev,
                  pacman: { x: 9, y: 15 },
                  direction: "right",
                  nextDirection: "right",
                  ghosts: [
                    { x: 9, y: 9, direction: "up", color: "#ef4444", scared: false },
                    { x: 8, y: 9, direction: "left", color: "#ec4899", scared: false },
                    { x: 10, y: 9, direction: "right", color: "#06b6d4", scared: false },
                    { x: 9, y: 8, direction: "down", color: "#f97316", scared: false },
                  ],
                  lives: newLives,
                  score: newScore,
                  powerMode: false,
                };
              }
            }
          }
          
          return {
            ...prev,
            pacman: nextPos,
            direction: moveDir,
            maze: newMaze,
            score: newScore,
            ghosts,
            powerMode,
          };
        });
      }
      
      // Ghost movement
      if (timestamp - lastGhostMoveRef.current > GHOST_SPEED) {
        lastGhostMoveRef.current = timestamp;
        
        setGameState(prev => {
          if (prev.status !== "playing") return prev;
          
          const newGhosts = prev.ghosts.map(ghost => {
            const directions: Direction[] = ["up", "down", "left", "right"];
            const validDirs = directions.filter(dir => {
              const next = getNextPosition(ghost, dir);
              // Don't go back
              const opposite: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
              if (dir === opposite[ghost.direction]) return false;
              // Check walls (ghosts can't use tunnel)
              if (next.x < 0 || next.x >= MAZE_WIDTH || next.y < 0 || next.y >= MAZE_HEIGHT) return false;
              const cell = prev.maze[next.y][next.x];
              return cell !== 0;
            });
            
            if (validDirs.length === 0) {
              // Dead end, turn around
              const opposite: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };
              return { ...ghost, direction: opposite[ghost.direction] };
            }
            
            // Simple AI: chase or flee
            let chosenDir = validDirs[Math.floor(Math.random() * validDirs.length)];
            
            if (!ghost.scared) {
              // Chase Pac-Man (simple: prefer direction that gets closer)
              const distances = validDirs.map(dir => {
                const next = getNextPosition(ghost, dir);
                return {
                  dir,
                  dist: Math.abs(next.x - prev.pacman.x) + Math.abs(next.y - prev.pacman.y),
                };
              });
              distances.sort((a, b) => a.dist - b.dist);
              chosenDir = distances[0].dir;
            } else {
              // Flee from Pac-Man
              const distances = validDirs.map(dir => {
                const next = getNextPosition(ghost, dir);
                return {
                  dir,
                  dist: Math.abs(next.x - prev.pacman.x) + Math.abs(next.y - prev.pacman.y),
                };
              });
              distances.sort((a, b) => b.dist - a.dist);
              chosenDir = distances[0].dir;
            }
            
            const nextPos = getNextPosition(ghost, chosenDir);
            return { ...ghost, x: nextPos.x, y: nextPos.y, direction: chosenDir };
          });
          
          // Check collision after ghost move
          for (const ghost of newGhosts) {
            if (ghost.x === prev.pacman.x && ghost.y === prev.pacman.y) {
              if (ghost.scared) {
                const idx = newGhosts.indexOf(ghost);
                newGhosts[idx] = { ...ghost, x: 9, y: 9, scared: false };
                return { ...prev, ghosts: newGhosts, score: prev.score + 200 };
              } else {
                const newLives = prev.lives - 1;
                if (newLives <= 0) {
                  if (prev.score > prev.highScore) {
                    localStorage.setItem("pacman_highscore", prev.score.toString());
                  }
                  return { ...prev, lives: 0, status: "gameover", highScore: Math.max(prev.score, prev.highScore) };
                }
                return {
                  ...prev,
                  pacman: { x: 9, y: 15 },
                  direction: "right",
                  nextDirection: "right",
                  ghosts: [
                    { x: 9, y: 9, direction: "up", color: "#ef4444", scared: false },
                    { x: 8, y: 9, direction: "left", color: "#ec4899", scared: false },
                    { x: 10, y: 9, direction: "right", color: "#06b6d4", scared: false },
                    { x: 9, y: 8, direction: "down", color: "#f97316", scared: false },
                  ],
                  lives: newLives,
                  powerMode: false,
                };
              }
            }
          }
          
          return { ...prev, ghosts: newGhosts };
        });
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState.status]);

  // Power mode timer
  useEffect(() => {
    if (gameState.powerMode && gameState.status === "playing") {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          powerMode: false,
          ghosts: prev.ghosts.map(g => ({ ...g, scared: false })),
        }));
      }, POWER_DURATION);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.powerMode, gameState.status]);

  // Touch controls
  const handleTouchControl = (direction: Direction) => {
    if (gameState.status !== "playing") return;
    setGameState(prev => ({ ...prev, nextDirection: direction }));
  };

  if (gameState.status === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">Pac-Man</h1>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">👻</span>
                Classic Pac-Man
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2">Controls:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Arrow keys to move</li>
                  <li>Eat all pellets to win</li>
                  <li>Power pellets let you eat ghosts!</li>
                  <li>Avoid ghosts or lose a life</li>
                </ul>
              </div>

              {gameState.highScore > 0 && (
                <div className="text-center">
                  <p className="text-amber-400">High Score: {gameState.highScore}</p>
                </div>
              )}

              <Button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-6 text-lg font-bold">
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm px-4 py-2 sticky top-0 z-50 border-b border-blue-500/30">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold text-yellow-400">Pac-Man</h1>
              <p className="text-xs text-gray-400">Score: {gameState.score}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex gap-1">
              {Array.from({ length: gameState.lives }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">●</span>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={togglePause} className="hover:bg-white/10">
              <Pause className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center p-4">
        {/* Game Board */}
        <div 
          className="bg-blue-950 rounded-lg p-1 border-2 border-blue-500"
          style={{ width: MAZE_WIDTH * CELL_SIZE + 8 }}
        >
          <div 
            className="relative"
            style={{ width: MAZE_WIDTH * CELL_SIZE, height: MAZE_HEIGHT * CELL_SIZE }}
          >
            {/* Maze */}
            {gameState.maze.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="absolute"
                  style={{
                    left: x * CELL_SIZE,
                    top: y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                >
                  {cell === 0 && (
                    <div className="w-full h-full bg-blue-800 border border-blue-600" />
                  )}
                  {cell === 1 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-200" />
                    </div>
                  )}
                  {cell === 2 && (
                    <div className="w-full h-full flex items-center justify-center">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-yellow-200"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Ghosts */}
            {gameState.ghosts.map((ghost, i) => (
              <motion.div
                key={i}
                className="absolute flex items-center justify-center text-lg"
                style={{
                  left: ghost.x * CELL_SIZE,
                  top: ghost.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  color: ghost.scared ? "#3b82f6" : ghost.color,
                }}
                animate={ghost.scared ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.3 }}
              >
                👻
              </motion.div>
            ))}
            
            {/* Pac-Man */}
            <motion.div
              className="absolute flex items-center justify-center text-xl"
              style={{
                left: gameState.pacman.x * CELL_SIZE,
                top: gameState.pacman.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
                transform: `rotate(${
                  gameState.direction === "right" ? 0 :
                  gameState.direction === "down" ? 90 :
                  gameState.direction === "left" ? 180 :
                  270
                }deg)`,
              }}
            >
              <motion.span
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ repeat: Infinity, duration: 0.15 }}
              >
                😮
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Touch Controls */}
        <div className="mt-6 md:hidden">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 w-16 h-16"
              onTouchStart={() => handleTouchControl("up")}
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 w-16 h-16"
                onTouchStart={() => handleTouchControl("left")}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 w-16 h-16"
                onTouchStart={() => handleTouchControl("down")}
              >
                <ArrowDown className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-yellow-500/20 border-yellow-500/50 text-yellow-400 w-16 h-16"
                onTouchStart={() => handleTouchControl("right")}
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
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
              <Pause className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-4">Paused</h2>
              <div className="space-y-2">
                <Button onClick={togglePause} className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 w-full">
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

      {/* Game Over / Win Overlay */}
      <AnimatePresence>
        {(gameState.status === "gameover" || gameState.status === "win") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center border-2 border-yellow-500/50"
            >
              {gameState.status === "win" ? (
                <>
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                  <h2 className="text-3xl font-bold mb-2 text-yellow-400">You Win!</h2>
                </>
              ) : (
                <>
                  <span className="text-5xl block mb-4">👻</span>
                  <h2 className="text-3xl font-bold mb-2">Game Over</h2>
                </>
              )}
              <p className="text-2xl text-white mb-4">Score: {gameState.score}</p>
              {gameState.score >= gameState.highScore && gameState.score > 0 && (
                <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  New High Score!
                </Badge>
              )}
              <Button onClick={startGame} className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 font-bold">
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
