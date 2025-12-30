import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Undo2, Lightbulb, Play, Trophy, Clock, Layers, Sparkles } from "lucide-react";
import { BackButton } from "@/components/page-nav";
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
  canMoveToTableau,
  canMoveToFoundation,
} from "@/lib/solitaire-engine";

interface DragState {
  cards: GameCard[];
  from: { type: "waste" | "tableau" | "foundation"; index?: number; cardIndex?: number };
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

function PlayingCard({
  card,
  isDragging,
  isHinted,
  isValidDrop,
  onPointerDown,
  onDoubleClick,
}: {
  card: GameCard;
  isDragging?: boolean;
  isHinted?: boolean;
  isValidDrop?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onDoubleClick?: () => void;
}) {
  if (!card.faceUp) {
    return (
      <div
        className="w-14 h-20 md:w-16 md:h-24 rounded-lg bg-gradient-to-br from-blue-800 to-purple-900 border-2 border-white/30
          shadow-lg flex items-center justify-center"
      >
        <div className="w-3/4 h-3/4 border border-white/20 rounded-sm bg-gradient-to-br from-purple-600/50 to-blue-600/50" />
      </div>
    );
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className={`
        w-14 h-20 md:w-16 md:h-24
        rounded-lg bg-white border-2 shadow-lg flex flex-col items-start justify-start p-1
        cursor-grab active:cursor-grabbing select-none touch-none
        transition-all duration-150
        ${isDragging ? "opacity-50 scale-95" : "hover:shadow-xl hover:-translate-y-0.5"}
        ${isHinted ? "ring-2 ring-yellow-400 animate-pulse" : ""}
        ${isValidDrop ? "ring-2 ring-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : ""}
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
    </div>
  );
}

function EmptyPile({ 
  onClick, 
  label,
  isValidDrop,
  onPointerUp,
}: { 
  onClick?: () => void; 
  label?: string;
  isValidDrop?: boolean;
  onPointerUp?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      onPointerUp={onPointerUp}
      className={`w-14 h-20 md:w-16 md:h-24 rounded-lg border-2 border-dashed 
        flex items-center justify-center cursor-pointer transition-all duration-150
        ${isValidDrop 
          ? "border-green-400 bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
          : "border-white/30 hover:border-white/50"
        }`}
    >
      {label && <span className="text-xs text-white/50">{label}</span>}
    </div>
  );
}

export default function Solitaire() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hintedCard, setHintedCard] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  const startNewGame = useCallback(() => {
    setGameState(createInitialState());
    setElapsedTime(0);
    setHintedCard(null);
    setDragState(null);
  }, []);

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
    setHintedCard(null);
  };

  const startDrag = (
    e: React.PointerEvent,
    cards: GameCard[],
    from: DragState["from"]
  ) => {
    if (!gameState || cards.length === 0) return;
    if (!cards[0].faceUp) return;
    
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    setDragState({
      cards,
      from,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
    setHintedCard(null);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState) return;
    setDragState(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
  }, [dragState]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragState || !gameState) {
      setDragState(null);
      return;
    }
    
    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    if (!dropTarget) {
      setDragState(null);
      return;
    }

    const pileElement = dropTarget.closest("[data-pile-type]");
    
    if (pileElement) {
      const pileType = pileElement.getAttribute("data-pile-type") as "tableau" | "foundation";
      const pileIndex = parseInt(pileElement.getAttribute("data-pile-index") || "0");
      
      const result = moveCards(gameState, dragState.from, { type: pileType, index: pileIndex });
      
      if (result) {
        setGameState(result);
        if (result.status === "won") {
          toast({ title: "Congratulations!", description: "You won the game!" });
        }
      }
    }
    
    setDragState(null);
  }, [dragState, gameState, toast]);

  const handleWasteDoubleClick = () => {
    if (!gameState || gameState.waste.length === 0) return;
    
    const card = gameState.waste[gameState.waste.length - 1];
    for (let i = 0; i < 4; i++) {
      if (canMoveToFoundation(card, gameState.foundations[i])) {
        const result = moveCards(gameState, { type: "waste" }, { type: "foundation", index: i });
        if (result) {
          setGameState(result);
          if (result.status === "won") {
            toast({ title: "Congratulations!", description: "You won the game!" });
          }
          return;
        }
      }
    }
  };

  const handleTableauDoubleClick = (pileIndex: number, cardIndex: number) => {
    if (!gameState) return;
    
    const pile = gameState.tableau[pileIndex];
    if (cardIndex !== pile.length - 1) return;
    
    const card = pile[cardIndex];
    if (!card.faceUp) return;
    
    for (let i = 0; i < 4; i++) {
      if (canMoveToFoundation(card, gameState.foundations[i])) {
        const result = moveCards(
          gameState,
          { type: "tableau", index: pileIndex, cardIndex },
          { type: "foundation", index: i }
        );
        if (result) {
          setGameState(result);
          if (result.status === "won") {
            toast({ title: "Congratulations!", description: "You won the game!" });
          }
          return;
        }
      }
    }
  };

  const handleUndo = () => {
    if (!gameState) return;
    const prev = undo(gameState);
    if (prev) {
      setGameState(prev);
      setHintedCard(null);
    }
  };

  const handleHint = () => {
    if (!gameState) return;
    const hints = getHints(gameState);
    if (hints.length > 0) {
      const hint = hints[0];
      toast({ title: "Hint", description: hint.description });
      
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

  const getValidDropTargets = useCallback(() => {
    if (!dragState || !gameState) return { foundations: [], tableaus: [] };
    
    const card = dragState.cards[0];
    const foundations: number[] = [];
    const tableaus: number[] = [];
    
    if (dragState.cards.length === 1) {
      for (let i = 0; i < 4; i++) {
        if (canMoveToFoundation(card, gameState.foundations[i])) {
          foundations.push(i);
        }
      }
    }
    
    for (let i = 0; i < 7; i++) {
      if (canMoveToTableau(card, gameState.tableau[i])) {
        tableaus.push(i);
      }
    }
    
    return { foundations, tableaus };
  }, [dragState, gameState]);

  const validTargets = getValidDropTargets();

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <BackButton />
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
                  <li>Drag cards to move them between piles</li>
                  <li>Double-tap to auto-move to foundations</li>
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
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-x-auto touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <BackButton />
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
            <div onClick={handleStockClick} className="cursor-pointer">
              {gameState.stock.length > 0 ? (
                <div className="w-14 h-20 md:w-16 md:h-24 rounded-lg bg-gradient-to-br from-blue-800 to-purple-900 border-2 border-white/30 shadow-lg flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border border-white/20 rounded-sm bg-gradient-to-br from-purple-600/50 to-blue-600/50" />
                </div>
              ) : (
                <EmptyPile label="↻" />
              )}
            </div>
            
            {/* Waste */}
            <div
              data-pile-type="waste"
              onPointerDown={(e) => {
                if (gameState.waste.length > 0) {
                  startDrag(e, [gameState.waste[gameState.waste.length - 1]], { type: "waste" });
                }
              }}
              onDoubleClick={handleWasteDoubleClick}
            >
              {gameState.waste.length > 0 ? (
                <PlayingCard
                  card={gameState.waste[gameState.waste.length - 1]}
                  isDragging={dragState?.from.type === "waste"}
                  isHinted={hintedCard === gameState.waste[gameState.waste.length - 1].id}
                />
              ) : (
                <EmptyPile />
              )}
            </div>
          </div>

          {/* Foundations */}
          <div className="flex gap-2">
            {gameState.foundations.map((foundation, index) => (
              <div 
                key={index} 
                data-pile-type="foundation"
                data-pile-index={index}
              >
                {foundation.length > 0 ? (
                  <PlayingCard 
                    card={foundation[foundation.length - 1]}
                    isValidDrop={validTargets.foundations.includes(index)}
                    onPointerDown={(e) => {
                      startDrag(e, [foundation[foundation.length - 1]], { type: "foundation", index });
                    }}
                  />
                ) : (
                  <EmptyPile 
                    label={["♠", "♥", "♦", "♣"][index]} 
                    isValidDrop={validTargets.foundations.includes(index)}
                  />
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
              data-pile-type="tableau"
              data-pile-index={pileIndex}
              className="flex-1 max-w-20"
            >
              {pile.length === 0 ? (
                <EmptyPile 
                  label="K" 
                  isValidDrop={validTargets.tableaus.includes(pileIndex)}
                />
              ) : (
                <div className="relative" style={{ minHeight: `${80 + pile.length * 20}px` }}>
                  {pile.map((card, cardIndex) => (
                    <div
                      key={card.id}
                      className="absolute left-0"
                      style={{ top: `${cardIndex * 20}px`, zIndex: cardIndex }}
                      onPointerDown={(e) => {
                        if (card.faceUp) {
                          const cardsToMove = pile.slice(cardIndex);
                          startDrag(e, cardsToMove, { type: "tableau", index: pileIndex, cardIndex });
                        }
                      }}
                      onDoubleClick={() => handleTableauDoubleClick(pileIndex, cardIndex)}
                    >
                      <PlayingCard
                        card={card}
                        isDragging={
                          dragState?.from.type === "tableau" &&
                          dragState.from.index === pileIndex &&
                          (dragState.from.cardIndex ?? 0) <= cardIndex
                        }
                        isHinted={card.id === hintedCard}
                        isValidDrop={cardIndex === pile.length - 1 && validTargets.tableaus.includes(pileIndex)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dragged Cards Overlay */}
      {dragState && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: dragState.currentX - 28,
            top: dragState.currentY - 40,
          }}
        >
          {dragState.cards.map((card, index) => (
            <div 
              key={card.id} 
              className="absolute"
              style={{ top: `${index * 20}px` }}
            >
              <div className={`
                w-14 h-20 md:w-16 md:h-24 rounded-lg bg-white border-2 shadow-2xl 
                flex flex-col items-start justify-start p-1 rotate-3
                ${isRed(card.suit) ? "border-red-200" : "border-gray-300"}
              `}>
                <span className={`text-xs md:text-sm font-bold ${getSuitColor(card.suit)}`}>
                  {card.rank}
                </span>
                <span className={`text-sm md:text-lg ${getSuitColor(card.suit)}`}>
                  {getSuitSymbol(card.suit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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
