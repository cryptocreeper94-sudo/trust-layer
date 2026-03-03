import type * as THREE from "three";

export type EraType = "modern" | "medieval" | "wildwest";

export type LocationType =
  | "home" | "office" | "gym" | "cafe"
  | "park" | "library" | "mall" | "restaurant"
  | "town_square" | "castle" | "tavern" | "market"
  | "chapel" | "blacksmith" | "saloon" | "sheriff"
  | "general_store" | "ranch" | "mine";

export interface SceneConfig {
  id: string;
  name: string;
  era: EraType;
  location: LocationType;
  camera: {
    position: [number, number, number];
    lookAt: [number, number, number];
    fov: number;
  };
  lighting: {
    ambientIntensity: number;
    ambientColor: string;
    sunPosition: [number, number, number];
    sunIntensity: number;
    sunColor: string;
    pointLights?: Array<{
      position: [number, number, number];
      intensity: number;
      color: string;
      distance?: number;
    }>;
  };
  environment: {
    skyColor: string;
    groundColor: string;
    fogColor: string;
    fogNear: number;
    fogFar: number;
    particleColor: string;
    particleCount: number;
  };
  props: PropConfig[];
}

export interface PropConfig {
  id: string;
  type: "building" | "tree" | "furniture" | "decoration" | "ground_feature";
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  modelUrl?: string;
  procedural?: ProceduralMeshConfig;
}

export interface ProceduralMeshConfig {
  shape: "box" | "cylinder" | "cone" | "sphere" | "plane";
  args: number[];
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  children?: ProceduralMeshConfig[];
  offset?: [number, number, number];
}

export interface AssetManifest {
  [key: string]: {
    url: string;
    scale?: number;
    rotation?: [number, number, number];
  };
}

export interface EngineState {
  currentScene: string | null;
  currentEra: EraType;
  currentLocation: LocationType;
  isTransitioning: boolean;
  loadingProgress: number;
  isLoaded: boolean;
}
