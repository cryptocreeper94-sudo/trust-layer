import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Play, Trophy, Heart, Zap, Shield, Target, Pause } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  speed?: number;
  type?: string;
}

interface Bullet extends Entity {
  dy: number;
}

interface Enemy extends Entity {
  health: number;
  points: number;
  pattern: "dive" | "sweep" | "stationary";
  angle?: number;
  baseY?: number;
}

interface PowerUp extends Entity {
  type: "shield" | "rapid" | "spread";
  dy: number;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  color: string;
  size: number;
}

interface GameState {
  player: Entity;
  bullets: Bullet[];
  enemyBullets: Bullet[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  particles: Particle[];
  score: number;
  lives: number;
  level: number;
  status: "menu" | "playing" | "paused" | "gameover" | "levelup";
  combo: number;
  comboTimer: number;
  powerUpActive: { type: string; timer: number } | null;
  highScore: number;
}

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 30;

const ENEMY_TYPES = {
  basic: { width: 30, height: 24, health: 1, points: 100, color: "#ef4444" },
  fast: { width: 25, height: 20, health: 1, points: 150, color: "#f97316" },
  tank: { width: 40, height: 32, health: 3, points: 300, color: "#8b5cf6" },
  boss: { width: 60, height: 48, health: 10, points: 1000, color: "#ec4899" },
};

function createInitialState(): GameState {
  const savedHighScore = parseInt(localStorage.getItem("galaga_highscore") || "0");
  return {
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - PLAYER_HEIGHT - 20,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    powerUps: [],
    particles: [],
    score: 0,
    lives: 3,
    level: 1,
    status: "menu",
    combo: 0,
    comboTimer: 0,
    powerUpActive: null,
    highScore: savedHighScore,
  };
}

function spawnEnemyWave(level: number): Enemy[] {
  const enemies: Enemy[] = [];
  const rows = Math.min(3 + Math.floor(level / 3), 5);
  const cols = Math.min(5 + Math.floor(level / 2), 8);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const type = row === 0 && level >= 3 ? "tank" : row === 0 && level >= 5 ? "boss" : row < 2 ? "fast" : "basic";
      const config = ENEMY_TYPES[type as keyof typeof ENEMY_TYPES];
      
      enemies.push({
        x: 40 + col * 40,
        y: 40 + row * 50,
        width: config.width,
        height: config.height,
        health: config.health + Math.floor(level / 5),
        points: config.points,
        pattern: row === 0 ? "dive" : row === 1 ? "sweep" : "stationary",
        angle: 0,
        baseY: 40 + row * 50,
        speed: 1 + level * 0.2,
        type,
      });
    }
  }
  
  return enemies;
}

function createExplosion(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * (2 + Math.random() * 3),
      dy: Math.sin(angle) * (2 + Math.random() * 3),
      life: 30,
      color,
      size: 3 + Math.random() * 4,
    });
  }
  return particles;
}

