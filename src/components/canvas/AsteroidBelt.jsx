import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AsteroidBelt({ active = false, opacity = 1.0 }) {
  const groupRef = useRef();
  const instancedRef = useRef();
  const count = 55;

  // Generate asteroid properties: position, rotation, scale, rotation speeds
  const asteroids = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      // Distribute in a volumetric band across the screen
      const x = (Math.random() - 0.5) * 11;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 5;

      const scale = 0.08 + Math.random() * 0.22;
      const rotSpeedX = (Math.random() - 0.5) * 0.8;
      const rotSpeedY = (Math.random() - 0.5) * 0.8;
      const rotSpeedZ = (Math.random() - 0.5) * 0.8;

      list.push({
        pos: new THREE.Vector3(x, y, z),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        scale: new THREE.Vector3(
          scale * (0.8 + Math.random() * 0.4),
          scale * (0.8 + Math.random() * 0.4),
          scale * (0.8 + Math.random() * 0.4)
        ),
        rotSpeed: new THREE.Vector3(rotSpeedX, rotSpeedY, rotSpeedZ),
        driftSpeed: 0.005 + Math.random() * 0.015
      });
    }
    return list;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Procedural rock geometry with deformed vertices for craters/facets
  const rockGeometry = useMemo(() => {
    const geom = new THREE.DodecahedronGeometry(1.0, 1);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      // Displace vertices with pseudo-noise
      const noise = Math.sin(v.x * 4.0) * Math.cos(v.y * 4.0) * Math.sin(v.z * 4.0) * 0.22;
      v.addScaledVector(v.clone().normalize(), noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!active && opacity <= 0.01) return;
    if (!instancedRef.current) return;

    asteroids.forEach((ast, i) => {
      // Rotate asteroid
      ast.rot.x += ast.rotSpeed.x * delta;
      ast.rot.y += ast.rotSpeed.y * delta;
      ast.rot.z += ast.rotSpeed.z * delta;

      // Gentle drift along X
      ast.pos.x += ast.driftSpeed * delta * 4;
      if (ast.pos.x > 6) ast.pos.x = -6;

      dummy.position.copy(ast.pos);
      dummy.rotation.copy(ast.rot);
      dummy.scale.copy(ast.scale);
      dummy.updateMatrix();

      instancedRef.current.setMatrixAt(i, dummy.matrix);
    });

    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active && opacity <= 0.01) return null;

  return (
    <group ref={groupRef} visible={opacity > 0.01}>
      {/* Harsh directional sun light casting dark shadows on asteroids */}
      <directionalLight position={[5, 4, 3]} intensity={2.6} color="#ffffff" />
      <ambientLight intensity={0.1} color="#1e293b" />

      <instancedMesh
        ref={instancedRef}
        args={[rockGeometry, null, count]}
      >
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.92}
          metalness={0.08}
          transparent
          opacity={0.95 * opacity}
        />
      </instancedMesh>
    </group>
  );
}
