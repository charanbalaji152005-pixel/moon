import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SolarSystem({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const planetsRef = useRef([]);

  // Planet definitions with orbit radii, speeds, colors, and sizes
  const planets = useMemo(() => [
    { name: 'Mercury', r: 0.85, speed: 1.6, size: 0.05, color: '#94a3b8' },
    { name: 'Venus', r: 1.15, speed: 1.2, size: 0.075, color: '#fde047' },
    { name: 'Earth', r: 1.5, speed: 1.0, size: 0.08, color: '#38bdf8' },
    { name: 'Mars', r: 1.85, speed: 0.8, size: 0.065, color: '#f87171' },
    { name: 'Jupiter', r: 2.35, speed: 0.45, size: 0.16, color: '#fb923c' },
    { name: 'Saturn', r: 2.85, speed: 0.35, size: 0.13, color: '#fef08a', hasRing: true },
    { name: 'Uranus', r: 3.3, speed: 0.25, size: 0.09, color: '#67e8f9' },
    { name: 'Neptune', r: 3.75, speed: 0.18, size: 0.085, color: '#60a5fa' }
  ], []);

  // Pre-generate orbital line geometries
  const orbitGeometries = useMemo(() => {
    return planets.map(p => {
      const pts = [];
      const segs = 96;
      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * p.r, Math.sin(theta) * p.r * 0.45, 0));
      }
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, [planets]);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime() * 0.8;

    planets.forEach((p, idx) => {
      const mesh = planetsRef.current[idx];
      if (mesh) {
        const angle = t * p.speed + idx * 0.9;
        mesh.position.set(
          Math.cos(angle) * p.r,
          Math.sin(angle) * p.r * 0.45,
          Math.sin(angle) * 0.2
        );
      }
    });
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, -0.1, 0]} rotation={[0.4, 0, 0]} visible={opacity > 0.01}>
      {/* Central Sun */}
      <mesh>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* Sun Corona Glow */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.35 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color="#fde047" intensity={3.5 * opacity} distance={10} />

      {/* Orbit Ellipses */}
      {orbitGeometries.map((geom, idx) => (
        <line key={idx} geometry={geom}>
          <lineBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.22 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}

      {/* Orbiting Planets */}
      {planets.map((p, idx) => (
        <group
          key={p.name}
          ref={el => (planetsRef.current[idx] = el)}
        >
          <mesh>
            <sphereGeometry args={[p.size, 16, 16]} />
            <meshStandardMaterial
              color={p.color}
              roughness={0.6}
              emissive={p.color}
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Saturn's Rings */}
          {p.hasRing && (
            <mesh rotation={[0.6, 0.2, 0]}>
              <ringGeometry args={[p.size * 1.4, p.size * 2.2, 32]} />
              <meshBasicMaterial
                color="#fef08a"
                transparent
                opacity={0.6 * opacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Planet Orbit Node Glow */}
          <pointLight color={p.color} intensity={0.4 * opacity} distance={0.8} />
        </group>
      ))}
    </group>
  );
}
