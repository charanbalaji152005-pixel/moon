import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Aurora({ active = false, opacity = 1.0 }) {
  const meshRef = useRef();

  // Custom undulating Aurora Borealis Ribbon Shader
  const auroraMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.75 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          vUv = uv;

          // Undulate vertices vertically and in depth
          float wave = sin(position.x * 1.5 + uTime * 1.8) * 0.4
                     + sin(position.x * 3.2 - uTime * 2.2) * 0.15;
          vWave = wave;

          vec3 pos = position;
          pos.z += wave;
          pos.y += cos(position.x * 2.0 + uTime * 1.2) * 0.25;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        varying float vWave;

        void main() {
          // Vertical curtain ribbons
          float verticalRibbon = sin(vUv.y * 3.14159);
          verticalRibbon = pow(verticalRibbon, 1.8);

          // Ray streaks along X
          float rays = sin(vUv.x * 32.0 + uTime * 3.0) * 0.25 + 0.75;

          // Colors: emerald green base, cyan mid, violet top
          vec3 green = vec3(0.08, 0.88, 0.55);
          vec3 cyan = vec3(0.15, 0.75, 0.95);
          vec3 violet = vec3(0.65, 0.2, 0.85);

          vec3 color = mix(green, cyan, smoothstep(0.2, 0.6, vUv.y));
          color = mix(color, violet, smoothstep(0.6, 0.95, vUv.y));

          float alpha = verticalRibbon * rays * uOpacity;
          gl_FragColor = vec4(color, alpha * 0.85);
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
    auroraMaterial.uniforms.uTime.value = t;
    auroraMaterial.uniforms.uOpacity.value = 0.75 * opacity;
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group position={[0, 0, -1]} visible={opacity > 0.01}>
      {/* Aurora Curtains */}
      <mesh ref={meshRef} position={[0, 0.4, 0]}>
        <planeGeometry args={[16, 5.5, 64, 32]} />
        <primitive object={auroraMaterial} attach="material" />
      </mesh>

      {/* Secondary softer curtain behind */}
      <mesh position={[0, 0.9, -1.2]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[18, 6.0, 64, 32]} />
        <primitive object={auroraMaterial} attach="material" />
      </mesh>
    </group>
  );
}
