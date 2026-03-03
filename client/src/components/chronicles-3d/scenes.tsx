import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EraType, LocationType, SceneConfig, PropConfig, ProceduralMeshConfig } from "./types";

const MODERN_PALETTE = {
  building1: "#1e293b", building2: "#334155", building3: "#475569",
  glass: "#06b6d4", glassDark: "#0e7490", roof: "#0f172a",
  concrete: "#94a3b8", sidewalk: "#64748b", grass: "#166534",
  ground: "#1a1f2e", sky: "#0a0f1a", fog: "#0c1220",
  accent: "#06b6d4", particle: "#06b6d4",
};

const MEDIEVAL_PALETTE = {
  stone: "#8B7355", stoneDark: "#6B5B45", wood: "#5C3A1E",
  woodLight: "#A0855B", thatch: "#8B6914", moss: "#2D5016",
  tower: "#696969", towerDark: "#4A4A4A", dirt: "#3d2b10",
  ground: "#2a1f0f", sky: "#0a0800", fog: "#1a1200",
  accent: "#eab308", particle: "#eab308",
};

const WILDWEST_PALETTE = {
  wood: "#C4A574", woodDark: "#8B6914", plank: "#B8956A",
  metal: "#8B7355", barrel: "#6B4226", sand: "#d4a76a",
  cactus: "#5C8A3C", cactusDark: "#2D6B16", dust: "#c4a060",
  ground: "#3d2b10", sky: "#1a1200", fog: "#2a1f0f",
  accent: "#f59e0b", particle: "#f59e0b",
};

function ProceduralMesh({ config, position, rotation, scale }: {
  config: ProceduralMeshConfig;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  const Geometry = () => {
    switch (config.shape) {
      case "box": return <boxGeometry args={config.args as [number, number, number]} />;
      case "cylinder": return <cylinderGeometry args={config.args as [number, number, number, number]} />;
      case "cone": return <coneGeometry args={config.args as [number, number, number]} />;
      case "sphere": return <sphereGeometry args={config.args as [number, number]} />;
      case "plane": return <planeGeometry args={config.args as [number, number]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group
      position={position || config.offset || [0, 0, 0]}
      rotation={rotation ? rotation.map(r => r * Math.PI / 180) as [number, number, number] : undefined}
      scale={scale}
    >
      <mesh castShadow receiveShadow>
        <Geometry />
        <meshStandardMaterial
          color={config.color}
          roughness={config.roughness ?? 0.8}
          metalness={config.metalness ?? 0}
          emissive={config.emissive || "#000000"}
          emissiveIntensity={config.emissiveIntensity || 0}
        />
      </mesh>
      {config.children?.map((child, i) => (
        <ProceduralMesh key={i} config={child} />
      ))}
    </group>
  );
}

function ModernBuilding({ position, height, width, depth, color, glassColor }: {
  position: [number, number, number];
  height: number; width: number; depth: number;
  color: string; glassColor?: string;
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
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowCols }).map((_, col) => {
          const wx = (col - (windowCols - 1) / 2) * (width / (windowCols + 0.5));
          const wy = 1 + row * 1.2;
          if (wy > height - 0.5) return null;
          return (
            <mesh key={`${row}-${col}`} position={[wx, wy, depth / 2 + 0.01]}>
              <boxGeometry args={[0.6, 0.8, 0.02]} />
              <meshStandardMaterial
                color={gc} emissive={gc}
                emissiveIntensity={Math.random() > 0.3 ? 0.4 : 0.1}
                roughness={0.1} metalness={0.8}
              />
            </mesh>
          );
        })
      )}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.2, 0.3, depth + 0.2]} />
        <meshStandardMaterial color={MODERN_PALETTE.roof} roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

