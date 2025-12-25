import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Flag, Bomb, Trophy, Skull, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  GameState,
  Difficulty,
  createGame,
  revealCell,
  toggleFlag,
  chordReveal,
  getNumberColor,
  formatTime,
  DIFFICULTY_SETTINGS,
} from "@/lib/minesweeper-engine";

function Cell({
  cell,
  row,
  col,
  onClick,
  onRightClick,
  onDoubleClick,
  gameStatus,
}: {
  cell: { isMine: boolean; isRevealed: boolean; isFlagged: boolean; adjacentMines: number };
  row: number;
  col: number;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  gameStatus: string;
}) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e);
  };

  let content: React.ReactNode = null;
  let bgClass = "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600";
  
  if (cell.isRevealed) {
    if (cell.isMine) {
      content = <Bomb className="w-4 h-4 text-red-500" />;
      bgClass = "bg-red-900/50";
    } else if (cell.adjacentMines > 0) {
      content = <span className={`font-bold text-sm ${getNumberColor(cell.adjacentMines)}`}>{cell.adjacentMines}</span>;
      bgClass = "bg-gray-300";
    } else {
      bgClass = "bg-gray-200";
    }
  } else if (cell.isFlagged) {
    content = <Flag className="w-4 h-4 text-red-400" />;
  }

  return (
    <motion.button
      onClick={onClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={onDoubleClick}
      whileTap={{ scale: 0.95 }}
      className={`
        w-7 h-7 md:w-8 md:h-8 rounded-sm border border-white/10
        flex items-center justify-center font-bold text-sm
        transition-all cursor-pointer select-none
        ${bgClass}
        ${cell.isRevealed ? "" : "shadow-md active:shadow-sm"}
        ${gameStatus !== "playing" ? "pointer-events-none" : ""}
      `}
      data-testid={`cell-${row}-${col}`}
    >
      {content}
    </motion.button>
  );
}

export default function Minesweeper() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const startNewGame = useCallback(() => {
    setGameState(createGame(difficulty));
    setElapsedTime(0);
  }, [difficulty]);

  // Timer
  useEffect(() => {
    if (!gameState || gameState.status !== "playing" || !gameState.startTime) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - gameState.startTime!);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState?.status, gameState?.startTime]);

  // Show result toast
  useEffect(() => {
    if (!gameState) return;
    
    if (gameState.status === "won") {
      toast({ title: "You Win! 🎉", description: `Cleared in ${formatTime(elapsedTime)}` });
    } else if (gameState.status === "lost") {
      toast({ title: "Game Over 💥", description: "You hit a mine!", variant: "destructive" });
    }
  }, [gameState?.status]);

  const handleCellClick = (row: number, col: number) => {
    if (!gameState) return;
    setGameState(revealCell(gameState, row, col));
  };

  const handleCellRightClick = (row: number, col: number) => {
    if (!gameState) return;
    setGameState(toggleFlag(gameState, row, col));
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    if (!gameState) return;
    setGameState(chordReveal(gameState, row, col));
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">Minesweeper</h1>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bomb className="w-6 h-6 text-red-400" />
                New Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (9×9, 10 mines)</SelectItem>
                    <SelectItem value="medium">Medium (16×16, 40 mines)</SelectItem>
                    <SelectItem value="hard">Hard (16×30, 99 mines)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2">How to Play:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Click cells to reveal them</li>
                  <li>Right-click to place/remove flags</li>
                  <li>Numbers show adjacent mines</li>
                  <li>Clear all safe cells to win!</li>
                </ul>
              </div>

              <Button onClick={startNewGame} className="w-full bg-red-600 hover:bg-red-500 text-white py-6 text-lg">
                <Bomb className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const settings = DIFFICULTY_SETTINGS[difficulty];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold">Minesweeper</h1>
              <p className="text-xs text-gray-400 capitalize">{difficulty}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Flag className="w-4 h-4 text-red-400" />
              <span>{settings.mines - gameState.flagsUsed}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={startNewGame} className="hover:bg-white/10">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Game Status */}
      {gameState.status !== "playing" && (
        <div className={`text-center py-3 ${gameState.status === "won" ? "bg-green-600/30" : "bg-red-600/30"}`}>
          <div className="flex items-center justify-center gap-2">
            {gameState.status === "won" ? (
              <>
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="font-bold">You Win!</span>
              </>
            ) : (
              <>
                <Skull className="w-5 h-5 text-red-400" />
                <span className="font-bold">Game Over!</span>
              </>
            )}
            <Button size="sm" variant="outline" onClick={startNewGame} className="ml-4">
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="p-4 flex justify-center overflow-x-auto">
        <div
          className="inline-grid gap-0.5 p-2 bg-black/30 rounded-lg"
          style={{
            gridTemplateColumns: `repeat(${gameState.cols}, 1fr)`,
          }}
        >
          {gameState.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onRightClick={() => handleCellRightClick(rowIndex, colIndex)}
                onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                gameStatus={gameState.status}
              />
            ))
          )}
        </div>
      </div>

      {/* Touch controls hint for mobile */}
      <div className="text-center text-xs text-gray-500 pb-4">
        Long-press to flag on mobile
      </div>
    </div>
  );
}
