import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Constellations({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();

  // Define constellations: Ursa Major (left), Orion (center), Cassiopeia (right)
  const constellationsData = useMemo(() => {
    // Ursa Major (Big Dipper)
    const ursaStars = [
      new THREE.Vector3(-3.8, 1.8, 0),    // Dubhe
      new THREE.Vector3(-3.8, 0.9, 0),    // Merak
      new THREE.Vector3(-2.8, 0.7, 0),    // Phecda
      new THREE.Vector3(-2.6, 1.6, 0),    // Megrez
      new THREE.Vector3(-1.8, 1.4, 0),    // Alioth
      new THREE.Vector3(-1.1, 1.7, 0),    // Mizar
      new THREE.Vector3(-0.4, 1.3, 0)     // Alkaid
    ];
    const ursaLines = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Bowl
      [3, 4], [4, 5], [5, 6]          // Handle
    ];

    // Orion (Center)
    const orionStars = [
      new THREE.Vector3(-0.7, 0.8, 0),    // Betelgeuse
      new THREE.Vector3(0.7, 0.9, 0),     // Bellatrix
      new THREE.Vector3(-0.4, 0.05, 0),   // Alnitak (Belt)
      new THREE.Vector3(0.0, 0.0, 0),     // Alnilam (Belt)
      new THREE.Vector3(0.4, -0.05, 0),   // Mintaka (Belt)
      new THREE.Vector3(-0.6, -0.9, 0),   // Saiph
      new THREE.Vector3(0.6, -0.85, 0)    // Rigel
    ];
    const orionLines = [
      [0, 2], [1, 4], [2, 3], [3, 4], // Torso to belt
      [2, 5], [4, 6], [0, 1], [5, 6]  // Limbs
    ];

    // Cassiopeia (Right W-shape)
    const cassStars = [
      new THREE.Vector3(2.2, 1.5, 0),     // Caph
      new THREE.Vector3(2.7, 0.6, 0),     // Schedar
      new THREE.Vector3(3.3, 1.1, 0),     // Gamma Cas
      new THREE.Vector3(3.9, 0.4, 0),     // Ruchbah
      new THREE.Vector3(4.4, 1.2, 0)      // Segin
    ];
    const cassLines = [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ];

    // Helper to build line segments buffer geometry
    const buildLineGeometry = (stars, lines) => {
      const pts = [];
      lines.forEach(([i, j]) => {
        pts.push(stars[i]);
        pts.push(stars[j]);
      });
      return new THREE.BufferGeometry().setFromPoints(pts);
    };

    return {
      allStars: [...ursaStars, ...orionStars, ...cassStars],
      ursaGeom: buildLineGeometry(ursaStars, ursaLines),
      orionGeom: buildLineGeometry(orionStars, orionLines),
      cassGeom: buildLineGeometry(cassStars, cassLines)
    };
  }, []);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} visible={opacity > 0.01}>
      {/* Constellation Lines */}
      <lineSegments geometry={constellationsData.ursaGeom}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.45 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments geometry={constellationsData.orionGeom}>
        <lineBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.55 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments geometry={constellationsData.cassGeom}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.45 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Constellation Star Nodes */}
      {constellationsData.allStars.map((pt, idx) => (
        <group key={idx} position={pt}>
          {/* Core Star Point */}
          <mesh>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Halo Glow */}
          <mesh>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.5 * opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
