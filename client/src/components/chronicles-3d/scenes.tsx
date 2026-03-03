import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EraType, LocationType, EraEnvironmentConfig } from "./types";

const MODERN_PALETTE = {
  building1: "#1a2332", building2: "#263245", building3: "#374155",
  glass: "#06b6d4", glassDark: "#0e7490", glassLit: "#22d3ee",
  roof: "#0f172a", roofAccent: "#1e293b",
  concrete: "#94a3b8", sidewalk: "#64748b",
  grass: "#166534", grassLight: "#22803a",
  road: "#1f2937", roadLine: "#facc15",
  ground: "#1a1f2e", sky: "#0a0f1a", fog: "#0c1220",
  accent: "#06b6d4", particle: "#06b6d4",
  doorColor: "#334155", windowFrame: "#0f172a",
  neon1: "#06b6d4", neon2: "#a855f7", neon3: "#f43f5e",
};

const MEDIEVAL_PALETTE = {
  stone: "#8B7355", stoneDark: "#6B5B45", stoneLight: "#a09070",
  wood: "#5C3A1E", woodLight: "#A0855B", woodDark: "#3d2510",
  thatch: "#8B6914", thatchLight: "#b08a20",
  moss: "#2D5016", mossLight: "#3d6620",
  tower: "#696969", towerDark: "#4A4A4A",
  dirt: "#3d2b10", cobble: "#6b6050",
  torch: "#ff8c00", torchGlow: "#ffa500",
  ground: "#2a1f0f", sky: "#0a0800", fog: "#1a1200",
  accent: "#eab308", particle: "#eab308",
};

const WILDWEST_PALETTE = {
  wood: "#C4A574", woodDark: "#8B6914", woodWeathered: "#9c8560",
  plank: "#B8956A", plankLight: "#d4b080",
  metal: "#8B7355", metalRust: "#a06530",
  barrel: "#6B4226", sand: "#d4a76a",
  cactus: "#5C8A3C", cactusDark: "#2D6B16",
  dust: "#c4a060", dustLight: "#d4b880",
  tumbleweed: "#a08040",
  ground: "#3d2b10", sky: "#1a1200", fog: "#2a1f0f",
  accent: "#f59e0b", particle: "#f59e0b",
  rope: "#8B7355",
};

function ModernBuilding({ position, height, width, depth, color, glassColor, hasAwning, hasRoofDetail }: {
  position: [number, number, number];
  height: number; width: number; depth: number;
  color: string; glassColor?: string;
  hasAwning?: boolean; hasRoofDetail?: boolean;
}) {
  const windowRows = Math.floor(height / 1.2);
  const windowCols = Math.max(1, Math.floor(width / 1.5));
  const gc = glassColor || MODERN_PALETTE.glass;

  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>

      <mesh position={[0, 0.02, depth / 2 + 0.2]}>
        <boxGeometry args={[width + 0.4, 0.04, 0.4]} />
        <meshStandardMaterial color={MODERN_PALETTE.sidewalk} roughness={0.9} />
      </mesh>

      <mesh position={[0, height / 2, depth / 2 + 0.01]}>
        <boxGeometry args={[width + 0.05, height + 0.05, 0.02]} />
        <meshStandardMaterial color={MODERN_PALETTE.windowFrame} roughness={0.5} metalness={0.3} />
      </mesh>

      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowCols }).map((_, col) => {
          const wx = (col - (windowCols - 1) / 2) * (width / (windowCols + 0.5));
          const wy = 1 + row * 1.2;
          if (wy > height - 0.5) return null;
          const litIntensity = Math.random();
          return (
            <mesh key={`${row}-${col}`} position={[wx, wy, depth / 2 + 0.02]}>
              <boxGeometry args={[0.55, 0.75, 0.02]} />
              <meshStandardMaterial
                color={gc} emissive={gc}
                emissiveIntensity={litIntensity > 0.4 ? 0.5 : litIntensity > 0.15 ? 0.2 : 0.05}
                roughness={0.05} metalness={0.9}
              />
            </mesh>
          );
        })
      )}

      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.3, 0.25, depth + 0.3]} />
        <meshStandardMaterial color={MODERN_PALETTE.roof} roughness={0.4} metalness={0.3} />
      </mesh>

      {hasRoofDetail && (
        <>
          <mesh position={[width * 0.2, height + 0.5, 0]}>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshStandardMaterial color={MODERN_PALETTE.roofAccent} roughness={0.5} />
          </mesh>
          <mesh position={[-width * 0.2, height + 0.5, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial color={MODERN_PALETTE.roofAccent} roughness={0.5} />
          </mesh>
        </>
      )}

      {hasAwning && (
        <mesh position={[0, 1.2, depth / 2 + 0.4]} rotation={[Math.PI * 0.08, 0, 0]}>
          <boxGeometry args={[width * 0.6, 0.05, 0.8]} />
          <meshStandardMaterial color={MODERN_PALETTE.accent} roughness={0.6} metalness={0.2}
            emissive={MODERN_PALETTE.accent} emissiveIntensity={0.1} />
        </mesh>
      )}

      <mesh position={[0, 0.9, depth / 2 + 0.02]}>
        <boxGeometry args={[0.8, 1.6, 0.04]} />
        <meshStandardMaterial color={MODERN_PALETTE.doorColor} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0.3, 0.9, depth / 2 + 0.04]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}

