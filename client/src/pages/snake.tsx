import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Play, Trophy, Pause, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 5;

type Direction = "up" | "down" | "left" | "right";
type Position = { x: number; y: number };

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: "menu" | "playing" | "paused" | "gameover";
  highScore: number;
  speed: number;
}

function getRandomPosition(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function createInitialState(): GameState {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    food: getRandomPosition(snake),
    direction: "right",
    nextDirection: "right",
    score: 0,
    status: "menu",
    highScore: parseInt(localStorage.getItem("snake_highscore") || "0"),
    speed: INITIAL_SPEED,
  };
}

export default function Snake() {
  const [, navigate] = useLocation();
  const gameLoopRef = useRef<number | null>(null);
  const lastMoveRef = useRef(0);
  
  const [gameState, setGameState] = useState<GameState>(createInitialState);

  const startGame = useCallback(() => {
    const snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setGameState({
      snake,
      food: getRandomPosition(snake),
      direction: "right",
      nextDirection: "right",
      score: 0,
      status: "playing",
      highScore: parseInt(localStorage.getItem("snake_highscore") || "0"),
      speed: INITIAL_SPEED,
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
      
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      
      setGameState(prev => {
        let newDirection = prev.nextDirection;
        
        if (e.key === "ArrowUp" && prev.direction !== "down") newDirection = "up";
        else if (e.key === "ArrowDown" && prev.direction !== "up") newDirection = "down";
        else if (e.key === "ArrowLeft" && prev.direction !== "right") newDirection = "left";
        else if (e.key === "ArrowRight" && prev.direction !== "left") newDirection = "right";
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
      if (timestamp - lastMoveRef.current > gameState.speed) {
        lastMoveRef.current = timestamp;
        
        setGameState(prev => {
          if (prev.status !== "playing") return prev;
          
          const head = prev.snake[0];
          const direction = prev.nextDirection;
          
          let newHead: Position;
          switch (direction) {
            case "up": newHead = { x: head.x, y: head.y - 1 }; break;
            case "down": newHead = { x: head.x, y: head.y + 1 }; break;
            case "left": newHead = { x: head.x - 1, y: head.y }; break;
            case "right": newHead = { x: head.x + 1, y: head.y }; break;
          }
          
          // Wall collision
          if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            if (prev.score > prev.highScore) {
              localStorage.setItem("snake_highscore", prev.score.toString());
            }
            return { ...prev, status: "gameover", highScore: Math.max(prev.score, prev.highScore) };
          }
          
          // Self collision
          if (prev.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            if (prev.score > prev.highScore) {
              localStorage.setItem("snake_highscore", prev.score.toString());
            }
            return { ...prev, status: "gameover", highScore: Math.max(prev.score, prev.highScore) };
          }
          
          const newSnake = [newHead, ...prev.snake];
          let newFood = prev.food;
          let newScore = prev.score;
          let newSpeed = prev.speed;
          
          // Eat food
          if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
            newFood = getRandomPosition(newSnake);
            newScore += 10;
            newSpeed = Math.max(50, prev.speed - SPEED_INCREASE);
          } else {
            newSnake.pop();
          }
          
          return {
            ...prev,
            snake: newSnake,
            food: newFood,
            direction,
            score: newScore,
            speed: newSpeed,
          };
        });
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState.status, gameState.speed]);

  // Touch controls
  const handleTouchControl = (direction: Direction) => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => {
      if (
        (direction === "up" && prev.direction !== "down") ||
        (direction === "down" && prev.direction !== "up") ||
        (direction === "left" && prev.direction !== "right") ||
        (direction === "right" && prev.direction !== "left")
      ) {
        return { ...prev, nextDirection: direction };
      }
      return prev;
    });
  };

  if (gameState.status === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">Snake</h1>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">🐍</span>
                Classic Snake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2">Controls:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Arrow keys to change direction</li>
                  <li>Eat food to grow longer</li>
                  <li>Don't hit walls or yourself!</li>
                </ul>
              </div>

              {gameState.highScore > 0 && (
                <div className="text-center">
                  <p className="text-amber-400">High Score: {gameState.highScore}</p>
                </div>
              )}

              <Button onClick={startGame} className="w-full bg-green-600 hover:bg-green-500 text-white py-6 text-lg">
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold">Snake</h1>
              <p className="text-xs text-gray-400">Score: {gameState.score}</p>
            </div>
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
        {/* Game Board */}
        <div 
          className="bg-black/50 rounded-lg p-1 border border-white/20"
          style={{ width: GRID_SIZE * CELL_SIZE + 8, height: GRID_SIZE * CELL_SIZE + 8 }}
        >
          <div 
            className="relative"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
            {/* Grid */}
            <div 
              className="absolute inset-0 grid"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-gray-800/30"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                />
              ))}
            </div>
            
            {/* Snake */}
            {gameState.snake.map((segment, index) => (
              <motion.div
                key={index}
                className={`absolute rounded-sm ${index === 0 ? "bg-green-400" : "bg-green-500"}`}
                style={{
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  left: segment.x * CELL_SIZE + 1,
                  top: segment.y * CELL_SIZE + 1,
                  boxShadow: index === 0 ? "0 0 10px rgba(74, 222, 128, 0.5)" : undefined,
                }}
                initial={false}
                animate={{ scale: 1 }}
              />
            ))}
            
            {/* Food */}
            <motion.div
              className="absolute bg-red-500 rounded-full"
              style={{
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                left: gameState.food.x * CELL_SIZE + 2,
                top: gameState.food.y * CELL_SIZE + 2,
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          </div>
        </div>

        {/* Touch Controls */}
        <div className="mt-6 md:hidden">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white w-16 h-16"
              onTouchStart={() => handleTouchControl("up")}
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white w-16 h-16"
                onTouchStart={() => handleTouchControl("left")}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white w-16 h-16"
                onTouchStart={() => handleTouchControl("down")}
              >
                <ArrowDown className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white w-16 h-16"
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
              <Pause className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <h2 className="text-2xl font-bold mb-4">Paused</h2>
              <div className="space-y-2">
                <Button onClick={togglePause} className="bg-green-600 hover:bg-green-500 px-8 w-full">
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
              className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center border-2 border-green-500/50"
            >
              {gameState.score >= gameState.highScore && gameState.score > 0 ? (
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              ) : (
                <span className="text-5xl block mb-4">🐍</span>
              )}
              <h2 className="text-3xl font-bold mb-2">Game Over</h2>
              <p className="text-2xl text-white mb-2">Score: {gameState.score}</p>
              <p className="text-gray-400 mb-4">Length: {gameState.snake.length}</p>
              {gameState.score >= gameState.highScore && gameState.score > 0 && (
                <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  New High Score!
                </Badge>
              )}
              <Button onClick={startGame} className="bg-green-600 hover:bg-green-500 px-8">
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
