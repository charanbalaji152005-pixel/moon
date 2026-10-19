import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BlackHole({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const accretion1Ref = useRef();
  const accretion2Ref = useRef();
  const lensingRef = useRef();

  // Custom Einstein Lensing Ring Shader
  const lensingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.8 }
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
          vec2 p = (vUv - 0.5) * 2.0;
          float r = length(p);

          // Thin intense photon ring at r = 0.55
          float photonRing = 0.015 / abs(r - 0.55);
          photonRing = clamp(photonRing, 0.0, 2.5);

          // Doppler beamed asymmetric accretion glow
          float angle = atan(p.y, p.x);
          float doppler = 1.0 + 0.65 * cos(angle + uTime * 1.5);

          vec3 ringColor = vec3(0.25, 0.65, 1.0);
          vec3 innerGlow = vec3(0.55, 0.85, 1.0);
          vec3 finalColor = mix(ringColor, innerGlow, photonRing * 0.3) * doppler;

          // Pure black shadow inside event horizon
          if (r < 0.48) {
            discard;
          }

          float alpha = smoothstep(1.3, 0.55, r) * photonRing * uOpacity;
          gl_FragColor = vec4(finalColor, alpha);
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

    lensingMaterial.uniforms.uTime.value = t;
    lensingMaterial.uniforms.uOpacity.value = 0.9 * opacity;

    if (accretion1Ref.current) {
      accretion1Ref.current.rotation.z = t * 0.45;
    }
    if (accretion2Ref.current) {
      accretion2Ref.current.rotation.z = -t * 0.3;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, 0, 0]} visible={opacity > 0.01}>
      {/* Relativistic Accretion Ring Plane */}
      <mesh ref={lensingRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[4.5, 4.5]} />
        <primitive object={lensingMaterial} attach="material" />
      </mesh>

      {/* Tilted Accretion Disk (asymmetric 3D rings) */}
      <mesh ref={accretion1Ref} rotation={[1.1, 0.3, 0]}>
        <ringGeometry args={[0.95, 1.6, 96]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.45 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={accretion2Ref} rotation={[1.2, -0.2, 0]}>
        <ringGeometry args={[1.65, 2.1, 96]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.3 * opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Pure Black Event Horizon Sphere (Absorbs all light) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Eerie Blue Photon Ring light */}
      <pointLight color="#38bdf8" intensity={2.5 * opacity} distance={6} />
    </group>
  );
}