function MedievalStructure({ position, type }: {
  position: [number, number, number];
  type: "cottage" | "tower" | "keep" | "wall";
}) {
  if (type === "tower") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 3, 0]}>
          <cylinderGeometry args={[1, 1.2, 6, 8]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.9} />
        </mesh>
        <mesh position={[0, 6.5, 0]}>
          <coneGeometry args={[1.5, 2, 8]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.towerDark} roughness={0.7} />
        </mesh>
        {[0, 90, 180, 270].map(angle => (
          <mesh key={angle} position={[
            Math.cos(angle * Math.PI / 180) * 1.3,
            6,
            Math.sin(angle * Math.PI / 180) * 1.3
          ]}>
            <boxGeometry args={[0.3, 0.6, 0.15]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.9} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "keep") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        <mesh position={[0, 4.5, 0]}>
          <coneGeometry args={[3, 2, 4]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.5, 2.01]}>
          <boxGeometry args={[1.2, 2, 0.1]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.woodLight} roughness={0.9} />
        </mesh>
        {[-1.5, 1.5].map(x => (
          <mesh key={x} position={[x, 2.8, 2.01]}>
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
          <boxGeometry args={[8, 3, 0.8]} />
          <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
        </mesh>
        {[-3, 0, 3].map(x => (
          <mesh key={x} position={[x, 3.3, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.9]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.9} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 2.4, 2.5]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.woodLight} roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.thatch} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.8, 1.26]}>
        <boxGeometry args={[0.8, 1.4, 0.1]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 1.6, 1.26]}>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.8} />
      </mesh>
    </group>
  );
}

