import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Exoplanet({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const planetRef = useRef();
  const starRef = useRef();

  // Load exoplanet texture
  const exoplanetMap = useTexture(`${import.meta.env.BASE_URL}exoplanet.jpg`);

  // Atmospheric limb glow shader for exoplanet
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#22d3ee') }
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
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor, intensity * 0.85);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  }, []);

  // Orbital Ellipse
  const orbitGeometry = useMemo(() => {
    const pts = [];
    const segs = 100;
    for (let i = 0; i <= segs; i++) {
      const theta = (i / segs) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * 3.4 - 0.2, Math.sin(theta) * 1.2, -0.4));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();

    if (planetRef.current) {
      planetRef.current.rotation.y = t * 0.05;
    }

    if (starRef.current) {
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.06;
      starRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} visible={opacity > 0.01}>
      {/* Light from golden star illuminating exoplanet */}
      <directionalLight position={[4, 1, 2]} intensity={2.8} color="#fef08a" />
      <ambientLight intensity={0.12} color="#042f2e" />

      {/* Orbital Path */}
      <line geometry={orbitGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.22 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Large Turquoise Exoplanet on the Left (x = -2.1) */}
      <group position={[-2.1, 0, 0]}>
        {/* Subtle orbit ring around planet */}
        <mesh>
          <ringGeometry args={[1.38, 1.41, 64]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.32 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={planetRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial
            map={exoplanetMap}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Luminous cyan atmosphere glow */}
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[1.28, 48, 48]} />
        </mesh>
      </group>

      {/* Radiant Golden Host Star on the Right (x = 2.4) */}
      <group position={[2.4, 0.4, -0.5]}>
        <mesh ref={starRef}>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Star Corona */}
        <mesh>
          <sphereGeometry args={[0.82, 32, 32]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={0.5 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <pointLight color="#fde047" intensity={5.0 * opacity} distance={10} />
      </group>
    </group>
  );
}