function MedievalStructure({ position, type }: {
  position: [number, number, number];
  type: "cottage" | "tower" | "keep" | "wall" | "church" | "well";
}) {
  if (type === "tower") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 3, 0]}>
          <cylinderGeometry args={[1, 1.3, 6, 8]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[1.35, 1.5, 0.6, 8]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.95} />
        </mesh>
        <mesh position={[0, 6.5, 0]}>
          <coneGeometry args={[1.5, 2, 8]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.towerDark} roughness={0.7} />
        </mesh>
        {[0, 90, 180, 270].map(angle => (
          <mesh key={angle} position={[
            Math.cos(angle * Math.PI / 180) * 1.35,
            6,
            Math.sin(angle * Math.PI / 180) * 1.35
          ]}>
            <boxGeometry args={[0.35, 0.65, 0.2]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.9} />
          </mesh>
        ))}
        {[45, 135, 225, 315].map(angle => (
          <mesh key={`w-${angle}`} position={[
            Math.cos(angle * Math.PI / 180) * 1.05,
            3.5,
            Math.sin(angle * Math.PI / 180) * 1.05
          ]}>
            <boxGeometry args={[0.3, 0.5, 0.08]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "keep") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[4.5, 5, 4.5]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[5, 0.6, 5]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.95} />
        </mesh>
        <mesh position={[0, 5.5, 0]}>
          <coneGeometry args={[3.5, 2, 4]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.85} />
        </mesh>
        {[[-2, 5.2, 2.3], [2, 5.2, 2.3], [-2, 5.2, -2.3], [2, 5.2, -2.3]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <boxGeometry args={[0.5, 0.7, 0.5]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 1.5, 2.26]}>
          <boxGeometry args={[1.4, 2.5, 0.1]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.woodLight} roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.9, 2.26]}>
          <boxGeometry args={[1.6, 0.15, 0.15]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.9} />
        </mesh>
        {[-1.5, 1.5].map(x => (
          <mesh key={x} position={[x, 3.2, 2.26]}>
            <boxGeometry args={[0.5, 0.7, 0.05]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "wall") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[10, 3, 1]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        {[-4, -2, 0, 2, 4].map(x => (
          <mesh key={x} position={[x, 3.3, 0]}>
            <boxGeometry args={[0.6, 0.6, 1.1]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 1.5, 0.55]}>
          <boxGeometry args={[1.2, 2.2, 0.15]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.woodDark} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (type === "church") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[3.5, 5, 5]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        <mesh position={[0, 5.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.8, 2.5, 4]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
        </mesh>
        <mesh position={[0, 7.2, 0]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.7} />
        </mesh>
        <mesh position={[0, 7.5, 0]}>
          <boxGeometry args={[0.5, 0.1, 0.1]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.7} />
        </mesh>
        <mesh position={[0, 2, 2.51]}>
          <cylinderGeometry args={[0.6, 0.6, 0.05, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneLight} roughness={0.3} metalness={0.2}
            emissive="#ffd700" emissiveIntensity={0.1} />
        </mesh>
      </group>
    );
  }

  if (type === "well") {
    return (
      <group position={position}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.7, 0.8, 0.8, 12]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        {[-0.5, 0.5].map(x => (
          <mesh key={x} position={[x, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.3]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <coneGeometry args={[0.7, 0.5, 4]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.thatch} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[2.8, 2.4, 2.8]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.woodLight} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.3, 1.6, 4]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.thatch} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.8, 1.41]}>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 1.41]}>
        <boxGeometry args={[0.9, 0.1, 0.12]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.woodDark} roughness={0.9} />
      </mesh>
      {[-0.9, 0.9].map(x => (
        <group key={x}>
          <mesh position={[x, 1.6, 1.41]}>
            <boxGeometry args={[0.45, 0.55, 0.05]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.8} />
          </mesh>
          <mesh position={[x, 1.6, 1.42]}>
            <boxGeometry args={[0.04, 0.55, 0.06]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
          </mesh>
          <mesh position={[x, 1.6, 1.42]}>
            <boxGeometry args={[0.45, 0.04, 0.06]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.2, 1.2]}>
        <boxGeometry args={[1.4, 0.08, 0.6]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.woodDark} roughness={0.9} />
      </mesh>
    </group>
  );
}

function WildWestBuilding({ position, type }: {
  position: [number, number, number];
  type: "saloon" | "shop" | "barn" | "water_tower" | "jail" | "bank";
}) {
  if (type === "water_tower") {
    return (
      <group position={position}>
        {[[-0.6, 0, -0.6], [0.6, 0, -0.6], [-0.6, 0, 0.6], [0.6, 0, 0.6]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 3.5, 6]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
          </mesh>
        ))}
        {[[0, 0.8, 0], [0, 1.8, 0]].map((pos, i) => (
          <group key={`brace-${i}`}>
            <mesh position={[0, pos[1], -0.6]}>
              <boxGeometry args={[1.3, 0.06, 0.06]} />
              <meshStandardMaterial color={WILDWEST_PALETTE.woodWeathered} roughness={0.9} />
            </mesh>
            <mesh position={[0, pos[1], 0.6]}>
              <boxGeometry args={[1.3, 0.06, 0.06]} />
              <meshStandardMaterial color={WILDWEST_PALETTE.woodWeathered} roughness={0.9} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[1, 1.1, 1.8, 12]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.metal} roughness={0.8} />
        </mesh>
        <mesh position={[0, 3.8, 0]}>
          <coneGeometry args={[1.15, 0.6, 12]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
        </mesh>
      </group>
    );
  }

  if (type === "barn") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 1.8, 0]}>
          <boxGeometry args={[4.5, 3.6, 3.5]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.95} />
        </mesh>
        <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 3.6, 4, 1, true, Math.PI / 4, Math.PI / 2]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.4, 1.76]}>
          <boxGeometry args={[2.2, 2.6, 0.08]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.wood} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.4, 1.77]}>
          <boxGeometry args={[0.06, 2.6, 0.1]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 1.76]}>
          <boxGeometry args={[2.5, 0.1, 0.1]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodWeathered} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (type === "jail") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 1.6, 0]}>
          <boxGeometry args={[3.2, 3.2, 3]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodWeathered} roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.6 + 0.6, 1.51]}>
          <boxGeometry args={[3.5, 3.2 + 1.2, 0.1]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, 1.51]}>
          <boxGeometry args={[3.8, 0.35, 0.15]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
        </mesh>
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[1.2 + x * 0.3, 2, 1.52]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 6]} />
            <meshStandardMaterial color="#555" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 1, 1.52]}>
          <boxGeometry args={[0.9, 1.8, 0.04]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (type === "bank") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 3.5]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.plankLight} roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.2, 1.76]}>
          <boxGeometry args={[4.3, 4.4, 0.1]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.85} />
        </mesh>
        <mesh position={[0, 4.5, 1.76]}>
          <boxGeometry args={[4.5, 0.4, 0.15]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
        </mesh>
        {[-1.2, -0.4, 0.4, 1.2].map(x => (
          <mesh key={x} position={[x, 4, 1.82]}>
            <cylinderGeometry args={[0.08, 0.1, 3, 8]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.plankLight} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 1.2, 1.82]}>
          <boxGeometry args={[1.2, 2.2, 0.04]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.15, 2.2]}>
          <boxGeometry args={[4.5, 0.15, 1.5]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  const isSaloon = type === "saloon";
  const height = isSaloon ? 4.5 : 3.2;
  const facadeExtra = isSaloon ? 1.2 : 0.6;
  const bWidth = isSaloon ? 4 : 3.5;

  return (
    <group position={position}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[bWidth, height, 3]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.wood} roughness={0.95} />
      </mesh>
      <mesh position={[0, height / 2 + facadeExtra / 2, 1.51]}>
        <boxGeometry args={[bWidth + 0.3, height + facadeExtra, 0.1]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
      </mesh>
      <mesh position={[0, height + facadeExtra + 0.2, 1.51]}>
        <boxGeometry args={[bWidth + 0.5, 0.4, 0.15]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
      </mesh>

      <mesh position={[0, 0.15, 2.2]}>
        <boxGeometry args={[bWidth + 0.5, 0.15, 1.8]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
      </mesh>

      {isSaloon && (
        <>
          {[-1.5, 1.5].map(x => (
            <mesh key={x} position={[x, 1.5, 2.8]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
              <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 3, 2.8]}>
            <boxGeometry args={[3.2, 0.1, 0.05]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
          </mesh>
          <mesh position={[0, 3.2, 2.8]} rotation={[Math.PI * 0.1, 0, 0]}>
            <boxGeometry args={[3.4, 0.05, 1]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
          </mesh>
          <mesh position={[-0.3, 1, 1.62]}>
            <boxGeometry args={[0.6, 1.8, 0.05]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
          </mesh>
          <mesh position={[0.3, 1, 1.62]}>
            <boxGeometry args={[0.6, 1.8, 0.05]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
          </mesh>
        </>
      )}
      {!isSaloon && (
        <mesh position={[0, 1, 1.62]}>
          <boxGeometry args={[0.9, 1.8, 0.05]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
        </mesh>
      )}
      {[-1.2, 1.2].map(x => (
        <mesh key={x} position={[x, 2.4, 1.62]}>
          <boxGeometry args={[0.5, 0.65, 0.05]} />
          <meshStandardMaterial color="#87CEEB" roughness={0.2} metalness={0.3} opacity={0.6} transparent />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, era, size = 1 }: { position: [number, number, number]; era: EraType; size?: number }) {
  const trunkColor = era === "wildwest" ? "#5C4033" : "#4a3525";
  const leafColor = era === "medieval" ? "#2D5016" : era === "wildwest" ? "#3D7B26" : "#166534";
  const leafColor2 = era === "medieval" ? "#1d4010" : era === "wildwest" ? "#2d6b16" : "#0d4a20";
  const trunkHeight = (era === "wildwest" ? 2 : 3) * size;
  const leafSize = (era === "wildwest" ? 0.8 : 1.4) * size;

  if (era === "wildwest") {
    return (
      <group position={position}>
        <mesh position={[0, trunkHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[0.12 * size, 0.22 * size, trunkHeight, 6]} />
          <meshStandardMaterial color={trunkColor} roughness={0.9} />
        </mesh>
        {[0, 120, 240].map((angle, i) => (
          <mesh key={i} position={[
            Math.cos(angle * Math.PI / 180) * 0.25 * size,
            trunkHeight * 0.6 + i * 0.35 * size,
            Math.sin(angle * Math.PI / 180) * 0.25 * size
          ]}>
            <sphereGeometry args={[(leafSize - i * 0.12 * size), 7, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? leafColor : leafColor2} roughness={0.85} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.1 * size, 0.18 * size, trunkHeight, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, trunkHeight + leafSize * 0.4, 0]} castShadow>
        <sphereGeometry args={[leafSize, 8, 7]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.3 * size, trunkHeight + leafSize * 0.1, 0.2 * size]}>
        <sphereGeometry args={[leafSize * 0.65, 7, 6]} />
        <meshStandardMaterial color={leafColor2} roughness={0.85} />
      </mesh>
      <mesh position={[-0.25 * size, trunkHeight + leafSize * 0.6, -0.15 * size]}>
        <sphereGeometry args={[leafSize * 0.55, 7, 6]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Cactus({ position, size = 1 }: { position: [number, number, number]; size?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2 * size, 0]} castShadow>
        <cylinderGeometry args={[0.13 * size, 0.18 * size, 2.4 * size, 8]} />
        <meshStandardMaterial color="#2D6B16" roughness={0.8} />
      </mesh>
      <mesh position={[0.25 * size, 1.5 * size, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.07 * size, 0.09 * size, 0.8 * size, 6]} />
        <meshStandardMaterial color="#3D7B26" roughness={0.8} />
      </mesh>
      <mesh position={[0.45 * size, 1.85 * size, 0]}>
        <cylinderGeometry args={[0.06 * size, 0.07 * size, 0.5 * size, 6]} />
        <meshStandardMaterial color="#3D7B26" roughness={0.8} />
      </mesh>
      <mesh position={[-0.22 * size, 1.8 * size, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.06 * size, 0.08 * size, 0.65 * size, 6]} />
        <meshStandardMaterial color="#3D7B26" roughness={0.8} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position, color = "#ffddaa" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
        <meshStandardMaterial color="#555" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 3.1, 0]} intensity={0.6} color={color} distance={6} decay={2} />
    </group>
  );
}

function Torch({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.06, 0.15, 6]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>
      <pointLight position={[0, 1.7, 0]} intensity={0.7} color="#ff8c00" distance={6} decay={2} />
    </group>
  );
}

function HitchingPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.8, 0.8].map(x => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1, 6]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodWeathered} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 6]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Barrel({ position, color }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.3, 0.9, 10]} />
        <meshStandardMaterial color={color || WILDWEST_PALETTE.barrel} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 10]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 10]} />
        <meshStandardMaterial color="#555" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

function Bench({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.35]} />
        <meshStandardMaterial color={MODERN_PALETTE.concrete} roughness={0.7} />
      </mesh>
      {[-0.5, 0.5].map(x => (
        <mesh key={x} position={[x, 0.12, 0]} castShadow>
          <boxGeometry args={[0.06, 0.24, 0.35]} />
          <meshStandardMaterial color="#444" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.45, -0.15]}>
        <boxGeometry args={[1.2, 0.35, 0.04]} />
        <meshStandardMaterial color={MODERN_PALETTE.concrete} roughness={0.7} />
      </mesh>
    </group>
  );
}

function FloatingParticles({ count, color, spread, speed }: {
  count: number; color: string; spread: number; speed: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = Math.random() * spread * 0.5 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.015;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed * 0.4 + i * 0.7) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Road({ length = 20, width = 4, position = [0, 0.02, 0] as [number, number, number] }: {
  length?: number; width?: number; position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={MODERN_PALETTE.road} roughness={0.9} />
      </mesh>
      {Array.from({ length: Math.floor(length / 2) }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -length / 2 + 1 + i * 2]}>
          <planeGeometry args={[0.12, 0.8]} />
          <meshStandardMaterial color={MODERN_PALETTE.roadLine} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Sidewalk({ position, width = 2, length = 6 }: {
  position: [number, number, number]; width?: number; length?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color={MODERN_PALETTE.sidewalk} roughness={0.85} />
    </mesh>
  );
}

function DirtPath({ position, width = 3, length = 18 }: {
  position: [number, number, number]; width?: number; length?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color={WILDWEST_PALETTE.dustLight} roughness={0.95} />
    </mesh>
  );
}

export function ModernScene({ location }: { location: LocationType }) {
  return (
    <group>
      <ModernBuilding position={[0, 0, -10]} height={9} width={4} depth={3.5} color={MODERN_PALETTE.building1} hasRoofDetail />
      <ModernBuilding position={[-7, 0, -8]} height={6} width={3} depth={3} color={MODERN_PALETTE.building2} glassColor="#8b5cf6" />
      <ModernBuilding position={[7, 0, -9]} height={7} width={3.5} depth={3} color={MODERN_PALETTE.building3} hasAwning />
      <ModernBuilding position={[-11, 0, -5]} height={4.5} width={2.5} depth={2.5} color={MODERN_PALETTE.building2} />
      <ModernBuilding position={[11, 0, -6]} height={5} width={3} depth={2.5} color={MODERN_PALETTE.building1} hasRoofDetail />
      <ModernBuilding position={[-4, 0, -13]} height={11} width={3.5} depth={3} color={MODERN_PALETTE.building3} glassColor={MODERN_PALETTE.neon2} hasRoofDetail />
      <ModernBuilding position={[4, 0, -14]} height={8} width={3} depth={3} color={MODERN_PALETTE.building1} hasAwning />

      <Road position={[0, 0.02, 2]} />
      <Sidewalk position={[-3, 0.03, 5]} />
      <Sidewalk position={[3, 0.03, 5]} />

      {location === "park" && (
        <>
          {[[-3, 0, -2], [3, 0, -3], [-1.5, 0, -5], [5, 0, -1], [-5, 0, 2], [0, 0, -7]].map((pos, i) => (
            <Tree key={i} position={pos as [number, number, number]} era="modern" size={0.8 + Math.random() * 0.5} />
          ))}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} receiveShadow>
            <circleGeometry args={[5, 32]} />
            <meshStandardMaterial color={MODERN_PALETTE.grass} roughness={0.95} />
          </mesh>
          <Bench position={[-2, 0, 1]} rotation={[0, Math.PI * 0.2, 0]} />
          <Bench position={[2.5, 0, 0]} rotation={[0, -Math.PI * 0.15, 0]} />
        </>
      )}

      {(location === "cafe" || location === "restaurant") && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.025, 5.5]} receiveShadow>
            <planeGeometry args={[3, 2]} />
            <meshStandardMaterial color={MODERN_PALETTE.sidewalk} roughness={0.85} />
          </mesh>
          {[[1, 0, 5], [3, 0, 5]].map((pos, i) => (
            <group key={i} position={pos as [number, number, number]}>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.04, 12]} />
                <meshStandardMaterial color="#fff" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.17, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
                <meshStandardMaterial color="#666" roughness={0.3} metalness={0.7} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {(location === "home" || location === "office") && (
        <Sidewalk position={[0, 0.03, 4]} width={6} length={3} />
      )}

      <StreetLamp position={[-4, 0, 4]} />
      <StreetLamp position={[4, 0, 4]} />

      <FloatingParticles count={120} color={MODERN_PALETTE.particle} spread={30} speed={0.8} />
    </group>
  );
}

export function MedievalScene({ location }: { location: LocationType }) {
  return (
    <group>
      <MedievalStructure position={[0, 0, -8]} type="keep" />
      <MedievalStructure position={[-7, 0, -5]} type="cottage" />
      <MedievalStructure position={[6, 0, -6]} type="tower" />
      <MedievalStructure position={[-3, 0, -13]} type="wall" />
      <MedievalStructure position={[9, 0, -3]} type="cottage" />
      <MedievalStructure position={[-10, 0, -8]} type="tower" />

      {location === "chapel" && (
        <MedievalStructure position={[0, 0, -4]} type="church" />
      )}

      <MedievalStructure position={[3, 0, 2]} type="well" />

      {[[-4, 0, -2], [5, 0, -1], [8, 0, 2], [-8, 0, 1], [-2, 0, 3]].map((pos, i) => (
        <Tree key={i} position={pos as [number, number, number]} era="medieval" size={0.8 + Math.random() * 0.4} />
      ))}

      {[[-3, 0, -3], [4, 0, -4], [-6, 0, 0], [7, 0, -2], [0, 0, 1], [-5, 0, -7]].map((pos, i) => (
        <Torch key={`torch-${i}`} position={pos as [number, number, number]} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -1]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.cobble} roughness={0.95} />
      </mesh>

      {location === "market" && (
        <>
          {[[-2, 0, 0], [2, 0, 1]].map((pos, i) => (
            <group key={`stall-${i}`} position={pos as [number, number, number]}>
              <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1.5, 0.08, 1]} />
                <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
              </mesh>
              {[[-0.6, 0, -0.4], [-0.6, 0, 0.4], [0.6, 0, -0.4], [0.6, 0, 0.4]].map((lp, j) => (
                <mesh key={j} position={[lp[0], 0.5, lp[2]]}>
                  <cylinderGeometry args={[0.04, 0.04, 1, 6]} />
                  <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
                </mesh>
              ))}
              <mesh position={[0, 1.6, 0]} rotation={[Math.PI * 0.08, 0, 0]}>
                <boxGeometry args={[1.7, 0.04, 1.3]} />
                <meshStandardMaterial color={i === 0 ? "#8B2500" : "#2E5090"} roughness={0.9} />
              </mesh>
            </group>
          ))}
        </>
      )}

      <FloatingParticles count={80} color={MEDIEVAL_PALETTE.particle} spread={25} speed={0.4} />
    </group>
  );
}

export function WildWestScene({ location }: { location: LocationType }) {
  return (
    <group>
      <WildWestBuilding position={[0, 0, -7]} type="saloon" />
      <WildWestBuilding position={[-7, 0, -5]} type="shop" />
      <WildWestBuilding position={[7, 0, -6]} type="shop" />
      <WildWestBuilding position={[12, 0, -4]} type="water_tower" />
      <WildWestBuilding position={[-11, 0, -3]} type="barn" />

      {location === "sheriff" && (
        <WildWestBuilding position={[4, 0, -4]} type="jail" />
      )}
      {location === "general_store" && (
        <WildWestBuilding position={[-4, 0, -4]} type="bank" />
      )}

      <DirtPath position={[0, 0.02, 0]} />

      {[[-3, 0, 3], [5, 0, 4], [-9, 0, 5], [9, 0, 2], [0, 0, 8]].map((pos, i) => (
        <Cactus key={i} position={pos as [number, number, number]} size={0.7 + Math.random() * 0.5} />
      ))}

      {[[-5, 0, 2], [8, 0, -1]].map((pos, i) => (
        <Tree key={i} position={pos as [number, number, number]} era="wildwest" />
      ))}

      <HitchingPost position={[2, 0, -4]} />
      <HitchingPost position={[-2, 0, -4]} />

      {[[4, 0, -3], [-5, 0, -2], [0, 0, 3]].map((pos, i) => (
        <Barrel key={i} position={pos as [number, number, number]} />
      ))}

      {[[-4, 0, 0], [6, 0, -1]].map((pos, i) => (
        <group key={`wp-${i}`} position={pos as [number, number, number]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 3, 6]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodWeathered} roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.1, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffcc66" emissive="#ffaa33" emissiveIntensity={1} />
          </mesh>
          <pointLight position={[0, 3.1, 0]} intensity={0.4} color="#ffaa33" distance={5} decay={2} />
        </group>
      ))}

      <FloatingParticles count={60} color={WILDWEST_PALETTE.particle} spread={30} speed={0.2} />
    </group>
  );
}

export const ERA_ENVIRONMENT_CONFIG: Record<EraType, EraEnvironmentConfig> = {
  modern: {
    groundColor: MODERN_PALETTE.ground,
    groundMaterial: "concrete",
    skyColor: MODERN_PALETTE.sky,
    fogColor: MODERN_PALETTE.fog,
    fogNear: 15, fogFar: 45,
    ambientIntensity: 0.35,
    ambientColor: "#b0c4de",
    sunPosition: [8, 12, 5],
    sunIntensity: 0.9,
    sunColor: "#ffffff",
    particleColor: MODERN_PALETTE.particle,
    particleCount: 120,
  },
  medieval: {
    groundColor: MEDIEVAL_PALETTE.ground,
    groundMaterial: "dirt",
    skyColor: MEDIEVAL_PALETTE.sky,
    fogColor: MEDIEVAL_PALETTE.fog,
    fogNear: 10, fogFar: 35,
    ambientIntensity: 0.2,
    ambientColor: "#ffa500",
    sunPosition: [5, 8, 5],
    sunIntensity: 0.5,
    sunColor: "#ffd700",
    particleColor: MEDIEVAL_PALETTE.particle,
    particleCount: 80,
  },
  wildwest: {
    groundColor: WILDWEST_PALETTE.ground,
    groundMaterial: "sand",
    skyColor: WILDWEST_PALETTE.sky,
    fogColor: WILDWEST_PALETTE.fog,
    fogNear: 12, fogFar: 40,
    ambientIntensity: 0.3,
    ambientColor: "#f59e0b",
    sunPosition: [10, 6, 3],
    sunIntensity: 0.8,
    sunColor: "#ff8c00",
    particleColor: WILDWEST_PALETTE.particle,
    particleCount: 60,
  },
};

export const SCENE_CONFIGS: Record<string, { era: EraType; location: LocationType; name: string; cameraPosition: [number, number, number]; lookAt: [number, number, number] }> = {
  "modern-home": { era: "modern", location: "home", name: "Your Apartment", cameraPosition: [0, 5, 14], lookAt: [0, 2, -5] },
  "modern-office": { era: "modern", location: "office", name: "Downtown Office", cameraPosition: [2, 6, 15], lookAt: [0, 3, -5] },
  "modern-gym": { era: "modern", location: "gym", name: "Fitness Center", cameraPosition: [-2, 4, 12], lookAt: [0, 2, -4] },
  "modern-cafe": { era: "modern", location: "cafe", name: "Corner Café", cameraPosition: [3, 4, 13], lookAt: [0, 1, -3] },
  "modern-park": { era: "modern", location: "park", name: "City Park", cameraPosition: [0, 6, 16], lookAt: [0, 1, -2] },
  "modern-library": { era: "modern", location: "library", name: "Public Library", cameraPosition: [-3, 5, 14], lookAt: [0, 2, -5] },
  "modern-mall": { era: "modern", location: "mall", name: "Shopping Mall", cameraPosition: [4, 5, 15], lookAt: [0, 3, -5] },
  "modern-restaurant": { era: "modern", location: "restaurant", name: "Restaurant", cameraPosition: [1, 4, 12], lookAt: [0, 2, -4] },
  "medieval-town_square": { era: "medieval", location: "town_square", name: "Town Square", cameraPosition: [0, 6, 15], lookAt: [0, 2, -5] },
  "medieval-castle": { era: "medieval", location: "castle", name: "The Castle", cameraPosition: [0, 8, 18], lookAt: [0, 3, -6] },
  "medieval-tavern": { era: "medieval", location: "tavern", name: "The Tavern", cameraPosition: [2, 4, 12], lookAt: [0, 2, -4] },
  "medieval-market": { era: "medieval", location: "market", name: "Market Square", cameraPosition: [-2, 5, 14], lookAt: [0, 1, -3] },
  "medieval-chapel": { era: "medieval", location: "chapel", name: "The Chapel", cameraPosition: [3, 5, 14], lookAt: [0, 3, -4] },
  "medieval-blacksmith": { era: "medieval", location: "blacksmith", name: "Blacksmith", cameraPosition: [-3, 4, 12], lookAt: [0, 2, -4] },
  "wildwest-saloon": { era: "wildwest", location: "saloon", name: "The Saloon", cameraPosition: [0, 5, 14], lookAt: [0, 2, -5] },
  "wildwest-sheriff": { era: "wildwest", location: "sheriff", name: "Sheriff's Office", cameraPosition: [2, 4, 13], lookAt: [0, 2, -4] },
  "wildwest-general_store": { era: "wildwest", location: "general_store", name: "General Store", cameraPosition: [-2, 4, 12], lookAt: [0, 2, -4] },
  "wildwest-ranch": { era: "wildwest", location: "ranch", name: "The Ranch", cameraPosition: [0, 6, 16], lookAt: [0, 1, -3] },
  "wildwest-mine": { era: "wildwest", location: "mine", name: "Gold Mine", cameraPosition: [3, 5, 14], lookAt: [0, 2, -5] },
};