function WildWestBuilding({ position, type }: {
  position: [number, number, number];
  type: "saloon" | "shop" | "barn" | "water_tower";
}) {
  if (type === "water_tower") {
    return (
      <group position={position}>
        {[[-0.5, 0, -0.5], [0.5, 0, -0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 1.5, 12]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.metal} roughness={0.8} />
        </mesh>
        <mesh position={[0, 3.4, 0]}>
          <coneGeometry args={[1.1, 0.5, 12]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
        </mesh>
      </group>
    );
  }

  if (type === "barn") {
    return (
      <group position={position}>
        <mesh castShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3, 3]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.95} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.1, 2.5, 1.5, 4, 1, false, Math.PI / 4]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.2, 1.51]}>
          <boxGeometry args={[2, 2.2, 0.1]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.wood} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  const isSaloon = type === "saloon";
  const height = isSaloon ? 4 : 3;
  const facadeExtra = isSaloon ? 1 : 0.5;

  return (
    <group position={position}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[3.5, height, 3]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.wood} roughness={0.95} />
      </mesh>
      <mesh position={[0, height / 2 + facadeExtra / 2, 1.51]}>
        <boxGeometry args={[3.8, height + facadeExtra, 0.1]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
      </mesh>
      <mesh position={[0, height + facadeExtra + 0.2, 1.51]}>
        <boxGeometry args={[4, 0.4, 0.15]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.15, 2]}>
        <boxGeometry args={[4, 0.15, 1.5]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.plank} roughness={0.9} />
      </mesh>
      {isSaloon && (
        <>
          <mesh position={[-1.3, 0.15, 2.8]}>
            <cylinderGeometry args={[0.08, 0.08, 2.5, 6]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
          </mesh>
          <mesh position={[1.3, 0.15, 2.8]}>
            <cylinderGeometry args={[0.08, 0.08, 2.5, 6]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.5, 2.8]}>
            <boxGeometry args={[2.8, 0.1, 0.05]} />
            <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.85} />
          </mesh>
        </>
      )}
      <mesh position={[0, 1, 1.62]}>
        <boxGeometry args={[0.9, 1.8, 0.05]} />
        <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
      </mesh>
      {[-1.2, 1.2].map(x => (
        <mesh key={x} position={[x, 2.2, 1.62]}>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial color="#87CEEB" roughness={0.2} metalness={0.3} opacity={0.6} transparent />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, era }: { position: [number, number, number]; era: EraType }) {
  const trunkColor = era === "wildwest" ? "#5C8A3C" : "#5C4033";
  const leafColor = era === "medieval" ? "#2D5016" : era === "wildwest" ? "#3D7B26" : "#166534";
  const trunkHeight = era === "wildwest" ? 2 : 3;
  const leafSize = era === "wildwest" ? 0.8 : 1.5;

  if (era === "wildwest") {
    return (
      <group position={position}>
        <mesh position={[0, trunkHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, trunkHeight, 6]} />
          <meshStandardMaterial color={trunkColor} roughness={0.9} />
        </mesh>
        {[0, 120, 240].map((angle, i) => (
          <mesh key={i} position={[
            Math.cos(angle * Math.PI / 180) * 0.3,
            trunkHeight * 0.6 + i * 0.4,
            Math.sin(angle * Math.PI / 180) * 0.3
          ]}>
            <sphereGeometry args={[leafSize - i * 0.15, 6, 5]} />
            <meshStandardMaterial color={leafColor} roughness={0.85} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.2, trunkHeight, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, trunkHeight + leafSize * 0.5, 0]}>
        <sphereGeometry args={[leafSize, 8, 7]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.4, trunkHeight + leafSize * 0.2, 0.3]}>
        <sphereGeometry args={[leafSize * 0.7, 7, 6]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Cactus({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 2.4, 8]} />
        <meshStandardMaterial color="#2D6B16" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
        <meshStandardMaterial color="#3D7B26" roughness={0.8} />
      </mesh>
      <mesh position={[-0.25, 1.8, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.07, 0.09, 0.6, 6]} />
        <meshStandardMaterial color="#3D7B26" roughness={0.8} />
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
      arr[i * 3 + 1] = Math.random() * spread * 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.02;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed * 0.5 + i) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function ModernScene({ location }: { location: LocationType }) {
  return (
    <group>
      <ModernBuilding position={[0, 0, -10]} height={8} width={4} depth={3} color={MODERN_PALETTE.building1} />
      <ModernBuilding position={[-6, 0, -8]} height={5} width={3} depth={3} color={MODERN_PALETTE.building2} />
      <ModernBuilding position={[6, 0, -9]} height={6} width={3.5} depth={3} color={MODERN_PALETTE.building3} />
      <ModernBuilding position={[-10, 0, -6]} height={4} width={2.5} depth={2.5} color={MODERN_PALETTE.building2} glassColor="#8b5cf6" />
      <ModernBuilding position={[10, 0, -7]} height={3} width={3} depth={2.5} color={MODERN_PALETTE.building1} />

      {location === "park" && (
        <>
          {[[-3, 0, -2], [3, 0, -3], [-1, 0, -5], [5, 0, -1], [-5, 0, 2]].map((pos, i) => (
            <Tree key={i} position={pos as [number, number, number]} era="modern" />
          ))}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} receiveShadow>
            <circleGeometry args={[4, 32]} />
            <meshStandardMaterial color="#166534" roughness={0.95} />
          </mesh>
        </>
      )}

      {(location === "home" || location === "office") && (
        <>
          <mesh position={[0, 0.02, 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color={MODERN_PALETTE.sidewalk} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.15, 4]}>
            <boxGeometry args={[0.15, 0.3, 0.15]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} />
          </mesh>
        </>
      )}

      <mesh position={[-2, 0.02, 6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 3]} />
        <meshStandardMaterial color="#374151" roughness={0.85} />
      </mesh>

      <FloatingParticles count={150} color={MODERN_PALETTE.particle} spread={30} speed={1} />
    </group>
  );
}

export function MedievalScene({ location }: { location: LocationType }) {
  return (
    <group>
      <MedievalStructure position={[0, 0, -8]} type="keep" />
      <MedievalStructure position={[-6, 0, -5]} type="cottage" />
      <MedievalStructure position={[5, 0, -6]} type="tower" />
      <MedievalStructure position={[-3, 0, -12]} type="wall" />
      <MedievalStructure position={[8, 0, -3]} type="cottage" />

      {location === "chapel" && (
        <group position={[0, 0, -4]}>
          <mesh castShadow position={[0, 2.5, 0]}>
            <boxGeometry args={[3, 5, 4]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stone} roughness={0.95} />
          </mesh>
          <mesh position={[0, 5.5, 0]}>
            <coneGeometry args={[2, 2, 4]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
          </mesh>
          <mesh position={[0, 6.8, 0]}>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.7} />
          </mesh>
          <mesh position={[0, 7, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.1]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.stoneDark} roughness={0.7} />
          </mesh>
        </group>
      )}

      {[[-4, 0, -2], [4, 0, -1], [7, 0, 2], [-7, 0, 1]].map((pos, i) => (
        <Tree key={i} position={pos as [number, number, number]} era="medieval" />
      ))}

      {[-3, 3].map(x => (
        <group key={x} position={[x, 0, -3]}>
          <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff8c00" distance={5} />
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2.4, 6]} />
            <meshStandardMaterial color={MEDIEVAL_PALETTE.wood} roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}

      <FloatingParticles count={100} color={MEDIEVAL_PALETTE.particle} spread={25} speed={0.5} />
    </group>
  );
}

export function WildWestScene({ location }: { location: LocationType }) {
  return (
    <group>
      <WildWestBuilding position={[0, 0, -7]} type="saloon" />
      <WildWestBuilding position={[-6, 0, -5]} type="shop" />
      <WildWestBuilding position={[6, 0, -6]} type="shop" />
      <WildWestBuilding position={[10, 0, -4]} type="water_tower" />
      <WildWestBuilding position={[-10, 0, -3]} type="barn" />

      {[[-3, 0, 2], [4, 0, 3], [-8, 0, 5], [8, 0, 1]].map((pos, i) => (
        <Cactus key={i} position={pos as [number, number, number]} />
      ))}

      {[[-5, 0, 1], [7, 0, -1]].map((pos, i) => (
        <Tree key={i} position={pos as [number, number, number]} era="wildwest" />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[5, 20]} />
        <meshStandardMaterial color="#8B7355" roughness={0.95} />
      </mesh>

      <group position={[3, 0, 5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 12]} />
          <meshStandardMaterial color={WILDWEST_PALETTE.woodDark} roughness={0.9} />
        </mesh>
      </group>

      <FloatingParticles count={80} color={WILDWEST_PALETTE.particle} spread={30} speed={0.3} />
    </group>
  );
}

export const ERA_ENVIRONMENT_CONFIG: Record<EraType, {
  groundColor: string; skyColor: string; fogColor: string;
  fogNear: number; fogFar: number; ambientIntensity: number; ambientColor: string;
  sunPosition: [number, number, number]; sunIntensity: number; sunColor: string;
}> = {
  modern: {
    groundColor: MODERN_PALETTE.ground,
    skyColor: MODERN_PALETTE.sky,
    fogColor: MODERN_PALETTE.fog,
    fogNear: 15, fogFar: 45,
    ambientIntensity: 0.35,
    ambientColor: "#b0c4de",
    sunPosition: [8, 12, 5],
    sunIntensity: 0.9,
    sunColor: "#ffffff",
  },
  medieval: {
    groundColor: MEDIEVAL_PALETTE.ground,
    skyColor: MEDIEVAL_PALETTE.sky,
    fogColor: MEDIEVAL_PALETTE.fog,
    fogNear: 10, fogFar: 35,
    ambientIntensity: 0.25,
    ambientColor: "#ffa500",
    sunPosition: [5, 8, 5],
    sunIntensity: 0.6,
    sunColor: "#ffd700",
  },
  wildwest: {
    groundColor: WILDWEST_PALETTE.ground,
    skyColor: WILDWEST_PALETTE.sky,
    fogColor: WILDWEST_PALETTE.fog,
    fogNear: 12, fogFar: 40,
    ambientIntensity: 0.3,
    ambientColor: "#f59e0b",
    sunPosition: [10, 6, 3],
    sunIntensity: 0.8,
    sunColor: "#ff8c00",
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
