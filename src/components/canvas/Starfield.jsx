import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Starfield({ count = 3500 }) {
  const pointsRef = useRef();
  const shootingStarsRef = useRef();

  // Generate star positions, colors, and random twinkle phases
  const [positions, colors, sizes, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);

    // Realistic stellar color palette (deep sky blue, cyan, brilliant white, warm yellow, gold)
    const starPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#e0f2fe'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#bfdbfe'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#fed7aa'),
      new THREE.Color('#67e8f9')
    ];

    for (let i = 0; i < count; i++) {
      // Distribute stars in spherical shell around camera
      const r = 25 + Math.random() * 75;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = starPalette[Math.floor(Math.random() * starPalette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 1.0 + Math.random() * 2.5;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return [pos, col, sz, ph];
  }, [count]);

  // Shooting stars system
  const shootingStars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 4; i++) {
      list.push({
        active: false,
        pos: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 60,
        length: 2 + Math.random() * 3
      });
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      // Gentle overall cosmos drift
      pointsRef.current.rotation.y = t * 0.008;
      pointsRef.current.rotation.x = Math.sin(t * 0.005) * 0.02;
    }
  });

  // Custom circular star shader with twinkle
  const starShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute float aPhase;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          // Twinkle calculation
          float twinkle = sin(uTime * 3.0 + aPhase) * 0.35 + 0.65;
          vAlpha = twinkle;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (28.0 / -mvPosition.z) * twinkle;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Circular particle with soft radiant falloff
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          float intensity = pow(1.0 - (dist * 2.0), 2.0);
          gl_FragColor = vec4(vColor, vAlpha * intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
  }, []);

  useFrame(({ clock }) => {
    starShader.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group>
      <points ref={pointsRef} material={starShader}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={count}
            array={sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            count={count}
            array={phases}
            itemSize={1}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}
