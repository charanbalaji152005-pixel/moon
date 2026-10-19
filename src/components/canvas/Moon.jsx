import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Moon({ scrollProgress = 0, opacity = 1.0 }) {
  const groupRef = useRef();
  const moonRef = useRef();
  const ringsRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const satelliteRef = useRef();

  // Load Moon textures with fallback
  const [moonMap, bumpMap] = useTexture(['/moon.jpg', '/moon_bump.jpg']);

  // Custom Moon atmosphere/fresnel glow shader
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color('#38bdf8') },
        viewVector: { value: new THREE.Vector3(0, 0, 5) }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.8);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor, intensity * 0.45);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  }, []);

  // Concentric dashed ring geometry
  const dashedRing = useMemo(() => {
    const pts = [];
    const segments = 120;
    const r = 2.0;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    return geom;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (moonRef.current) {
      // Slow realistic lunar rotation
      moonRef.current.rotation.y = t * 0.04;
      moonRef.current.rotation.x = Math.sin(t * 0.02) * 0.02;
    }

    if (ringsRef.current) {
      if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.06;
      if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.04;
      if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.02;

      if (satelliteRef.current) {
        const satAngle = t * 0.8;
        const satR = 1.85;
        satelliteRef.current.position.set(
          Math.cos(satAngle) * satR,
          Math.sin(satAngle) * satR,
          0.05
        );
      }
    }

    // Scroll zoom / portal entrance behavior
    if (groupRef.current) {
      // In Section 1 (0 to 0.08), camera zooms in or moon zooms past
      if (scrollProgress <= 0.1) {
        const zoom = scrollProgress / 0.08;
        // Moon scales up and moves toward camera as user scrolls
        const currentScale = 1.0 + zoom * 2.5;
        groupRef.current.scale.set(currentScale, currentScale, currentScale);
        groupRef.current.position.z = zoom * 2.8;
        // Fade out as portal enters
        const alpha = Math.max(0, 1.0 - Math.pow(Math.max(0, (scrollProgress - 0.04) / 0.04), 2));
        groupRef.current.visible = alpha > 0.01;
      } else if (scrollProgress >= 0.94) {
        // Return summary (Section 17-18)
        const returnProgress = (scrollProgress - 0.94) / 0.06;
        const clamped = Math.min(1.0, Math.max(0, returnProgress));
        groupRef.current.visible = true;
        groupRef.current.scale.set(clamped * 1.0, clamped * 1.0, clamped * 1.0);
        groupRef.current.position.z = (1.0 - clamped) * -3.0;
      } else {
        groupRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* Sun directional light highlighting moon's craters */}
      <directionalLight
        position={[5, 3, 4]}
        intensity={2.8}
        color="#ffffff"
      />
      <ambientLight intensity={0.12} color="#1e293b" />

      {/* Moon 3D Sphere */}
      <mesh ref={moonRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshStandardMaterial
          map={moonMap}
          bumpMap={bumpMap}
          bumpScale={0.06}
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh position={[0, 0, 0]} material={atmosphereMaterial}>
        <sphereGeometry args={[1.15, 48, 48]} />
      </mesh>

      {/* Glowing Concentric Orbital Rings */}
      <group ref={ringsRef} position={[0, 0, 0]}>
        {/* Ring 1 - Inner vibrant blue glow ring */}
        <mesh ref={ring1Ref}>
          <ringGeometry args={[1.35, 1.39, 96]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.65 * opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Ring 2 - Middle soft cyan ring */}
        <mesh ref={ring2Ref}>
          <ringGeometry args={[1.65, 1.68, 96]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.45 * opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Ring 3 - Outer wide orbit ring */}
        <mesh ref={ring3Ref}>
          <ringGeometry args={[2.02, 2.05, 96]} />
          <meshBasicMaterial
            color="#1d4ed8"
            transparent
            opacity={0.35 * opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbiting Satellite Indicator */}
        <mesh ref={satelliteRef}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}
