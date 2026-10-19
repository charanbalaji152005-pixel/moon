import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Comet({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const cometHeadRef = useRef();
  const tailRef = useRef();
  const trailParticlesRef = useRef();

  // Comet tail shader (tapered glowing ion & dust tail)
  const tailMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.85 }
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
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          // X = 0 is head (bright), X = 1 is fading tail end
          float xDist = vUv.x;
          float yDist = abs(vUv.y - 0.5) * 2.0;

          // Tail expands slightly along width as it moves away from head
          float maxSpread = mix(0.12, 0.95, xDist);
          if (yDist > maxSpread) discard;

          // Longitudinal fade: very bright at head (x=0), fades smoothly to x=1
          float falloff = pow(1.0 - xDist, 1.8);

          // Transverse fade: gaussian-like across tail width
          float crossFade = cos((yDist / maxSpread) * 1.5707);
          crossFade = pow(crossFade, 2.0);

          // Subtle wavy ion flow
          float shimmer = sin(xDist * 20.0 - uTime * 6.0) * 0.15 + 0.85;

          vec3 cyanHead = vec3(0.85, 0.98, 1.0);
          vec3 blueTail = vec3(0.2, 0.6, 0.95);
          vec3 finalColor = mix(cyanHead, blueTail, xDist * 0.8);

          float alpha = falloff * crossFade * shimmer * uOpacity;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, []);

  // Sparkling debris particles shed by comet
  const particleCount = 180;
  const [positions, offsets] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const off = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      off[i] = Math.random();
      pos[i * 3] = off[i] * 6.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4 * (1.0 + off[i] * 2.0);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return [pos, off];
  }, [particleCount]);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();

    tailMaterial.uniforms.uTime.value = t;
    tailMaterial.uniforms.uOpacity.value = 0.85 * opacity;

    // Move comet diagonally across screen
    if (groupRef.current) {
      // Periodic flight across the sky (every 4 seconds)
      const cycle = (t * 0.35) % 1.0;
      // Start at [-6, 3], fly down to [6, -3]
      const startX = -5.5;
      const endX = 5.5;
      const startY = 2.8;
      const endY = -2.8;

      groupRef.current.position.x = THREE.MathUtils.lerp(startX, endX, cycle);
      groupRef.current.position.y = THREE.MathUtils.lerp(startY, endY, cycle);
      // Angle diagonally
      groupRef.current.rotation.z = -0.55;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {/* Comet Nucleus (Icy core) */}
      <mesh ref={cometHeadRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Coma (Glowing gaseous envelope around head) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.7 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Comet Tail (Streaming backwards from head at x=0 towards -x) */}
      <mesh
        ref={tailRef}
        position={[-3.2, 0, 0]}
        rotation={[0, 0, Math.PI]}
      >
        <planeGeometry args={[6.4, 1.2]} />
        <primitive object={tailMaterial} attach="material" />
      </mesh>

      {/* Shed Star Dust Particles */}
      <points ref={trailParticlesRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#e0f2fe"
          transparent
          opacity={0.7 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <pointLight color="#67e8f9" intensity={3.5 * opacity} distance={6} />
    </group>
  );
}
