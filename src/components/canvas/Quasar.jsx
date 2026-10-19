import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Quasar({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const jetRef = useRef();
  const diskRef = useRef();
  const coreRef = useRef();

  // Custom vertical relativistic particle jet shader
  const jetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.95 }
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
          // Centered along X (vertical column)
          float xDist = abs(vUv.x - 0.5) * 2.0;

          // Extremely sharp intense core beam
          float beamCore = 0.04 / max(xDist, 0.005);
          beamCore = clamp(beamCore, 0.0, 3.5);

          // Energy pulses shooting outward from center (y = 0.5)
          float yDist = abs(vUv.y - 0.5) * 2.0;
          float pulse = sin(yDist * 18.0 - uTime * 14.0) * 0.2 + 0.8;

          // Fade toward extreme top and bottom ends
          float fade = 1.0 - smoothstep(0.7, 1.0, yDist);

          vec3 cyanGlow = vec3(0.2, 0.75, 1.0);
          vec3 whiteCore = vec3(1.0, 1.0, 1.0);
          vec3 color = mix(cyanGlow, whiteCore, smoothstep(0.3, 0.02, xDist));

          float alpha = beamCore * pulse * fade * uOpacity;
          gl_FragColor = vec4(color, alpha);
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

    jetMaterial.uniforms.uTime.value = t;
    jetMaterial.uniforms.uOpacity.value = 0.95 * opacity;

    if (diskRef.current) {
      diskRef.current.rotation.z = t * 1.8; // High-speed relativistic spin
    }

    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(t * 12.0) * 0.12;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} visible={opacity > 0.01}>
      {/* Relativistic Vertical Laser Jets (Spanning screen top to bottom) */}
      <mesh ref={jetRef} position={[0, 0, 0]}>
        <planeGeometry args={[1.8, 14]} />
        <primitive object={jetMaterial} attach="material" />
      </mesh>

      {/* Relativistic Accretion Disk (horizontal perpendicular plane) */}
      <mesh ref={diskRef} rotation={[1.4, 0, 0]}>
        <ringGeometry args={[0.35, 1.6, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.7 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Blinding Central Nucleus */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <pointLight color="#38bdf8" intensity={6.0 * opacity} distance={10} />
      <pointLight color="#ffffff" intensity={4.0 * opacity} distance={6} />
    </group>
  );
}
