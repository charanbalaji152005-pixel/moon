import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function EarthAndAstronaut({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const earthRef = useRef();
  const moonRef = useRef();
  const astroRef = useRef();

  // Load textures
  const [earthMap, moonMap, astroMap] = useTexture([
    '/earth.jpg',
    '/moon.jpg',
    '/astronaut.png'
  ]);

  // Atmospheric Fresnel Glow for Earth
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#38bdf8') }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(glowColor, intensity * 0.7);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  }, []);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();

    // Earth slow rotation
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.08;
    }

    // Orbiting mini-moon
    if (moonRef.current) {
      const moonAngle = t * 0.4;
      moonRef.current.position.set(
        Math.cos(moonAngle) * 1.8 - 1.8,
        Math.sin(moonAngle) * 0.4,
        Math.sin(moonAngle) * 0.8
      );
      moonRef.current.rotation.y = t * 0.1;
    }

    // Astronaut zero-g drift
    if (astroRef.current) {
      // Gentle floating bob and slight tilt
      astroRef.current.position.y = 0.15 + Math.sin(t * 1.2) * 0.12;
      astroRef.current.position.x = 2.1 + Math.cos(t * 0.8) * 0.08;
      astroRef.current.rotation.z = Math.sin(t * 0.9) * 0.08 - 0.05;
      astroRef.current.rotation.y = Math.cos(t * 0.7) * 0.1;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {/* Sunlight on Earth and Astronaut */}
      <directionalLight position={[4, 2, 4]} intensity={2.5} color="#ffffff" />
      <ambientLight intensity={0.15} color="#0f172a" />

      {/* Earth on the Left (positioned around x = -2.0) */}
      <group position={[-2.1, 0, 0]}>
        {/* Orbital frame ring as seen in reference */}
        <mesh>
          <ringGeometry args={[1.25, 1.28, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.3 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={earthRef}>
          <sphereGeometry args={[1.1, 64, 64]} />
          <meshStandardMaterial
            map={earthMap}
            roughness={0.65}
            metalness={0.1}
          />
        </mesh>

        {/* Atmosphere layer */}
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[1.18, 48, 48]} />
        </mesh>

        {/* Orbiting Moon */}
        <mesh ref={moonRef} position={[0.2, 0, 0.4]}>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial map={moonMap} roughness={0.9} />
        </mesh>
      </group>

      {/* Floating Astronaut on the Right (around x = 2.0) */}
      <group ref={astroRef} position={[2.1, 0.15, 0.8]}>
        <mesh scale={[1.8, 1.8, 1.8]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={astroMap}
            transparent
            opacity={0.96 * opacity}
            side={THREE.DoubleSide}
            alphaTest={0.01}
          />
        </mesh>

        {/* Subtle breathing light on astronaut's helmet */}
        <pointLight
          position={[0, 0.2, 0.5]}
          intensity={0.6 * opacity}
          color="#38bdf8"
          distance={1.5}
        />
      </group>
    </group>
  );
}
