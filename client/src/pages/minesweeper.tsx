import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Flag, Bomb, Trophy, Skull, Clock, Target, Coins, Sparkles, DollarSign } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { SimpleLoginModal } from "@/components/simple-login";
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

interface SweepsBalance {
  goldCoins: string;
  sweepsCoins: string;
}

interface SweepsTile {
  index: number;
  revealed: boolean;
  isMine: boolean;
}

interface SweepsGameState {
  status: "betting" | "playing" | "won" | "lost" | "cashedOut";
  gridSize: number;
  mineCount: number;
  tiles: SweepsTile[];
  minePositions: number[];
  serverSeedHash: string;
  tilesRevealed: number;
  betAmount: number;
  currencyType: "GC" | "SC";
}

const BET_OPTIONS = [10, 25, 50, 100, 250, 500, 1000, 2500];
const MINE_OPTIONS = [1, 3, 5, 7, 10, 12, 15, 20];
const DEMO_BALANCE = { goldCoins: "10000", sweepsCoins: "100" };

function calculateMultiplier(tilesRevealed: number, mineCount: number, gridSize: number): number {
  const totalTiles = gridSize * gridSize;
  let multiplier = 1;
  for (let i = 0; i < tilesRevealed; i++) {
    multiplier *= (totalTiles - mineCount - i) > 0 ? totalTiles / (totalTiles - mineCount - i) : 1;
  }
  return Math.round(multiplier * 100) / 100;
}

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

function SweepsTileCell({
  tile,
  onClick,
  gameStatus,
  gridSize,
}: {
  tile: SweepsTile;
  onClick: () => void;
  gameStatus: string;
  gridSize: number;
}) {
  const row = Math.floor(tile.index / gridSize);
  const col = tile.index % gridSize;

  let content: React.ReactNode = null;
  let bgClass = "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600";

  if (tile.revealed) {
    if (tile.isMine) {
      content = <Bomb className="w-5 h-5 text-red-500" />;
      bgClass = "bg-red-900/50";
    } else {
      content = <Sparkles className="w-5 h-5 text-green-400" />;
      bgClass = "bg-green-900/40";
    }
  }

  const isClickable = gameStatus === "playing" && !tile.revealed;

  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      whileTap={isClickable ? { scale: 0.95 } : undefined}
      initial={tile.revealed ? { scale: 0.8 } : false}
      animate={{ scale: 1 }}
      className={`
        w-12 h-12 md:w-14 md:h-14 rounded-md border border-white/10
        flex items-center justify-center font-bold text-sm
        transition-all select-none
        ${bgClass}
        ${tile.revealed ? "" : "shadow-md active:shadow-sm"}
        ${isClickable ? "cursor-pointer" : "cursor-default"}
      `}
      data-testid={`sweeps-tile-${row}-${col}`}
    >
      {content}
    </motion.button>
  );
}

