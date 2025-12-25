import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Undo2, Lightbulb, Play, Trophy, Clock, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  GameState,
  Card as GameCard,
  createInitialState,
  drawFromStock,
  moveCards,
  undo,
  getHints,
  autoComplete,
  getSuitSymbol,
  getSuitColor,
  isRed,
} from "@/lib/solitaire-engine";

function PlayingCard({
  card,
  onClick,
  onDoubleClick,
  isDragging,
  isHinted,
  small = false,
}: {
  card: GameCard;
  onClick?: () => void;
  onDoubleClick?: () => void;
  isDragging?: boolean;
  isHinted?: boolean;
  small?: boolean;
}) {
  if (!card.faceUp) {
    return (
      <div
        className={`
          ${small ? "w-12 h-16" : "w-14 h-20 md:w-16 md:h-24"}
          rounded-lg bg-gradient-to-br from-blue-800 to-purple-900 border-2 border-white/30
          shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow
        `}
        onClick={onClick}
      >
        <div className="w-3/4 h-3/4 border border-white/20 rounded-sm bg-gradient-to-br from-purple-600/50 to-blue-600/50" />
      </div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      whileHover={{ y: -2 }}
      className={`
        ${small ? "w-12 h-16" : "w-14 h-20 md:w-16 md:h-24"}
        rounded-lg bg-white border-2 shadow-lg flex flex-col items-start justify-start p-1
        cursor-pointer hover:shadow-xl transition-all select-none
        ${isDragging ? "opacity-50" : ""}
        ${isHinted ? "ring-2 ring-yellow-400 animate-pulse" : ""}
        ${isRed(card.suit) ? "border-red-200" : "border-gray-300"}
      `}
      data-testid={`card-${card.id}`}
    >
      <span className={`text-xs md:text-sm font-bold ${getSuitColor(card.suit)}`}>
        {card.rank}
      </span>
      <span className={`text-sm md:text-lg ${getSuitColor(card.suit)}`}>
        {getSuitSymbol(card.suit)}
      </span>
    </motion.div>
  );
}

function EmptyPile({ onClick, label }: { onClick?: () => void; label?: string }) {
  return (
    <div
      onClick={onClick}
      className="w-14 h-20 md:w-16 md:h-24 rounded-lg border-2 border-dashed border-white/30 
        flex items-center justify-center cursor-pointer hover:border-white/50 transition-colors"
    >
      {label && <span className="text-xs text-white/50">{label}</span>}
    </div>
  );
}

function TableauPile({
  cards,
  pileIndex,
  onCardClick,
  onCardDoubleClick,
  hintedCardId,
}: {
  cards: GameCard[];
  pileIndex: number;
  onCardClick: (cardIndex: number) => void;
  onCardDoubleClick: (cardIndex: number) => void;
  hintedCardId?: string;
}) {
  if (cards.length === 0) {
    return <EmptyPile label="K" />;
  }

  return (
    <div className="relative" style={{ minHeight: `${80 + cards.length * 20}px` }}>
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="absolute left-0"
          style={{ top: `${index * 20}px`, zIndex: index }}
        >
          <PlayingCard
            card={card}
            onClick={() => onCardClick(index)}
            onDoubleClick={() => onCardDoubleClick(index)}
            isHinted={card.id === hintedCardId}
          />
        </div>
      ))}
    </div>
  );
}

