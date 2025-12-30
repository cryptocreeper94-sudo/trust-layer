import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trophy, Settings, RotateCcw, Play, Info, Volume2, VolumeX, Star, Crown } from "lucide-react";
import { BackButton } from "@/components/page-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  GameState,
  Card as GameCard,
  Player,
  createInitialGameState,
  getValidPlays,
  getAIBid,
  getAIPlay,
  determineTrickWinner,
  calculateRoundScore,
  dealCards,
  getTeamBid,
  sortHand,
} from "@/lib/spades-engine";

const SUIT_SYMBOLS: Record<string, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

const SUIT_COLORS: Record<string, string> = {
  spades: "text-gray-900",
  hearts: "text-red-500",
  diamonds: "text-red-500",
  clubs: "text-gray-900",
};

function PlayingCard({ 
  card, 
  onClick, 
  disabled, 
  selected,
  small = false,
  faceDown = false,
}: { 
  card: GameCard; 
  onClick?: () => void; 
  disabled?: boolean;
  selected?: boolean;
  small?: boolean;
  faceDown?: boolean;
}) {
  if (faceDown) {
    return (
      <div className={`
        ${small ? 'w-8 h-12' : 'w-16 h-24 md:w-20 md:h-28'}
        rounded-lg bg-gradient-to-br from-blue-800 to-purple-900 border-2 border-white/30
        shadow-lg flex items-center justify-center
      `}>
        <div className="w-3/4 h-3/4 border border-white/20 rounded-sm bg-gradient-to-br from-purple-600/50 to-blue-600/50" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -10, scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        ${small ? 'w-12 h-16' : 'w-16 h-24 md:w-20 md:h-28'}
        rounded-lg bg-white border-2 shadow-lg flex flex-col items-center justify-center
        transition-all cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
        ${selected ? 'ring-2 ring-yellow-400 -translate-y-2' : ''}
        ${card.suit === "spades" ? 'border-gray-400' : 'border-gray-300'}
      `}
      data-testid={`card-${card.suit}-${card.rank}`}
    >
      <span className={`text-lg md:text-xl font-bold ${SUIT_COLORS[card.suit]}`}>
        {card.rank}
      </span>
      <span className={`text-2xl md:text-3xl ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </span>
    </motion.button>
  );
}

function PlayerArea({ 
  player, 
  position, 
  isCurrentTurn, 
  showCards = false,
  trickCard,
}: { 
  player: Player;
  position: "south" | "west" | "north" | "east";
  isCurrentTurn: boolean;
  showCards?: boolean;
  trickCard?: GameCard;
}) {
  const positionStyles = {
    south: "bottom-4 left-1/2 -translate-x-1/2 flex-col",
    north: "top-20 left-1/2 -translate-x-1/2 flex-col-reverse",
    west: "left-2 top-1/2 -translate-y-1/2 flex-row",
    east: "right-2 top-1/2 -translate-y-1/2 flex-row-reverse",
  };

  const cardPositionStyles = {
    south: "bottom-36 left-1/2 -translate-x-1/2",
    north: "top-36 left-1/2 -translate-x-1/2",
    west: "left-24 top-1/2 -translate-y-1/2",
    east: "right-24 top-1/2 -translate-y-1/2",
  };

  return (
    <>
      {/* Player info */}
      <div className={`absolute ${positionStyles[position]} flex items-center gap-2 z-10`}>
        <div className={`
          px-3 py-2 rounded-xl backdrop-blur-sm
          ${isCurrentTurn ? 'bg-yellow-500/30 ring-2 ring-yellow-400' : 'bg-black/40'}
        `}>
          <div className="flex items-center gap-2">
            {player.isAI ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="text-white">
              <div className="font-bold text-sm">{player.name}</div>
              <div className="text-xs text-gray-300">
                {player.bid !== null ? `Bid: ${player.bid}` : "..."} | Won: {player.tricksWon}
              </div>
            </div>
          </div>
        </div>
        
        {/* Cards in hand indicator for AI */}
        {player.isAI && !showCards && (
          <div className="flex -space-x-3">
            {player.hand.slice(0, Math.min(5, player.hand.length)).map((_, i) => (
              <PlayingCard key={i} card={{ suit: "spades", rank: "A" }} faceDown small />
            ))}
            {player.hand.length > 5 && (
              <span className="text-white text-xs bg-black/50 rounded-full px-2 py-1 ml-2">
                +{player.hand.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Trick card played */}
      <AnimatePresence>
        {trickCard && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute ${cardPositionStyles[position]} z-20`}
          >
            <PlayingCard card={trickCard} disabled />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Spades() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<GameCard | null>(null);
  const [playerBid, setPlayerBid] = useState<number>(3);
  const [showRules, setShowRules] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [showTrickResult, setShowTrickResult] = useState(false);

  const playerName = user?.firstName || "You";

  const startNewGame = useCallback(() => {
    const newState = createInitialGameState(playerName, difficulty);
    setGameState(newState);
    setSelectedCard(null);
    setShowTrickResult(false);
  }, [playerName, difficulty]);

  // Handle AI bidding
  useEffect(() => {
    if (!gameState || gameState.status !== "bidding") return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer.isAI) return;
    
    const timer = setTimeout(() => {
      const bid = getAIBid(currentPlayer, gameState.difficulty);
      
      setGameState(prev => {
        if (!prev || prev.status !== "bidding") return prev;
        const newPlayers = [...prev.players];
        const currentIdx = prev.currentPlayerIndex;
        
        // Make sure we're still on the same AI player
        if (!newPlayers[currentIdx].isAI || newPlayers[currentIdx].bid !== null) return prev;
        
        newPlayers[currentIdx] = { ...newPlayers[currentIdx], bid };
        
        const nextIndex = (currentIdx + 1) % 4;
        const allBid = newPlayers.every(p => p.bid !== null);
        
        return {
          ...prev,
          players: newPlayers,
          currentPlayerIndex: nextIndex,
          status: allBid ? "playing" : "bidding",
        };
      });
    }, 800);
    
    return () => clearTimeout(timer);
  }, [gameState?.status, gameState?.currentPlayerIndex]);

  // Handle AI playing
  useEffect(() => {
    if (!gameState || gameState.status !== "playing" || showTrickResult) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (!currentPlayer.isAI) return;
    
    const timer = setTimeout(() => {
      const card = getAIPlay(currentPlayer, gameState.currentTrick, gameState, gameState.difficulty);
      playCard(card, currentPlayer);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [gameState?.status, gameState?.currentPlayerIndex, gameState?.trickNumber, showTrickResult]);

  const submitBid = () => {
    if (!gameState) return;
    
    setGameState(prev => {
      if (!prev) return null;
      const newPlayers = [...prev.players];
      newPlayers[0] = { ...newPlayers[0], bid: playerBid };
      
      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: 1,
      };
    });
  };

  const playCard = (card: GameCard, player?: Player) => {
    if (!gameState) return;
    
    const currentPlayer = player || gameState.players[gameState.currentPlayerIndex];
    
    setGameState(prev => {
      if (!prev) return null;
      
      const newPlayers = [...prev.players];
      const playerIndex = newPlayers.findIndex(p => p.id === currentPlayer.id);
      newPlayers[playerIndex] = {
        ...currentPlayer,
        hand: currentPlayer.hand.filter(c => !(c.suit === card.suit && c.rank === card.rank)),
      };
      
      const newTrick = {
        ...prev.currentTrick,
        cards: [...prev.currentTrick.cards, { playerId: currentPlayer.id, card }],
        leadSuit: prev.currentTrick.cards.length === 0 ? card.suit : prev.currentTrick.leadSuit,
      };
      
      const spadeBroken = prev.spadeBroken || card.suit === "spades";
      
      // Check if trick is complete
      if (newTrick.cards.length === 4) {
        const winnerId = determineTrickWinner(newTrick);
        const winnerIndex = newPlayers.findIndex(p => p.id === winnerId);
        newPlayers[winnerIndex] = {
          ...newPlayers[winnerIndex],
          tricksWon: newPlayers[winnerIndex].tricksWon + 1,
        };
        
        const team1Tricks = newPlayers
          .filter(p => p.teamNumber === 1)
          .reduce((sum, p) => sum + p.tricksWon, 0);
        const team2Tricks = newPlayers
          .filter(p => p.teamNumber === 2)
          .reduce((sum, p) => sum + p.tricksWon, 0);
        
        // Show trick result briefly
        setShowTrickResult(true);
        setTimeout(() => {
          setShowTrickResult(false);
          
          // Check if round is over
          if (prev.trickNumber === 13) {
            // Calculate scores
            const team1Bid = getTeamBid(newPlayers, 1);
            const team2Bid = getTeamBid(newPlayers, 2);
            
            const team1Result = calculateRoundScore(team1Bid, team1Tricks, prev.team1Bags);
            const team2Result = calculateRoundScore(team2Bid, team2Tricks, prev.team2Bags);
            
            const newTeam1Score = prev.team1Score + team1Result.points - (team1Result.bagPenalty ? 100 : 0);
            const newTeam2Score = prev.team2Score + team2Result.points - (team2Result.bagPenalty ? 100 : 0);
            
            const roundResult = {
              round: prev.currentRound,
              team1Bid,
              team2Bid,
              team1Tricks,
              team2Tricks,
              team1Points: team1Result.points,
              team2Points: team2Result.points,
            };
            
            // Check for game winner
            let winner: 1 | 2 | null = null;
            if (newTeam1Score >= prev.targetScore || newTeam2Score >= prev.targetScore) {
              winner = newTeam1Score >= newTeam2Score ? 1 : 2;
            }
            
            if (winner) {
              setGameState(gs => gs ? {
                ...gs,
                players: newPlayers,
                team1Score: newTeam1Score,
                team2Score: newTeam2Score,
                team1Bags: team1Result.newBags,
                team2Bags: team2Result.newBags,
                roundHistory: [...gs.roundHistory, roundResult],
                status: "gameOver",
                winner,
              } : null);
            } else {
              // Start new round
              const resetPlayers = dealCards(newPlayers.map(p => ({ ...p, bid: null, tricksWon: 0 })));
              setGameState(gs => gs ? {
                ...gs,
                players: resetPlayers,
                currentPlayerIndex: 0,
                currentRound: gs.currentRound + 1,
                currentTrick: { cards: [], leadSuit: null, winnerId: null },
                trickNumber: 1,
                spadeBroken: false,
                team1Score: newTeam1Score,
                team2Score: newTeam2Score,
                team1Bags: team1Result.newBags,
                team2Bags: team2Result.newBags,
                team1RoundTricks: 0,
                team2RoundTricks: 0,
                lastTrick: null,
                roundHistory: [...gs.roundHistory, roundResult],
                status: "bidding",
              } : null);
            }
          } else {
            // Next trick
            setGameState(gs => gs ? {
              ...gs,
              players: newPlayers,
              currentPlayerIndex: winnerIndex,
              currentTrick: { cards: [], leadSuit: null, winnerId: null },
              trickNumber: gs.trickNumber + 1,
              spadeBroken,
              team1RoundTricks: team1Tricks,
              team2RoundTricks: team2Tricks,
              lastTrick: { ...newTrick, winnerId },
            } : null);
          }
        }, 1500);
        
        return {
          ...prev,
          players: newPlayers,
          currentTrick: { ...newTrick, winnerId },
          spadeBroken,
          team1RoundTricks: team1Tricks,
          team2RoundTricks: team2Tricks,
        };
      }
      
      return {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: (prev.currentPlayerIndex + 1) % 4,
        currentTrick: newTrick,
        spadeBroken,
      };
    });
    
    setSelectedCard(null);
  };

  const handleCardClick = (card: GameCard) => {
    if (!gameState || gameState.status !== "playing") return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isAI) return;
    
    const validPlays = getValidPlays(currentPlayer.hand, gameState.currentTrick, gameState.spadeBroken);
    const isValid = validPlays.some(c => c.suit === card.suit && c.rank === card.rank);
    
    if (!isValid) {
      toast({
        title: "Invalid Play",
        description: gameState.currentTrick.leadSuit 
          ? `You must follow ${gameState.currentTrick.leadSuit} if possible`
          : "You can't lead with spades until they're broken",
        variant: "destructive",
      });
      return;
    }
    
    playCard(card, currentPlayer);
  };

  const getTrickCardForPosition = (position: number) => {
    if (!gameState) return undefined;
    const play = gameState.currentTrick.cards.find(p => {
      const player = gameState.players.find(pl => pl.id === p.playerId);
      return player?.seatPosition === position;
    });
    return play?.card;
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <BackButton />
            <h1 className="text-3xl font-bold">Spades</h1>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                New Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Difficulty</label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2">Quick Rules:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>You and your partner (North) vs East & West</li>
                  <li>Bid the number of tricks you think you'll win</li>
                  <li>Spades are always trump</li>
                  <li>First to 500 points wins!</li>
                </ul>
              </div>

              <Button onClick={startNewGame} className="w-full bg-green-600 hover:bg-green-500 text-white py-6 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const player = gameState.players[0];
  const validPlays = gameState.status === "playing" && gameState.currentPlayerIndex === 0
    ? getValidPlays(player.hand, gameState.currentTrick, gameState.spadeBroken)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-black/30 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="font-bold">Spades</h1>
              <p className="text-xs text-gray-300">Round {gameState.currentRound} • Trick {gameState.trickNumber}/13</p>
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-green-400">Your Team</div>
              <div className="font-bold text-lg">{gameState.team1Score}</div>
              <div className="text-xs text-gray-400">Bags: {gameState.team1Bags}</div>
            </div>
            <div className="text-2xl text-gray-500">vs</div>
            <div className="text-center">
              <div className="text-xs text-red-400">Opponents</div>
              <div className="font-bold text-lg">{gameState.team2Score}</div>
              <div className="text-xs text-gray-400">Bags: {gameState.team2Bags}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="hover:bg-white/10">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowRules(!showRules)} className="hover:bg-white/10">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={startNewGame} className="hover:bg-white/10">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Game Table */}
      <div className="relative w-full h-screen pt-16">
        <div className="absolute inset-8 md:inset-16 rounded-[50%] bg-green-700/50 border-8 border-amber-900/50 shadow-inner" />
        
        {/* Players */}
        <PlayerArea 
          player={gameState.players[0]} 
          position="south" 
          isCurrentTurn={gameState.currentPlayerIndex === 0}
          showCards
          trickCard={getTrickCardForPosition(0)}
        />
        <PlayerArea 
          player={gameState.players[1]} 
          position="west" 
          isCurrentTurn={gameState.currentPlayerIndex === 1}
          trickCard={getTrickCardForPosition(1)}
        />
        <PlayerArea 
          player={gameState.players[2]} 
          position="north" 
          isCurrentTurn={gameState.currentPlayerIndex === 2}
          trickCard={getTrickCardForPosition(2)}
        />
        <PlayerArea 
          player={gameState.players[3]} 
          position="east" 
          isCurrentTurn={gameState.currentPlayerIndex === 3}
          trickCard={getTrickCardForPosition(3)}
        />

        {/* Center Info */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          {gameState.status === "bidding" && gameState.currentPlayerIndex === 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/70 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4">Your Bid</h3>
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPlayerBid(Math.max(0, playerBid - 1))}
                  className="border-white/20"
                >
                  -
                </Button>
                <span className="text-4xl font-bold w-16">{playerBid}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setPlayerBid(Math.min(13, playerBid + 1))}
                  className="border-white/20"
                >
                  +
                </Button>
              </div>
              <Button onClick={submitBid} className="bg-green-600 hover:bg-green-500">
                Submit Bid
              </Button>
            </motion.div>
          )}

          {showTrickResult && gameState.currentTrick.winnerId && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/70 backdrop-blur-sm rounded-2xl p-4"
            >
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="font-bold">
                {gameState.players.find(p => p.id === gameState.currentTrick.winnerId)?.name} wins!
              </p>
            </motion.div>
          )}
        </div>

        {/* Player's Hand */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex justify-center -space-x-4 md:-space-x-2">
            {player.hand.map((card, index) => {
              const isValid = validPlays.some(c => c.suit === card.suit && c.rank === card.rank);
              return (
                <motion.div
                  key={`${card.suit}-${card.rank}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PlayingCard
                    card={card}
                    onClick={() => handleCardClick(card)}
                    disabled={gameState.status !== "playing" || gameState.currentPlayerIndex !== 0 || !isValid}
                    selected={selectedCard?.suit === card.suit && selectedCard?.rank === card.rank}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState.status === "gameOver" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`
                rounded-3xl p-8 max-w-md w-full text-center border-2
                ${gameState.winner === 1 
                  ? 'bg-gradient-to-br from-green-900 to-emerald-900 border-green-500/50' 
                  : 'bg-gradient-to-br from-red-900 to-rose-900 border-red-500/50'}
              `}
            >
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${gameState.winner === 1 ? 'text-yellow-400' : 'text-gray-400'}`} />
              <h2 className="text-3xl font-bold mb-2">
                {gameState.winner === 1 ? "Victory!" : "Defeat"}
              </h2>
              <p className="text-gray-300 mb-4">
                {gameState.winner === 1 
                  ? "You and your partner won!" 
                  : "Better luck next time!"}
              </p>
              <div className="flex justify-center gap-8 mb-6">
                <div>
                  <div className="text-sm text-gray-400">Your Team</div>
                  <div className="text-2xl font-bold text-green-400">{gameState.team1Score}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Opponents</div>
                  <div className="text-2xl font-bold text-red-400">{gameState.team2Score}</div>
                </div>
              </div>
              <Button onClick={startNewGame} className="bg-white text-gray-900 hover:bg-gray-200">
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
