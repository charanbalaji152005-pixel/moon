import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Nebula({ active = false, opacity = 1.0 }) {
  const meshRef = useRef();
  const protostarsRef = useRef();

  // Custom GLSL Volumetric Nebula Cloud Shader
  const nebulaMaterial = useMemo(() => {
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

        // Simplex / Perlin-like 2D noise functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Fractal Brownian Motion
        float fbm(vec2 p) {
          float value = 0.0;
          float amp = 0.5;
          float freq = 1.0;
          for (int i = 0; i < 5; i++) {
            value += amp * snoise(p * freq);
            freq *= 2.0;
            amp *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          float t = uTime * 0.08;

          // Multi-layer distorted fluid noise
          float n1 = fbm(uv * 1.5 + vec2(t * 0.4, -t * 0.3));
          float n2 = fbm(uv * 2.2 + vec2(-t * 0.3, t * 0.5) + vec2(n1 * 0.8));

          // Color palette: deep navy, cyan, magenta, violet
          vec3 colorNavy = vec3(0.02, 0.05, 0.15);
          vec3 colorCyan = vec3(0.12, 0.65, 0.95);
          vec3 colorMagenta = vec3(0.85, 0.18, 0.65);
          vec3 colorViolet = vec3(0.45, 0.15, 0.78);
          vec3 colorGold = vec3(0.98, 0.85, 0.45);

          vec3 finalColor = mix(colorNavy, colorViolet, smoothstep(-0.3, 0.4, n1));
          finalColor = mix(finalColor, colorMagenta, smoothstep(0.1, 0.7, n2));
          finalColor = mix(finalColor, colorCyan, smoothstep(0.3, 0.9, n1 * n2));

          // Radial falloff so edges dissolve softly into dark space
          float dist = length(uv);
          float alpha = smoothstep(1.3, 0.2, dist) * smoothstep(-0.4, 0.6, n1 + n2 * 0.5);

          gl_FragColor = vec4(finalColor, alpha * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, []);

  // Protostars (sparkling infant stars embedded in the nursery)
  const starCount = 60;
  const starPositions = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    return pos;
  }, [starCount]);

  useFrame(({ clock }) => {
    if (!active && opacity <= 0.01) return;
    const t = clock.getElapsedTime();
    nebulaMaterial.uniforms.uTime.value = t;
    nebulaMaterial.uniforms.uOpacity.value = 0.85 * opacity;

    if (protostarsRef.current) {
      protostarsRef.current.rotation.z = t * 0.02;
    }
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group visible={opacity > 0.01} position={[0, 0, -0.5]}>
      {/* Volumetric Nebula Plane with Custom Shader */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[14, 9, 32, 32]} />
        <primitive object={nebulaMaterial} attach="material" />
      </mesh>

      {/* Twinkling Infant Protostars */}
      <points ref={protostarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#fef08a"
          transparent
          opacity={0.8 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Internal warm stellar nurseries */}
      <pointLight position={[-1.2, 0.5, 0]} color="#ec4899" intensity={2.2 * opacity} distance={6} />
      <pointLight position={[1.5, -0.4, 0]} color="#38bdf8" intensity={2.0 * opacity} distance={6} />
    </group>
  );
}