export default function Minesweeper() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [currencyType, setCurrencyType] = useState<"GC" | "SC">("GC");
  const [betAmount, setBetAmount] = useState(100);
  const [gridSize, setGridSize] = useState(5);
  const [mineCount, setMineCount] = useState(3);
  const [sweepsGame, setSweepsGame] = useState<SweepsGameState | null>(null);
  const [demoBalance, setDemoBalance] = useState(DEMO_BALANCE);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isDemo = !user;

  const { data: balance } = useQuery<SweepsBalance>({
    queryKey: ["/api/sweeps/balance"],
    enabled: !!user,
  });

  const currentBalance = isDemo ? demoBalance : balance;

  const playMutation = useMutation({
    mutationFn: async (data: { gameType: string; currencyType: string; betAmount: number; gridSize: number; mineCount: number }) => {
      const res = await apiRequest("POST", "/api/sweeps/play", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/balance"] });
    },
  });

  const cashoutMutation = useMutation({
    mutationFn: async (data: { currencyType: string; betAmount: number; tilesRevealed: number; mineCount: number; gridSize: number }) => {
      const res = await apiRequest("POST", "/api/sweeps/minesweeper/cashout", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sweeps/balance"] });
    },
  });

  const formatNumber = (num: string | number) => {
    return parseFloat(num.toString()).toLocaleString();
  };

  const getBalance = () => {
    if (!currentBalance) return 0;
    return parseFloat(currencyType === "GC" ? currentBalance.goldCoins : currentBalance.sweepsCoins);
  };

  const startNewGame = useCallback(() => {
    setGameState(createGame(difficulty));
    setElapsedTime(0);
  }, [difficulty]);

  const startSweepsGame = async () => {
    const bal = getBalance();
    if (bal < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${formatNumber(betAmount)} ${currencyType} to play`,
        variant: "destructive",
      });
      return;
    }

    if (mineCount >= gridSize * gridSize) {
      toast({
        title: "Invalid Settings",
        description: "Too many mines for the grid size",
        variant: "destructive",
      });
      return;
    }

    if (isDemo) {
      const totalTiles = gridSize * gridSize;
      const positions: number[] = [];
      while (positions.length < mineCount) {
        const pos = Math.floor(Math.random() * totalTiles);
        if (!positions.includes(pos)) positions.push(pos);
      }

      const tiles: SweepsTile[] = Array.from({ length: totalTiles }, (_, i) => ({
        index: i,
        revealed: false,
        isMine: positions.includes(i),
      }));

      setDemoBalance(prev => {
        const key = currencyType === "GC" ? "goldCoins" : "sweepsCoins";
        const newVal = parseFloat(prev[key]) - betAmount;
        return { ...prev, [key]: String(Math.max(0, newVal)) };
      });

      setSweepsGame({
        status: "playing",
        gridSize,
        mineCount,
        tiles,
        minePositions: positions,
        serverSeedHash: "demo",
        tilesRevealed: 0,
        betAmount,
        currencyType,
      });
    } else {
      try {
        const response = await playMutation.mutateAsync({
          gameType: "minesweeper",
          currencyType,
          betAmount,
          gridSize,
          mineCount,
        });

        const { minePositions, serverSeedHash } = response.gameResult;
        const totalTiles = gridSize * gridSize;

        const tiles: SweepsTile[] = Array.from({ length: totalTiles }, (_, i) => ({
          index: i,
          revealed: false,
          isMine: minePositions.includes(i),
        }));

        setSweepsGame({
          status: "playing",
          gridSize,
          mineCount,
          tiles,
          minePositions,
          serverSeedHash,
          tilesRevealed: 0,
          betAmount,
          currencyType,
        });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "Failed to start game",
          variant: "destructive",
        });
      }
    }
  };

  const handleSweepsTileClick = (index: number) => {
    if (!sweepsGame || sweepsGame.status !== "playing") return;

    const tile = sweepsGame.tiles[index];
    if (tile.revealed) return;

    const newTiles = sweepsGame.tiles.map((t, i) =>
      i === index ? { ...t, revealed: true } : t
    );

    if (tile.isMine) {
      const revealedTiles = newTiles.map(t =>
        t.isMine ? { ...t, revealed: true } : t
      );
      setSweepsGame({
        ...sweepsGame,
        tiles: revealedTiles,
        status: "lost",
      });
      toast({
        title: "Game Over 💥",
        description: `You hit a mine! Lost ${formatNumber(sweepsGame.betAmount)} ${sweepsGame.currencyType}`,
        variant: "destructive",
      });
    } else {
      const newRevealed = sweepsGame.tilesRevealed + 1;
      const totalSafe = gridSize * gridSize - sweepsGame.mineCount;

      if (newRevealed >= totalSafe) {
        setSweepsGame({
          ...sweepsGame,
          tiles: newTiles,
          tilesRevealed: newRevealed,
          status: "won",
        });
        handleCashout({ ...sweepsGame, tilesRevealed: newRevealed });
      } else {
        setSweepsGame({
          ...sweepsGame,
          tiles: newTiles,
          tilesRevealed: newRevealed,
        });
      }
    }
  };

  const handleCashout = async (overrideState?: SweepsGameState) => {
    const game = overrideState || sweepsGame;
    if (!game || game.tilesRevealed === 0) return;

    if (isDemo) {
      const multiplier = calculateMultiplier(game.tilesRevealed, game.mineCount, game.gridSize);
      const payout = game.betAmount * multiplier;
      const profit = payout - game.betAmount;

      setDemoBalance(prev => {
        const key = game.currencyType === "GC" ? "goldCoins" : "sweepsCoins";
        const newVal = parseFloat(prev[key]) + payout;
        return { ...prev, [key]: String(Math.max(0, newVal)) };
      });

      setSweepsGame(prev => prev ? { ...prev, status: "cashedOut" } : null);
      toast({
        title: "Cashed Out! 💰",
        description: `${multiplier}x multiplier! +${formatNumber(profit)} ${game.currencyType} profit`,
      });
    } else {
      try {
        const response = await cashoutMutation.mutateAsync({
          currencyType: game.currencyType,
          betAmount: game.betAmount,
          tilesRevealed: game.tilesRevealed,
          mineCount: game.mineCount,
          gridSize: game.gridSize,
        });

        setSweepsGame(prev => prev ? { ...prev, status: "cashedOut" } : null);
        toast({
          title: "Cashed Out! 💰",
          description: `${response.multiplier}x multiplier! +${formatNumber(response.profit)} ${game.currencyType} profit`,
        });
      } catch (err: any) {
        toast({
          title: "Cashout Failed",
          description: err?.message || "Failed to cash out",
          variant: "destructive",
        });
      }
    }
  };

  const resetSweepsGame = () => {
    setSweepsGame(null);
  };

  // Timer for demo/classic mode
  useEffect(() => {
    if (!gameState || gameState.status !== "playing" || !gameState.startTime) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - gameState.startTime!);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState?.status, gameState?.startTime]);

  // Show result toast for demo/classic mode
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

  if (sweepsGame) {
    const currentMultiplier = sweepsGame.tilesRevealed > 0
      ? calculateMultiplier(sweepsGame.tilesRevealed, sweepsGame.mineCount, sweepsGame.gridSize)
      : 1;
    const potentialPayout = sweepsGame.betAmount * currentMultiplier;
    const nextMultiplier = calculateMultiplier(sweepsGame.tilesRevealed + 1, sweepsGame.mineCount, sweepsGame.gridSize);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
        <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-bold">Minesweeper</h1>
                <p className="text-xs text-gray-400">
                  {sweepsGame.gridSize}×{sweepsGame.gridSize} • {sweepsGame.mineCount} mines
                  {isDemo && " (Demo)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-teal-500/50 text-teal-400" data-testid="badge-bet">
                Bet: {formatNumber(sweepsGame.betAmount)} {sweepsGame.currencyType}
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400" data-testid="badge-multiplier">
                {currentMultiplier}x
              </Badge>
              <Button variant="ghost" size="icon" onClick={resetSweepsGame} className="hover:bg-white/10" data-testid="button-reset-sweeps">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {sweepsGame.status !== "playing" && (
          <div className={`text-center py-3 ${sweepsGame.status === "lost" ? "bg-red-600/30" : "bg-green-600/30"}`}>
            <div className="flex items-center justify-center gap-2">
              {sweepsGame.status === "lost" ? (
                <>
                  <Skull className="w-5 h-5 text-red-400" />
                  <span className="font-bold">Game Over! Lost {formatNumber(sweepsGame.betAmount)} {sweepsGame.currencyType}</span>
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5 text-teal-400" />
                  <span className="font-bold">Cashed Out! {currentMultiplier}x = {formatNumber(potentialPayout)} {sweepsGame.currencyType}</span>
                </>
              )}
              <Button size="sm" variant="outline" onClick={resetSweepsGame} className="ml-4" data-testid="button-play-again-sweeps">
                Play Again
              </Button>
            </div>
          </div>
        )}

        {sweepsGame.status === "playing" && sweepsGame.tilesRevealed > 0 && (
          <div className="text-center py-3 bg-green-600/20">
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-gray-300">
                {sweepsGame.tilesRevealed} tiles revealed • Next: {nextMultiplier}x
              </span>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-500"
                onClick={() => handleCashout()}
                disabled={cashoutMutation.isPending}
                data-testid="button-cashout"
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Cash Out ({formatNumber(potentialPayout)} {sweepsGame.currencyType})
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 flex justify-center">
          <div
            className="inline-grid gap-1 p-3 bg-black/30 rounded-lg"
            style={{
              gridTemplateColumns: `repeat(${sweepsGame.gridSize}, 1fr)`,
            }}
          >
            {sweepsGame.tiles.map((tile) => (
              <SweepsTileCell
                key={tile.index}
                tile={tile}
                onClick={() => handleSweepsTileClick(tile.index)}
                gameStatus={sweepsGame.status}
                gridSize={sweepsGame.gridSize}
              />
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pb-4">
          Click tiles to reveal • Avoid the mines • Cash out anytime
        </div>
      </div>
    );
  }

  if (gameState) {
    const settings = DIFFICULTY_SETTINGS[difficulty];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
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
                  <Trophy className="w-5 h-5 text-teal-400" />
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

  const validMineOptions = MINE_OPTIONS.filter(m => m < gridSize * gridSize - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold">Minesweeper</h1>
        </div>

        {isDemo && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 mb-6 text-center text-sm">
            <p className="text-purple-200">
              <Sparkles className="w-4 h-4 inline mr-1" />
              <strong>Demo Mode</strong> - Playing with free demo coins!{" "}
              <button onClick={() => setShowLoginModal(true)} className="underline ml-2 text-purple-200 hover:text-white" data-testid="button-sign-up">Sign up</button> to save your winnings.
            </p>
          </div>
        )}
        <SimpleLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        {currentBalance && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${currencyType === 'GC' ? 'bg-teal-500/20 ring-2 ring-teal-400/50' : 'bg-black/30 hover:bg-black/40'}`}
              onClick={() => setCurrencyType("GC")}
              data-testid="select-currency-gc"
            >
              <Coins className="w-5 h-5 text-teal-400" />
              <div>
                <div className="text-xs text-teal-400/80">Gold Coins {isDemo && "(Demo)"}</div>
                <div className="text-lg font-bold text-teal-400">{formatNumber(currentBalance.goldCoins)}</div>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all ${currencyType === 'SC' ? 'bg-green-500/20 ring-2 ring-green-400/50' : 'bg-black/30 hover:bg-black/40'}`}
              onClick={() => setCurrencyType("SC")}
              data-testid="select-currency-sc"
            >
              <Sparkles className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-xs text-green-400/80">Sweeps Coins {isDemo && "(Demo)"}</div>
                <div className="text-lg font-bold text-green-400">{parseFloat(currentBalance.sweepsCoins).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        <Card className="bg-black/40 border-white/20 backdrop-blur-xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bomb className="w-6 h-6 text-red-400" />
              Sweepstakes Minesweeper
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Grid Size</label>
                <Select value={String(gridSize)} onValueChange={(v) => {
                  const newSize = parseInt(v);
                  setGridSize(newSize);
                  if (mineCount >= newSize * newSize - 1) {
                    setMineCount(Math.max(1, newSize * newSize - 2));
                  }
                }}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-grid-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3×3</SelectItem>
                    <SelectItem value="4">4×4</SelectItem>
                    <SelectItem value="5">5×5</SelectItem>
                    <SelectItem value="6">6×6</SelectItem>
                    <SelectItem value="7">7×7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Mines</label>
                <Select value={String(mineCount)} onValueChange={(v) => setMineCount(parseInt(v))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-mine-count">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validMineOptions.map(m => (
                      <SelectItem key={m} value={String(m)}>{m} mines</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Bet Amount ({currencyType})</label>
              <div className="grid grid-cols-4 gap-2">
                {BET_OPTIONS.map(amount => (
                  <Button
                    key={amount}
                    variant={betAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBetAmount(amount)}
                    className={betAmount === amount ? "bg-red-600 hover:bg-red-500" : "border-white/20 text-white hover:bg-white/10"}
                    data-testid={`button-bet-${amount}`}
                  >
                    {formatNumber(amount)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
              <h4 className="font-bold text-white mb-2">How to Play:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Choose grid size, mine count, and bet amount</li>
                <li>Click tiles to reveal them — avoid mines!</li>
                <li>Each safe tile increases your multiplier</li>
                <li>Cash out anytime to lock in your winnings</li>
              </ul>
            </div>

            <Button
              onClick={startSweepsGame}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-6 text-lg"
              disabled={playMutation.isPending}
              data-testid="button-start-sweeps"
            >
              <Bomb className="w-5 h-5 mr-2" />
              {playMutation.isPending ? "Starting..." : `Play for ${formatNumber(betAmount)} ${currencyType}`}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              Classic Minesweeper (Free Play)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Difficulty</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (9×9, 10 mines)</SelectItem>
                  <SelectItem value="medium">Medium (16×16, 40 mines)</SelectItem>
                  <SelectItem value="hard">Hard (16×30, 99 mines)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={startNewGame} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 text-lg" data-testid="button-start-classic">
              <Target className="w-5 h-5 mr-2" />
              Play Classic
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
