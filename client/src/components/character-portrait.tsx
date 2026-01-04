import { motion } from "framer-motion";
import { 
  Crown, Shield, Compass, Heart, Brain, Sword,
  Eye, Star, Flame, Droplets, Mountain, Wind
} from "lucide-react";

interface CharacterPortraitProps {
  characterName: string;
  primaryTrait: string;
  secondaryTrait: string;
  colorPreference: string;
  coreValues: string[];
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  animated?: boolean;
}

const TRAIT_ICONS: Record<string, React.ElementType> = {
  leader: Crown,
  builder: Shield,
  explorer: Compass,
  diplomat: Heart,
  scholar: Brain,
  protector: Sword,
};

const COLOR_HEX: Record<string, { primary: string; secondary: string; glow: string }> = {
  blue: { primary: "#3b82f6", secondary: "#1d4ed8", glow: "rgba(59, 130, 246, 0.4)" },
  green: { primary: "#22c55e", secondary: "#15803d", glow: "rgba(34, 197, 94, 0.4)" },
  purple: { primary: "#a855f7", secondary: "#7c3aed", glow: "rgba(168, 85, 247, 0.4)" },
  gold: { primary: "#eab308", secondary: "#ca8a04", glow: "rgba(234, 179, 8, 0.4)" },
  red: { primary: "#ef4444", secondary: "#dc2626", glow: "rgba(239, 68, 68, 0.4)" },
  silver: { primary: "#94a3b8", secondary: "#64748b", glow: "rgba(148, 163, 184, 0.4)" },
  cyan: { primary: "#06b6d4", secondary: "#0891b2", glow: "rgba(6, 182, 212, 0.4)" },
};

const VALUE_SYMBOLS: Record<string, React.ElementType> = {
  justice: Star,
  freedom: Wind,
  loyalty: Shield,
  knowledge: Eye,
  compassion: Heart,
  achievement: Flame,
  creativity: Droplets,
  integrity: Mountain,
};

const SIZE_CLASSES = {
  sm: { container: "w-24 h-24", icon: "w-8 h-8", name: "text-xs" },
  md: { container: "w-36 h-36", icon: "w-12 h-12", name: "text-sm" },
  lg: { container: "w-48 h-48", icon: "w-16 h-16", name: "text-base" },
};

export function CharacterPortrait({
  characterName,
  primaryTrait,
  secondaryTrait,
  colorPreference,
  coreValues,
  size = "md",
  showName = true,
  animated = true,
}: CharacterPortraitProps) {
  const PrimaryIcon = TRAIT_ICONS[primaryTrait] || Crown;
  const SecondaryIcon = TRAIT_ICONS[secondaryTrait] || Shield;
  const colors = COLOR_HEX[colorPreference] || COLOR_HEX.cyan;
  const sizeClass = SIZE_CLASSES[size];

  const valueIcons = coreValues
    .slice(0, 3)
    .map(v => VALUE_SYMBOLS[v] || Star);

  const MotionWrapper = animated ? motion.div : "div";
  const motionProps = animated ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <div className="flex flex-col items-center gap-2">
      <MotionWrapper
        {...motionProps}
        className={`${sizeClass.container} relative rounded-full overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          boxShadow: `0 0 40px ${colors.glow}, inset 0 0 30px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Inner glow ring */}
        <div 
          className="absolute inset-2 rounded-full border-2 border-white/20"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)`,
          }}
        />

        {/* Primary trait icon - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PrimaryIcon 
            className={`${sizeClass.icon} text-white drop-shadow-lg`}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* Secondary trait icon - bottom right */}
        <div className="absolute bottom-2 right-2">
          <div 
            className="p-1 rounded-full bg-black/30 backdrop-blur-sm"
            style={{ boxShadow: `0 0 10px ${colors.glow}` }}
          >
            <SecondaryIcon className="w-4 h-4 text-white/80" />
          </div>
        </div>

        {/* Value symbols - floating around */}
        {valueIcons.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${20 + i * 25}%`,
              left: i % 2 === 0 ? "8%" : "auto",
              right: i % 2 === 1 ? "8%" : "auto",
            }}
            animate={animated ? {
              y: [0, -3, 0],
              opacity: [0.6, 0.9, 0.6],
            } : {}}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-3 h-3 text-white/60" />
          </motion.div>
        ))}

        {/* Shimmer effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
        )}
      </MotionWrapper>

      {/* Character name */}
      {showName && (
        <div className={`${sizeClass.name} font-semibold text-white text-center`}>
          {characterName}
        </div>
      )}
    </div>
  );
}

export function CharacterPortraitPreview({
  primaryTrait,
  secondaryTrait,
  colorPreference,
}: {
  primaryTrait: string;
  secondaryTrait: string;
  colorPreference: string;
}) {
  return (
    <CharacterPortrait
      characterName="Preview"
      primaryTrait={primaryTrait}
      secondaryTrait={secondaryTrait}
      colorPreference={colorPreference || "cyan"}
      coreValues={[]}
      size="lg"
      showName={false}
      animated={true}
    />
  );
}