export default function Solitaire() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ type: string; index?: number; cardIndex?: number } | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hintedCard, setHintedCard] = useState<string | null>(null);

  const startNewGame = useCallback(() => {
    setGameState(createInitialState());
    setSelectedCard(null);
    setElapsedTime(0);
    setHintedCard(null);
  }, []);

  // Timer
  useEffect(() => {
    if (!gameState || gameState.status !== "playing") return;
    
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - gameState.startTime);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState?.status, gameState?.startTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStockClick = () => {
    if (!gameState) return;
    setGameState(drawFromStock(gameState));
    setSelectedCard(null);
    setHintedCard(null);
  };

  const handleWasteClick = () => {
    if (!gameState || gameState.waste.length === 0) return;
    setSelectedCard({ type: "waste" });
    setHintedCard(null);
  };

  const handleWasteDoubleClick = () => {
    if (!gameState || gameState.waste.length === 0) return;
    
    // Try to auto-move to foundation
    const card = gameState.waste[gameState.waste.length - 1];
    for (let i = 0; i < 4; i++) {
      const result = moveCards(gameState, { type: "waste" }, { type: "foundation", index: i });
      if (result) {
        setGameState(result);
        setSelectedCard(null);
        return;
      }
    }
  };

  const handleFoundationClick = (index: number) => {
    if (!gameState || !selectedCard) return;
    
    const result = moveCards(
      gameState,
      selectedCard as any,
      { type: "foundation", index }
    );
    
    if (result) {
      setGameState(result);
      if (result.status === "won") {
        toast({ title: "Congratulations!", description: "You won the game!" });
      }
    }
    setSelectedCard(null);
    setHintedCard(null);
  };

  const handleTableauCardClick = (pileIndex: number, cardIndex: number) => {
    if (!gameState) return;
    
    const pile = gameState.tableau[pileIndex];
    const card = pile[cardIndex];
    
    if (!card.faceUp) return;
    
    if (selectedCard) {
      // Try to move selected card(s) here
      const result = moveCards(
        gameState,
        selectedCard as any,
        { type: "tableau", index: pileIndex }
      );
      
      if (result) {
        setGameState(result);
      }
      setSelectedCard(null);
    } else {
      // Select this card
      setSelectedCard({ type: "tableau", index: pileIndex, cardIndex });
    }
    setHintedCard(null);
  };

  const handleTableauCardDoubleClick = (pileIndex: number, cardIndex: number) => {
    if (!gameState) return;
    
    const pile = gameState.tableau[pileIndex];
    if (cardIndex !== pile.length - 1) return; // Only top card
    
    const card = pile[cardIndex];
    if (!card.faceUp) return;
    
    // Try to auto-move to foundation
    for (let i = 0; i < 4; i++) {
      const result = moveCards(
        gameState,
        { type: "tableau", index: pileIndex, cardIndex },
        { type: "foundation", index: i }
      );
      if (result) {
        setGameState(result);
        return;
      }
    }
  };

  const handleUndo = () => {
    if (!gameState) return;
    const prev = undo(gameState);
    if (prev) {
      setGameState(prev);
      setSelectedCard(null);
      setHintedCard(null);
    }
  };

  const handleHint = () => {
    if (!gameState) return;
    const hints = getHints(gameState);
    if (hints.length > 0) {
      const hint = hints[0];
      toast({ title: "Hint", description: hint.description });
      
      // Highlight the source card
      if (hint.from.type === "waste" && gameState.waste.length > 0) {
        setHintedCard(gameState.waste[gameState.waste.length - 1].id);
      } else if (hint.from.type === "tableau") {
        const pile = gameState.tableau[hint.from.index];
        if (pile[hint.from.cardIndex]) {
          setHintedCard(pile[hint.from.cardIndex].id);
        }
      }
    } else {
      toast({ title: "No hints", description: "Try drawing from the stock" });
    }
  };

  const handleAutoComplete = () => {
    if (!gameState) return;
    const completed = autoComplete(gameState);
    setGameState(completed);
    if (completed.status === "won") {
      toast({ title: "Congratulations!", description: "You won the game!" });
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold">Solitaire</h1>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-green-400" />
                Klondike Solitaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2">How to Play:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Build foundation piles from Ace to King by suit</li>
                  <li>Stack cards in tableau by alternating colors (K to A)</li>
                  <li>Click stock pile to draw new cards</li>
                  <li>Double-click to auto-move to foundations</li>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-x-auto">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/arcade")} className="hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-bold">Solitaire</h1>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatTime(elapsedTime)}
                </span>
                <span>Moves: {gameState.moves}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} className="hover:bg-white/10" disabled={gameState.history.length === 0}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleHint} className="hover:bg-white/10">
              <Lightbulb className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleAutoComplete} className="hover:bg-white/10 text-xs">
              <Sparkles className="w-4 h-4 mr-1" /> Auto
            </Button>
            <Button variant="ghost" size="icon" onClick={startNewGame} className="hover:bg-white/10">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="p-4 max-w-6xl mx-auto">
        {/* Top row: Stock, Waste, Foundations */}
        <div className="flex justify-between mb-8">
          {/* Stock and Waste */}
          <div className="flex gap-2">
            {/* Stock */}
            {gameState.stock.length > 0 ? (
              <div onClick={handleStockClick} className="cursor-pointer">
                <PlayingCard card={{ ...gameState.stock[0], faceUp: false } as GameCard} />
              </div>
            ) : (
              <EmptyPile onClick={handleStockClick} label="↻" />
            )}
            
            {/* Waste */}
            {gameState.waste.length > 0 ? (
              <div
                onClick={handleWasteClick}
                onDoubleClick={handleWasteDoubleClick}
                className={selectedCard?.type === "waste" ? "ring-2 ring-yellow-400 rounded-lg" : ""}
              >
                <PlayingCard
                  card={gameState.waste[gameState.waste.length - 1]}
                  isHinted={hintedCard === gameState.waste[gameState.waste.length - 1].id}
                />
              </div>
            ) : (
              <EmptyPile />
            )}
          </div>

          {/* Foundations */}
          <div className="flex gap-2">
            {gameState.foundations.map((foundation, index) => (
              <div key={index} onClick={() => handleFoundationClick(index)}>
                {foundation.length > 0 ? (
                  <PlayingCard card={foundation[foundation.length - 1]} />
                ) : (
                  <EmptyPile label={["♠", "♥", "♦", "♣"][index]} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="flex gap-2 md:gap-4 justify-center">
          {gameState.tableau.map((pile, pileIndex) => (
            <div
              key={pileIndex}
              className={`flex-1 max-w-20 ${
                selectedCard?.type === "tableau" && selectedCard.index === pileIndex
                  ? "ring-2 ring-yellow-400 rounded-lg"
                  : ""
              }`}
              onClick={() => pile.length === 0 && selectedCard && handleTableauCardClick(pileIndex, 0)}
            >
              <TableauPile
                cards={pile}
                pileIndex={pileIndex}
                onCardClick={(cardIndex) => handleTableauCardClick(pileIndex, cardIndex)}
                onCardDoubleClick={(cardIndex) => handleTableauCardDoubleClick(pileIndex, cardIndex)}
                hintedCardId={hintedCard || undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {gameState.status === "won" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-3xl p-8 max-w-md w-full text-center border-2 border-green-500/50"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-3xl font-bold mb-2">You Win!</h2>
              <p className="text-gray-300 mb-4">
                Completed in {formatTime(elapsedTime)} with {gameState.moves} moves
              </p>
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
