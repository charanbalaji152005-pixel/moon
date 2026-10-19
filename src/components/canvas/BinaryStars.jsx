import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BinaryStars({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const star1Ref = useRef();
  const star2Ref = useRef();
  const trailRef = useRef();

  // Orbit path ellipse
  const orbitGeometry = useMemo(() => {
    const pts = [];
    const segs = 96;
    const r = 1.6;
    for (let i = 0; i <= segs; i++) {
      const theta = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r * 0.4, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime() * 0.9;
    const r = 1.6;

    // Star 1: Yellow-Gold Star
    if (star1Ref.current) {
      star1Ref.current.position.set(
        Math.cos(t) * r,
        Math.sin(t) * r * 0.4,
        Math.sin(t) * 0.3
      );
    }

    // Star 2: Blue-Cyan Star (180 degrees opposite)
    if (star2Ref.current) {
      star2Ref.current.position.set(
        Math.cos(t + Math.PI) * r * 0.85,
        Math.sin(t + Math.PI) * r * 0.34,
        Math.sin(t + Math.PI) * 0.25
      );
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.35, 0.1, 0]} visible={opacity > 0.01}>
      {/* Mutual Gravitational Orbit Ellipse */}
      <line geometry={orbitGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.25 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Star 1: Golden Solar Giant */}
      <group ref={star1Ref} position={[-1.6, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
        {/* Amber Corona */}
        <mesh>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.45 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight color="#f59e0b" intensity={3.0 * opacity} distance={8} />
      </group>

      {/* Star 2: Electric Cyan-Blue Dwarf */}
      <group ref={star2Ref} position={[1.36, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshBasicMaterial color="#e0f2fe" />
        </mesh>
        {/* Cyan Corona */}
        <mesh>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.55 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight color="#38bdf8" intensity={3.5 * opacity} distance={8} />
      </group>
    </group>
  );
}
