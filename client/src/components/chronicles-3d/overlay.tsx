import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Minimize2, Maximize2 } from "lucide-react";

interface OverlayContainerProps {
  children: ReactNode;
  className?: string;
}

export function OverlayContainer({ children, className }: OverlayContainerProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-10 ${className || ""}`} data-testid="game-overlay">
      {children}
    </div>
  );
}

interface OverlaySlotProps {
  position: "top" | "bottom" | "left" | "right" | "center";
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function OverlaySlot({ position, children, className, interactive = true }: OverlaySlotProps) {
  const positionClasses: Record<string, string> = {
    top: "top-0 left-0 right-0",
    bottom: "bottom-0 left-0 right-0",
    left: "top-0 left-0 bottom-0 w-72 max-w-[85vw]",
    right: "top-0 right-0 bottom-0 w-72 max-w-[85vw]",
    center: "inset-0 flex items-center justify-center",
  };

  return (
    <div className={`absolute ${positionClasses[position]} ${interactive ? "pointer-events-auto" : ""} ${className || ""}`}>
      {children}
    </div>
  );
}

interface CollapsiblePanelProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  icon?: ReactNode;
}

export function CollapsiblePanel({ title, children, defaultOpen = true, className, icon }: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden ${className || ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:text-white transition-colors min-h-[36px]"
        data-testid={`panel-toggle-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <span className="flex items-center gap-2 font-medium">
          {icon}
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StatsOverlayProps {
  era: string;
  location: string;
  locationName: string;
  level?: number;
  xp?: number;
  shells?: number;
}

export function StatsOverlay({ era, location, locationName, level, xp, shells }: StatsOverlayProps) {
  const eraColors: Record<string, string> = {
    modern: "from-cyan-500/80 to-blue-600/80",
    medieval: "from-amber-500/80 to-orange-600/80",
    wildwest: "from-yellow-500/80 to-amber-600/80",
  };

  const eraEmoji: Record<string, string> = {
    modern: "🏙️",
    medieval: "🏰",
    wildwest: "🤠",
  };

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${eraColors[era] || eraColors.modern} text-white`}>
          {eraEmoji[era]} {era.charAt(0).toUpperCase() + era.slice(1)}
        </span>
        <span className="text-xs text-gray-300 font-medium">{locationName}</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-gray-400">
        {level && <span>Lv.{level}</span>}
        {xp !== undefined && <span className="text-cyan-400">{xp} XP</span>}
        {shells !== undefined && <span className="text-yellow-400">🐚 {shells}</span>}
      </div>
    </div>
  );
}

interface SceneTransitionProps {
  isTransitioning: boolean;
  locationName?: string;
}

export function SceneTransition({ isTransitioning, locationName }: SceneTransitionProps) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-30 bg-slate-950 flex items-center justify-center pointer-events-auto"
          data-testid="scene-transition"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            {locationName && (
              <p className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {locationName}
              </p>
            )}
            <div className="flex gap-1 mt-3 justify-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
