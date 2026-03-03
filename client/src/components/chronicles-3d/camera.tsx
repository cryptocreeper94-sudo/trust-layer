import { useRef, useEffect, useCallback, useState } from "react";
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
  cinematicIntro?: boolean;
  onTransitionComplete?: () => void;
}

export function CameraController({
  targetPosition,
  lookAt,
  fov = 55,
  transitionSpeed = 1.8,
  enableOrbit = true,
  autoRotate = true,
  autoRotateSpeed = 0.12,
  cinematicIntro = true,
  onTransitionComplete,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPosVec = useRef(new THREE.Vector3(...targetPosition));
  const targetLookVec = useRef(new THREE.Vector3(...lookAt));
  const isTransitioning = useRef(true);
  const transitionProgress = useRef(0);
  const introPhase = useRef(cinematicIntro ? "dolly" : "none");
  const introTime = useRef(0);

  useEffect(() => {
    const prevPos = targetPosVec.current.clone();
    const newPos = new THREE.Vector3(...targetPosition);
    const distance = prevPos.distanceTo(newPos);

    targetPosVec.current.set(...targetPosition);
    targetLookVec.current.set(...lookAt);
    isTransitioning.current = true;
    transitionProgress.current = 0;

    if (cinematicIntro && distance > 2) {
      introPhase.current = "dolly";
      introTime.current = 0;
    }
  }, [targetPosition[0], targetPosition[1], targetPosition[2], lookAt[0], lookAt[1], lookAt[2]]);

  useFrame((state, delta) => {
    if (!isTransitioning.current && introPhase.current === "none") return;

    const clampedDelta = Math.min(delta, 0.05);

    if (introPhase.current === "dolly") {
      introTime.current += clampedDelta;
      const introDuration = 1.5;
      const t = Math.min(introTime.current / introDuration, 1);
      const eased = easeOutQuart(t);

      const offsetPos = targetPosVec.current.clone();
      offsetPos.y += (1 - eased) * 3;
      offsetPos.z += (1 - eased) * 5;

      camera.position.lerp(offsetPos, 0.06);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookVec.current, 0.06);
        controlsRef.current.update();
      }

      if (t >= 1) {
        introPhase.current = "none";
        isTransitioning.current = true;
        transitionProgress.current = 0.5;
      }
      return;
    }

    transitionProgress.current = Math.min(1, transitionProgress.current + clampedDelta * transitionSpeed);
    const t = easeInOutCubic(transitionProgress.current);

    const lerpFactor = t * 0.06 + 0.025;
    camera.position.lerp(targetPosVec.current, lerpFactor);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookVec.current, lerpFactor);
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
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={Math.PI / 6}
      maxDistance={22}
      minDistance={6}
      zoomSpeed={0.4}
      rotateSpeed={0.4}
      enableDamping
      dampingFactor={0.06}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}
