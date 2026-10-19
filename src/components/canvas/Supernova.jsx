import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Supernova({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const shockwave1Ref = useRef();
  const shockwave2Ref = useRef();
  const shockwave3Ref = useRef();
  const coreRef = useRef();
  const particlesRef = useRef();

  // Burst particle debris
  const particleCount = 400;
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.5 + Math.random() * 2.0;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed * 0.4;

      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }

    return [pos, vel];
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();

    // Pulsating Core
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(t * 8.0) * 0.15;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Expanding shockwave rings (cyclic loop)
    const cycle1 = (t * 0.8) % 2.5;
    const cycle2 = ((t * 0.8) + 0.8) % 2.5;
    const cycle3 = ((t * 0.8) + 1.6) % 2.5;

    if (shockwave1Ref.current) {
      const s = 1.0 + cycle1 * 2.2;
      shockwave1Ref.current.scale.set(s, s, s);
      shockwave1Ref.current.material.opacity = Math.max(0, (1.0 - cycle1 / 2.5) * 0.85 * opacity);
    }
    if (shockwave2Ref.current) {
      const s = 1.0 + cycle2 * 2.2;
      shockwave2Ref.current.scale.set(s, s, s);
      shockwave2Ref.current.material.opacity = Math.max(0, (1.0 - cycle2 / 2.5) * 0.7 * opacity);
    }
    if (shockwave3Ref.current) {
      const s = 1.0 + cycle3 * 2.2;
      shockwave3Ref.current.scale.set(s, s, s);
      shockwave3Ref.current.material.opacity = Math.max(0, (1.0 - cycle3 / 2.5) * 0.55 * opacity);
    }

    // Exploding debris particles
    if (particlesRef.current) {
      const posArr = particlesRef.current.geometry.attributes.position.array;
      const progress = (t * 0.6) % 3.0;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] = velocities[i * 3] * progress;
        posArr[i * 3 + 1] = velocities[i * 3 + 1] * progress;
        posArr[i * 3 + 2] = velocities[i * 3 + 2] * progress;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} visible={opacity > 0.01}>
      {/* Blinding Center Light */}
      <pointLight color="#fbbf24" intensity={8.0 * opacity} distance={12} />
      <pointLight color="#f43f5e" intensity={4.0 * opacity} distance={8} />

      {/* Luminous Inner Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Core Radiant Halo */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.65 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Expanding Concentric Shockwave Rings */}
      {/* Ring 1: Intense Gold */}
      <mesh ref={shockwave1Ref}>
        <ringGeometry args={[0.95, 1.08, 96]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.8 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 2: Radiant Orange */}
      <mesh ref={shockwave2Ref}>
        <ringGeometry args={[1.05, 1.25, 96]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.7 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 3: Deep Magenta Outer Wave */}
      <mesh ref={shockwave3Ref}>
        <ringGeometry args={[1.2, 1.45, 96]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.5 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ejected Star Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#fef08a"
          transparent
          opacity={0.75 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
