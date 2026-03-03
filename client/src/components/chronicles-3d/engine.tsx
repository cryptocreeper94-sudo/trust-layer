import { useState, useEffect, useCallback, Suspense, useMemo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Sky } from "@react-three/drei";
import * as THREE from "three";
import { CameraController } from "./camera";
import { LoadingOverlay, useLoadingProgress } from "./assets";
import { OverlayContainer, OverlaySlot, StatsOverlay, SceneTransition } from "./overlay";
import { ModernScene, MedievalScene, WildWestScene, ERA_ENVIRONMENT_CONFIG, SCENE_CONFIGS } from "./scenes";
import type { EraType, LocationType } from "./types";

interface ChroniclesEngineProps {
  era: EraType;
  location?: LocationType;
  level?: number;
  xp?: number;
  shells?: number;
  className?: string;
  height?: string;
  showStats?: boolean;
  children?: ReactNode;
}

function GroundPlane({ era }: { era: EraType }) {
  const envConfig = ERA_ENVIRONMENT_CONFIG[era];

  const textureProps = useMemo(() => {
    switch (envConfig.groundMaterial) {
      case "concrete":
        return { roughness: 0.9, metalness: 0.05 };
      case "grass":
        return { roughness: 0.95, metalness: 0 };
      case "dirt":
        return { roughness: 0.98, metalness: 0 };
      case "stone":
        return { roughness: 0.92, metalness: 0.02 };
      case "sand":
        return { roughness: 0.97, metalness: 0 };
      default:
        return { roughness: 0.95, metalness: 0 };
    }
  }, [envConfig.groundMaterial]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color={envConfig.groundColor} {...textureProps} />
    </mesh>
  );
}

function LightingRig({ era }: { era: EraType }) {
  const envConfig = ERA_ENVIRONMENT_CONFIG[era];

  return (
    <>
      <ambientLight intensity={envConfig.ambientIntensity} color={envConfig.ambientColor} />
      <directionalLight
        position={envConfig.sunPosition}
        intensity={envConfig.sunIntensity}
        color={envConfig.sunColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
      />
      <hemisphereLight
        args={[envConfig.ambientColor, envConfig.groundColor, 0.25]}
      />
    </>
  );
}

function AtmosphereEffects({ era }: { era: EraType }) {
  const envConfig = ERA_ENVIRONMENT_CONFIG[era];

  return (
    <>
      <Stars
        radius={60}
        depth={60}
        count={era === "medieval" ? 2500 : era === "wildwest" ? 800 : 1500}
        factor={era === "medieval" ? 4 : 3}
        saturation={0}
        fade
        speed={0.2}
      />
      <fog attach="fog" args={[envConfig.fogColor, envConfig.fogNear, envConfig.fogFar]} />
    </>
  );
}

function SceneEnvironment({ era, location }: { era: EraType; location: LocationType }) {
  return (
    <group>
      <GroundPlane era={era} />
      <LightingRig era={era} />
      <AtmosphereEffects era={era} />

      {era === "modern" && <ModernScene location={location} />}
      {era === "medieval" && <MedievalScene location={location} />}
      {era === "wildwest" && <WildWestScene location={location} />}
    </group>
  );
}

export function ChroniclesEngine({
  era,
  location = "home",
  level,
  xp,
  shells,
  className,
  height = "h-48 sm:h-56 md:h-64",
  showStats = true,
  children,
}: ChroniclesEngineProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeEra, setActiveEra] = useState(era);
  const [activeLocation, setActiveLocation] = useState(location);
  const { progress, isLoading, reset: resetLoading } = useLoadingProgress();
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (era !== activeEra || location !== activeLocation) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setActiveEra(era);
        setActiveLocation(location);
        resetLoading();
        setTimeout(() => setIsTransitioning(false), 350);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [era, location]);

  const sceneKey = `${activeEra}-${activeLocation}`;
  const sceneConfig = SCENE_CONFIGS[sceneKey] || SCENE_CONFIGS[`${activeEra}-home`] || {
    cameraPosition: [0, 5, 14] as [number, number, number],
    lookAt: [0, 2, -5] as [number, number, number],
    name: activeLocation.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
  };

  const locationName = sceneConfig.name || activeLocation;

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  if (!webglSupported) {
    return (
      <div className={`relative ${height} rounded-xl overflow-hidden ${className || ""}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-gray-400 text-sm">3D rendering is not supported on this device.</p>
            <p className="text-gray-500 text-xs mt-1">Try a different browser or enable WebGL.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${height} rounded-xl overflow-hidden ${className || ""}`} data-testid="chronicles-3d-engine">
      <Canvas
        shadows={!isMobile}
        camera={{
          position: sceneConfig.cameraPosition,
          fov: 55,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: !isMobile,
          powerPreference: isMobile ? "low-power" : "high-performance",
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <SceneEnvironment era={activeEra} location={activeLocation} />
          <CameraController
            targetPosition={sceneConfig.cameraPosition}
            lookAt={sceneConfig.lookAt}
            autoRotate={true}
            autoRotateSpeed={0.12}
            cinematicIntro={era !== activeEra}
          />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

      <OverlayContainer>
        {showStats && (
          <OverlaySlot position="top">
            <StatsOverlay
              era={activeEra}
              location={activeLocation}
              locationName={locationName}
              level={level}
              xp={xp}
              shells={shells}
            />
          </OverlaySlot>
        )}
      </OverlayContainer>

      <SceneTransition isTransitioning={isTransitioning} locationName={locationName} />
      <LoadingOverlay progress={progress} isVisible={isLoading} />

      {children}
    </div>
  );
}
