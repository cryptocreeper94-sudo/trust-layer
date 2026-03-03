import { Suspense, useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { AssetManifest } from "./types";

const assetCache = new Map<string, THREE.Group>();
const failedUrls = new Set<string>();

const DEFAULT_MANIFEST: AssetManifest = {};

export function useAssetManifest(): AssetManifest {
  return DEFAULT_MANIFEST;
}

interface GLBModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function GLBModel({ url, position, rotation, scale, onLoad, onError }: GLBModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const gltf = useLoader(GLTFLoader, url, undefined, (error: any) => {
    failedUrls.add(url);
    onError?.(error instanceof Error ? error : new Error(String(error)));
  });

  useEffect(() => {
    if (gltf) {
      const cloned = gltf.scene.clone(true);
      cloned.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(cloned);
      }

      assetCache.set(url, cloned);
      onLoad?.();
    }
  }, [gltf, url]);

  const scaleArr: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale || 1, scale || 1, scale || 1];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation ? rotation.map(r => r * Math.PI / 180) as [number, number, number] : undefined}
      scale={scaleArr}
    />
  );
}

interface AssetOrFallbackProps {
  assetKey: string;
  manifest: AssetManifest;
  position?: [number, number, number];
  rotation?: [number, number, number];
  fallback: ReactNode;
  onLoad?: () => void;
}

export function AssetOrFallback({ assetKey, manifest, position, rotation, fallback, onLoad }: AssetOrFallbackProps) {
  const entry = manifest[assetKey];

  if (!entry?.url || failedUrls.has(entry.url)) {
    return <group position={position} rotation={rotation ? rotation.map(r => r * Math.PI / 180) as [number, number, number] : undefined}>{fallback}</group>;
  }

  return (
    <Suspense fallback={<group position={position}>{fallback}</group>}>
      <GLBModel
        url={entry.url}
        position={position}
        rotation={rotation || entry.rotation}
        scale={entry.scale}
        onLoad={onLoad}
      />
    </Suspense>
  );
}

export function PlaceholderBuilding({
  label,
  width = 3,
  height = 4,
  depth = 3,
  color = "#334155",
  accentColor = "#06b6d4",
  position = [0, 0, 0] as [number, number, number],
}: {
  label?: string;
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  accentColor?: string;
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
      </mesh>
      {label && (
        <mesh position={[0, height / 2, depth / 2 + 0.02]}>
          <planeGeometry args={[width * 0.7, 0.6]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
}

interface LoadingProgressProps {
  progress: number;
  isVisible: boolean;
}

export function LoadingOverlay({ progress, isVisible }: LoadingProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-opacity duration-500" data-testid="scene-loading">
      <div className="text-center">
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">Loading scene... {Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export function useLoadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isLoading) {
      const animate = () => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false);
            return 100;
          }
          return Math.min(100, prev + Math.random() * 15 + 5);
        });
        timer = setTimeout(animate, 200 + Math.random() * 300);
      };
      timer = setTimeout(animate, 100);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const reset = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return { progress, isLoading, reset };
}
