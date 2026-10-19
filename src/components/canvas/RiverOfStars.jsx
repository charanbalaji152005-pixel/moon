import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RiverOfStars({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const beam1Ref = useRef();
  const beam2Ref = useRef();
  const particlesRef = useRef();

  // Create flowing stream particles
  const particleCount = 1200;
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Scatter in a wide diagonal band
      const u = (Math.random() - 0.5) * 16;
      const v = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 6;

      // Rotate by ~32 degrees diagonal
      const angle = 0.55;
      pos[i * 3] = u * Math.cos(angle) - v * Math.sin(angle);
      pos[i * 3 + 1] = u * Math.sin(angle) + v * Math.cos(angle);
      pos[i * 3 + 2] = z;

      spd[i] = 0.04 + Math.random() * 0.08;
    }
    return [pos, spd];
  }, [particleCount]);

  // Custom diagonal volumetric beam shader
  const beamMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#38bdf8') },
        uOpacity: { value: 0.35 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          // Smooth gaussian-like gradient across width
          float beam = sin(vUv.y * 3.14159);
          beam = pow(beam, 2.5);

          // Subtle moving shimmer
          float shimmer = sin(vUv.x * 12.0 - uTime * 2.0) * 0.15 + 0.85;

          gl_FragColor = vec4(uColor, beam * shimmer * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, []);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();

    beamMaterial.uniforms.uTime.value = t;
    beamMaterial.uniforms.uOpacity.value = 0.4 * opacity;

    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const arr = posAttr.array;
      const cosA = Math.cos(0.55);
      const sinA = Math.sin(0.55);

      for (let i = 0; i < particleCount; i++) {
        // Move along diagonal
        arr[i * 3] += speeds[i] * cosA;
        arr[i * 3 + 1] += speeds[i] * sinA;

        // Wrap around boundary
        if (arr[i * 3] > 10 || arr[i * 3 + 1] > 6) {
          arr[i * 3] -= 20 * cosA;
          arr[i * 3 + 1] -= 20 * sinA;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {/* Primary diagonal volumetric light beam */}
      <mesh
        ref={beam1Ref}
        rotation={[0, 0, 0.55]}
        position={[-1, 0, -1]}
      >
        <planeGeometry args={[18, 3.8]} />
        <primitive object={beamMaterial} attach="material" />
      </mesh>

      {/* Secondary softer diagonal beam */}
      <mesh
        ref={beam2Ref}
        rotation={[0, 0, 0.52]}
        position={[1.5, 0.8, -1.8]}
      >
        <planeGeometry args={[20, 2.4]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.18 * opacity}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Flowing star stream particles */}
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
          color="#e0f2fe"
          transparent
          opacity={0.75 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
