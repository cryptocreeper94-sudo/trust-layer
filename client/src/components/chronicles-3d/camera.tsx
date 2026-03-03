import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
  transitionSpeed?: number;
  enableOrbit?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onTransitionComplete?: () => void;
}

export function CameraController({
  targetPosition,
  lookAt,
  fov = 55,
  transitionSpeed = 2,
  enableOrbit = true,
  autoRotate = true,
  autoRotateSpeed = 0.15,
  onTransitionComplete,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPosVec = useRef(new THREE.Vector3(...targetPosition));
  const targetLookVec = useRef(new THREE.Vector3(...lookAt));
  const isTransitioning = useRef(true);
  const transitionProgress = useRef(0);

  useEffect(() => {
    targetPosVec.current.set(...targetPosition);
    targetLookVec.current.set(...lookAt);
    isTransitioning.current = true;
    transitionProgress.current = 0;
  }, [targetPosition[0], targetPosition[1], targetPosition[2], lookAt[0], lookAt[1], lookAt[2]]);

  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    transitionProgress.current = Math.min(1, transitionProgress.current + delta * transitionSpeed);
    const t = easeInOutCubic(transitionProgress.current);

    camera.position.lerp(targetPosVec.current, t * 0.05 + 0.02);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookVec.current, t * 0.05 + 0.02);
      controlsRef.current.update();
    }

    if (transitionProgress.current >= 1) {
      isTransitioning.current = false;
      onTransitionComplete?.();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      autoRotate={autoRotate && !isTransitioning.current}
      autoRotateSpeed={autoRotateSpeed}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 6}
      maxDistance={25}
      minDistance={8}
      zoomSpeed={0.5}
      rotateSpeed={0.5}
      enableDamping
      dampingFactor={0.05}
    />
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
