import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function UniverseGalaxy({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const galaxyRef = useRef();
  const planet1Ref = useRef();
  const planet2Ref = useRef();
  const planet3Ref = useRef();

  // Spiral galaxy particles
  const galaxyCount = 2000;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(galaxyCount * 3);
    const col = new Float32Array(galaxyCount * 3);

    const insideColor = new THREE.Color('#e0e7ff');
    const outsideColor = new THREE.Color('#3b82f6');

    for (let i = 0; i < galaxyCount; i++) {
      // 2 spiral arms
      const i3 = i * 3;
      const radius = Math.random() * 5.0 + 0.2;
      const spinAngle = radius * 2.5;
      const branchAngle = ((i % 2) * Math.PI * 2) / 2;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * radius;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.2 * radius;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * radius;

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = randomY;
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color lerp from white core to blue/purple arms
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / 5.0);

      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }

    return [pos, col];
  }, [galaxyCount]);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();

    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = t * 0.05;
    }

    // Distant floating spheres with subtle orbital motion
    if (planet1Ref.current) {
      planet1Ref.current.position.y = -0.5 + Math.sin(t * 0.6) * 0.1;
      planet1Ref.current.rotation.y = t * 0.08;
    }
    if (planet2Ref.current) {
      planet2Ref.current.position.y = 0.8 + Math.cos(t * 0.5) * 0.08;
      planet2Ref.current.rotation.y = -t * 0.06;
    }
    if (planet3Ref.current) {
      planet3Ref.current.position.y = -0.9 + Math.sin(t * 0.4) * 0.12;
      planet3Ref.current.rotation.y = t * 0.04;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {/* Central Galactic Core Glow */}
      <pointLight position={[0, 0, -2]} intensity={2.0 * opacity} color="#93c5fd" distance={8} />

      {/* Rotating Spiral Galaxy */}
      <group ref={galaxyRef} position={[0, -0.3, -2.5]} rotation={[0.6, 0.2, -0.3]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={galaxyCount}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={galaxyCount}
              array={colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.055}
            vertexColors
            transparent
            opacity={0.8 * opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* Floating Distant Planet 1 (Left foreground) */}
      <group ref={planet1Ref} position={[-2.4, -0.5, 0.5]}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color="#94a3b8"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
        {/* Orbit ring framing */}
        <mesh>
          <ringGeometry args={[0.68, 0.71, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.35 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Floating Distant Planet 2 (Right midground) */}
      <group ref={planet2Ref} position={[2.6, 0.7, -0.8]}>
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color="#64748b"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.52, 0.54, 48]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.3 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Floating Distant Planet 3 (Center background) */}
      <group ref={planet3Ref} position={[-0.8, -0.9, -1.5]}>
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.85}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.42, 0.44, 48]} />
          <meshBasicMaterial
            color="#60a5fa"
            transparent
            opacity={0.25 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