export default function Galaga() {
  const [, navigate] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [touchX, setTouchX] = useState<number | null>(null);
  
  const keysRef = useRef<Set<string>>(new Set());
  const lastShotRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }
      if (e.key === "Escape" && gameState.status === "playing") {
        setGameState(s => ({ ...s, status: "paused" }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState.status]);

  // Touch handlers
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
      setTouchX(x);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTouchX(null);
  }, []);

  // Start game
  const startGame = useCallback(() => {
    const newState = createInitialState();
    newState.status = "playing";
    newState.enemies = spawnEnemyWave(1);
    setGameState(newState);
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(s => ({ ...s, status: "playing" }));
  }, []);

  const nextLevel = useCallback(() => {
    setGameState(s => ({
      ...s,
      level: s.level + 1,
      enemies: spawnEnemyWave(s.level + 1),
      status: "playing",
    }));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.status !== "playing") {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      setGameState(prevState => {
        let state = { ...prevState };
        const now = Date.now();
        
        // Player movement
        const keys = keysRef.current;
        const moveSpeed = 6;
        
        if (keys.has("arrowleft") || keys.has("a")) {
          state.player = { ...state.player, x: Math.max(0, state.player.x - moveSpeed) };
        }
        if (keys.has("arrowright") || keys.has("d")) {
          state.player = { ...state.player, x: Math.min(CANVAS_WIDTH - PLAYER_WIDTH, state.player.x + moveSpeed) };
        }
        
        // Touch movement
        if (touchX !== null) {
          const targetX = touchX - PLAYER_WIDTH / 2;
          const dx = targetX - state.player.x;
          state.player = { ...state.player, x: state.player.x + dx * 0.15 };
        }
        
        // Shooting (keyboard or touch)
        const shootCooldown = state.powerUpActive?.type === "rapid" ? 100 : 200;
        if ((keys.has(" ") || keys.has("arrowup") || touchX !== null) && now - lastShotRef.current > shootCooldown) {
          lastShotRef.current = now;
          const bulletCount = state.powerUpActive?.type === "spread" ? 3 : 1;
          
          for (let i = 0; i < bulletCount; i++) {
            const offset = bulletCount === 3 ? (i - 1) * 15 : 0;
            state.bullets = [...state.bullets, {
              x: state.player.x + PLAYER_WIDTH / 2 - 3 + offset,
              y: state.player.y,
              width: 6,
              height: 12,
              dy: -10,
            }];
          }
        }
        
        // Update bullets
        state.bullets = state.bullets
          .map(b => ({ ...b, y: b.y + b.dy }))
          .filter(b => b.y > -20);
        
        // Update enemy bullets
        state.enemyBullets = state.enemyBullets
          .map(b => ({ ...b, y: b.y + b.dy }))
          .filter(b => b.y < CANVAS_HEIGHT + 20);
        
        // Update enemies
        state.enemies = state.enemies.map(enemy => {
          let newEnemy = { ...enemy };
          newEnemy.angle = (newEnemy.angle || 0) + 0.03;
          
          if (enemy.pattern === "sweep") {
            newEnemy.x += Math.sin(newEnemy.angle!) * 2;
          } else if (enemy.pattern === "dive") {
            newEnemy.y = (newEnemy.baseY || 50) + Math.sin(newEnemy.angle! * 0.5) * 30;
          }
          
          // Enemy shooting
          if (Math.random() < 0.003 * state.level) {
            state.enemyBullets = [...state.enemyBullets, {
              x: enemy.x + enemy.width / 2 - 3,
              y: enemy.y + enemy.height,
              width: 6,
              height: 10,
              dy: 4 + state.level * 0.3,
            }];
          }
          
          return newEnemy;
        });
        
        // Update power-ups
        state.powerUps = state.powerUps
          .map(p => ({ ...p, y: p.y + p.dy }))
          .filter(p => p.y < CANVAS_HEIGHT + 20);
        
        // Update particles
        state.particles = state.particles
          .map(p => ({ ...p, x: p.x + p.dx, y: p.y + p.dy, life: p.life - 1, size: p.size * 0.95 }))
          .filter(p => p.life > 0);
        
        // Bullet-enemy collisions
        state.bullets.forEach((bullet, bi) => {
          state.enemies.forEach((enemy, ei) => {
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y
            ) {
              // Hit!
              state.bullets = state.bullets.filter((_, i) => i !== bi);
              const newHealth = enemy.health - 1;
              
              if (newHealth <= 0) {
                // Destroy enemy
                state.enemies = state.enemies.filter((_, i) => i !== ei);
                state.combo++;
                state.comboTimer = 60;
                const comboMultiplier = Math.min(state.combo, 5);
                state.score += enemy.points * comboMultiplier;
                state.particles = [...state.particles, ...createExplosion(
                  enemy.x + enemy.width / 2,
                  enemy.y + enemy.height / 2,
                  ENEMY_TYPES[enemy.type as keyof typeof ENEMY_TYPES]?.color || "#ef4444"
                )];
                
                // Maybe drop power-up
                if (Math.random() < 0.1) {
                  const types: Array<"shield" | "rapid" | "spread"> = ["shield", "rapid", "spread"];
                  state.powerUps = [...state.powerUps, {
                    x: enemy.x + enemy.width / 2 - 10,
                    y: enemy.y,
                    width: 20,
                    height: 20,
                    type: types[Math.floor(Math.random() * types.length)],
                    dy: 2,
                  }];
                }
              } else {
                state.enemies = state.enemies.map((e, i) => 
                  i === ei ? { ...e, health: newHealth } : e
                );
              }
            }
          });
        });
        
        // Enemy bullet-player collisions
        if (state.powerUpActive?.type !== "shield") {
          state.enemyBullets.forEach((bullet, bi) => {
            if (
              bullet.x < state.player.x + state.player.width &&
              bullet.x + bullet.width > state.player.x &&
              bullet.y < state.player.y + state.player.height &&
              bullet.y + bullet.height > state.player.y
            ) {
              state.enemyBullets = state.enemyBullets.filter((_, i) => i !== bi);
              state.lives--;
              state.particles = [...state.particles, ...createExplosion(
                state.player.x + PLAYER_WIDTH / 2,
                state.player.y + PLAYER_HEIGHT / 2,
                "#3b82f6"
              )];
              
              if (state.lives <= 0) {
                state.status = "gameover";
                if (state.score > state.highScore) {
                  state.highScore = state.score;
                  localStorage.setItem("galaga_highscore", state.score.toString());
                }
              }
            }
          });
        }
        
        // Power-up collection
        state.powerUps.forEach((powerUp, pi) => {
          if (
            powerUp.x < state.player.x + state.player.width &&
            powerUp.x + powerUp.width > state.player.x &&
            powerUp.y < state.player.y + state.player.height &&
            powerUp.y + powerUp.height > state.player.y
          ) {
            state.powerUps = state.powerUps.filter((_, i) => i !== pi);
            state.powerUpActive = { type: powerUp.type, timer: 300 };
          }
        });
        
        // Update power-up timer
        if (state.powerUpActive) {
          state.powerUpActive = {
            ...state.powerUpActive,
            timer: state.powerUpActive.timer - 1,
          };
          if (state.powerUpActive.timer <= 0) {
            state.powerUpActive = null;
          }
        }
        
        // Update combo timer
        if (state.comboTimer > 0) {
          state.comboTimer--;
          if (state.comboTimer === 0) {
            state.combo = 0;
          }
        }
        
        // Check level complete
        if (state.enemies.length === 0 && state.status === "playing") {
          state.status = "levelup";
        }
        
        return state;
      });
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.status, touchX]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear
    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw stars background
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 50; i++) {
      const x = (i * 73) % CANVAS_WIDTH;
      const y = ((i * 47) + (Date.now() / 50)) % CANVAS_HEIGHT;
      const size = (i % 3) + 1;
      ctx.globalAlpha = 0.3 + (i % 5) * 0.1;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
    
    // Draw particles
    gameState.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    
    // Draw power-ups
    gameState.powerUps.forEach(p => {
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      ctx.rotate(Date.now() / 200);
      
      const colors = { shield: "#22c55e", rapid: "#f97316", spread: "#8b5cf6" };
      ctx.fillStyle = colors[p.type];
      ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      
      ctx.restore();
    });
    
    // Draw player
    if (gameState.status === "playing" || gameState.status === "paused") {
      const px = gameState.player.x;
      const py = gameState.player.y;
      
      // Shield glow
      if (gameState.powerUpActive?.type === "shield") {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px + PLAYER_WIDTH / 2, py + PLAYER_HEIGHT / 2, 30, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Ship body
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.moveTo(px + PLAYER_WIDTH / 2, py);
      ctx.lineTo(px + PLAYER_WIDTH, py + PLAYER_HEIGHT);
      ctx.lineTo(px, py + PLAYER_HEIGHT);
      ctx.closePath();
      ctx.fill();
      
      // Engine glow
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(px + PLAYER_WIDTH / 2 - 5, py + PLAYER_HEIGHT);
      ctx.lineTo(px + PLAYER_WIDTH / 2, py + PLAYER_HEIGHT + 8 + Math.random() * 5);
      ctx.lineTo(px + PLAYER_WIDTH / 2 + 5, py + PLAYER_HEIGHT);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw bullets
    ctx.fillStyle = "#22d3ee";
    gameState.bullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });
    
    // Draw enemy bullets
    ctx.fillStyle = "#ef4444";
    gameState.enemyBullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });
    
    // Draw enemies
    gameState.enemies.forEach(enemy => {
      const color = ENEMY_TYPES[enemy.type as keyof typeof ENEMY_TYPES]?.color || "#ef4444";
      ctx.fillStyle = color;
      
      // Simple enemy shape
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x + enemy.width, enemy.y);
      ctx.lineTo(enemy.x, enemy.y);
      ctx.closePath();
      ctx.fill();
      
      // Health bar for tanks/bosses
      if (enemy.health > 1) {
        const maxHealth = ENEMY_TYPES[enemy.type as keyof typeof ENEMY_TYPES]?.health || 1;
        ctx.fillStyle = "#333";
        ctx.fillRect(enemy.x, enemy.y - 6, enemy.width, 4);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(enemy.x, enemy.y - 6, (enemy.health / maxHealth) * enemy.width, 4);
      }
    });
    
    // UI
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(`Score: ${gameState.score.toLocaleString()}`, 10, 24);
    ctx.fillText(`Level: ${gameState.level}`, CANVAS_WIDTH - 70, 24);
    
    // Lives
    for (let i = 0; i < gameState.lives; i++) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      const x = 10 + i * 20;
      const y = 40;
      ctx.moveTo(x + 6, y + 2);
      ctx.bezierCurveTo(x + 6, y, x, y, x, y + 4);
      ctx.bezierCurveTo(x, y + 8, x + 6, y + 12, x + 6, y + 14);
      ctx.bezierCurveTo(x + 6, y + 12, x + 12, y + 8, x + 12, y + 4);
      ctx.bezierCurveTo(x + 12, y, x + 6, y, x + 6, y + 2);
      ctx.fill();
    }
    
    // Combo
    if (gameState.combo > 1) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 18px system-ui";
      ctx.fillText(`${gameState.combo}x COMBO!`, CANVAS_WIDTH / 2 - 50, 60);
    }
    
    // Power-up indicator
    if (gameState.powerUpActive) {
      const colors = { shield: "#22c55e", rapid: "#f97316", spread: "#8b5cf6" };
      ctx.fillStyle = colors[gameState.powerUpActive.type as keyof typeof colors];
      ctx.fillRect(10, CANVAS_HEIGHT - 30, (gameState.powerUpActive.timer / 300) * 100, 10);
      ctx.fillStyle = "#fff";
      ctx.font = "10px system-ui";
      ctx.fillText(gameState.powerUpActive.type.toUpperCase(), 12, CANVAS_HEIGHT - 35);
    }
    
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="font-bold">Space Blaster</h1>
          </div>
          {gameState.status === "playing" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setGameState(s => ({ ...s, status: "paused" }))}
              className="hover:bg-white/10"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4">
        {/* Canvas Container */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-xl border border-white/20 shadow-2xl touch-none"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          {/* Menu Overlay */}
          <AnimatePresence>
            {gameState.status === "menu" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
              >
                <h2 className="text-3xl font-bold mb-2">Space Blaster</h2>
                <p className="text-gray-400 mb-6">Defend Earth from the alien invasion!</p>
                
                <div className="space-y-3 text-center mb-6">
                  <p className="text-sm text-gray-300">Controls:</p>
                  <p className="text-xs text-gray-400">← → Arrow Keys or Touch to move</p>
                  <p className="text-xs text-gray-400">Space or Touch to shoot</p>
                </div>
                
                {gameState.highScore > 0 && (
                  <p className="text-amber-400 mb-4">High Score: {gameState.highScore.toLocaleString()}</p>
                )}
                
                <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-500 px-8">
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </motion.div>
            )}

            {gameState.status === "paused" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
              >
                <Pause className="w-12 h-12 mb-4 text-white/50" />
                <h2 className="text-2xl font-bold mb-4">Paused</h2>
                <div className="space-y-2">
                  <Button onClick={resumeGame} className="bg-purple-600 hover:bg-purple-500 px-8 w-full">
                    Resume
                  </Button>
                  <Button onClick={startGame} variant="outline" className="w-full">
                    Restart
                  </Button>
                </div>
              </motion.div>
            )}

            {gameState.status === "levelup" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
              >
                <Zap className="w-12 h-12 mb-4 text-yellow-400" />
                <h2 className="text-2xl font-bold mb-2">Level {gameState.level} Complete!</h2>
                <p className="text-gray-400 mb-4">Score: {gameState.score.toLocaleString()}</p>
                <Button onClick={nextLevel} className="bg-green-600 hover:bg-green-500 px-8">
                  Next Level
                </Button>
              </motion.div>
            )}

            {gameState.status === "gameover" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
              >
                {gameState.score >= gameState.highScore && gameState.score > 0 ? (
                  <Trophy className="w-12 h-12 mb-4 text-yellow-400" />
                ) : (
                  <Target className="w-12 h-12 mb-4 text-red-400" />
                )}
                <h2 className="text-2xl font-bold mb-2">Game Over</h2>
                <p className="text-xl text-white mb-2">Score: {gameState.score.toLocaleString()}</p>
                <p className="text-gray-400 mb-4">Level: {gameState.level}</p>
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
            )}
          </AnimatePresence>
        </div>

        {/* Instructions below canvas */}
        {gameState.status === "playing" && (
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Touch and drag to move • Hold to shoot • ESC to pause</p>
          </div>
        )}
      </div>
    </div>
  );
}
