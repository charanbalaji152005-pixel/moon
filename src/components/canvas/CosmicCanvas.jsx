import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Starfield } from './Starfield';
import { Moon } from './Moon';
import { RiverOfStars } from './RiverOfStars';
import { EarthAndAstronaut } from './EarthAndAstronaut';
import { UniverseGalaxy } from './UniverseGalaxy';
import { SolarSystem } from './SolarSystem';
import { AsteroidBelt } from './AsteroidBelt';
import { Nebula } from './Nebula';
import { BinaryStars } from './BinaryStars';
import { Supernova } from './Supernova';
import { BlackHole } from './BlackHole';
import { Quasar } from './Quasar';
import { Comet } from './Comet';
import { Exoplanet } from './Exoplanet';
import { Aurora } from './Aurora';
import { Constellations } from './Constellations';

// Helper to compute smooth opacity bell curve over a range
function computeOpacity(progress, start, peakStart, peakEnd, end) {
  if (progress < start || progress > end) return 0;
  if (progress >= peakStart && progress <= peakEnd) return 1;
  if (progress < peakStart) {
    return Math.sin(((progress - start) / (peakStart - start)) * Math.PI * 0.5);
  }
  return Math.cos(((progress - peakEnd) / (end - peakEnd)) * Math.PI * 0.5);
}

// Cinematic Camera Controller with smooth lerp and subtle mouse parallax
function CameraController({ scrollProgress }) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Determine base camera position based on scrollProgress
    let px = 0;
    let py = 0;
    let pz = 4.5;
    let lx = 0;
    let ly = 0;
    let lz = 0;

    if (scrollProgress <= 0.08) {
      // Hero Moon - zoom in
      const t = scrollProgress / 0.08;
      pz = 4.5 - t * 1.5;
      py = 0.2;
    } else if (scrollProgress <= 0.16) {
      // River of Stars
      px = 0.2;
      py = 0.4;
      pz = 3.9;
      lx = 0.1;
    } else if (scrollProgress <= 0.23) {
      // Earth & Astronaut
      px = 0;
      py = 0;
      pz = 4.2;
    } else if (scrollProgress <= 0.30) {
      // Universe
      px = -0.3;
      py = 0.2;
      pz = 4.8;
    } else if (scrollProgress <= 0.36) {
      // Solar System
      px = 0;
      py = 1.2;
      pz = 4.6;
      ly = 0.1;
    } else if (scrollProgress <= 0.43) {
      // Asteroids
      px = 0;
      py = 0;
      pz = 3.6;
    } else if (scrollProgress <= 0.49) {
      // Nebula
      px = 0;
      py = 0.1;
      pz = 4.3;
    } else if (scrollProgress <= 0.55) {
      // Binary Stars
      px = 0;
      py = 0.3;
      pz = 4.0;
    } else if (scrollProgress <= 0.61) {
      // Supernova
      px = 0;
      py = 0;
      pz = 4.1;
    } else if (scrollProgress <= 0.67) {
      // Black hole
      px = 0;
      py = 0;
      pz = 3.9;
    } else if (scrollProgress <= 0.73) {
      // Quasar
      px = 0;
      py = 0;
      pz = 4.2;
    } else if (scrollProgress <= 0.79) {
      // Comet
      px = 0;
      py = 0;
      pz = 4.5;
    } else if (scrollProgress <= 0.85) {
      // Exoplanet
      px = 0;
      py = 0;
      pz = 4.4;
    } else if (scrollProgress <= 0.90) {
      // Aurora
      px = 0;
      py = 0.3;
      pz = 4.0;
    } else if (scrollProgress <= 0.94) {
      // Skies without borders / Constellations
      px = 0;
      py = 0;
      pz = 4.6;
    } else {
      // Summary / Return
      px = 0;
      py = 0.3;
      pz = 4.5;
    }

    // Apply mouse parallax
    targetPos.current.set(
      px + mouseRef.current.x,
      py - mouseRef.current.y,
      pz
    );
    targetLook.current.set(lx, ly, lz);

    // Smooth camera damping
    camera.position.lerp(targetPos.current, 0.06);
    camera.lookAt(targetLook.current);
  });

  return null;
}

// Scene Orchestrator displaying active elements with cross-fading
function SceneElements({ scrollProgress }) {
  // Compute opacities
  const opMoonHero = scrollProgress <= 0.09 ? Math.max(0, 1.0 - Math.pow(scrollProgress / 0.08, 2)) : 0;
  const opMoonReturn = scrollProgress >= 0.95 ? Math.min(1.0, (scrollProgress - 0.95) / 0.04) : 0;
  const opMoon = Math.max(opMoonHero, opMoonReturn);

  const opRiver = computeOpacity(scrollProgress, 0.06, 0.09, 0.14, 0.17);
  const opEarth = computeOpacity(scrollProgress, 0.14, 0.17, 0.22, 0.25);
  const opUniverse = computeOpacity(scrollProgress, 0.21, 0.24, 0.29, 0.32);
  const opSolar = computeOpacity(scrollProgress, 0.28, 0.31, 0.36, 0.39);
  const opAsteroids = computeOpacity(scrollProgress, 0.34, 0.37, 0.42, 0.45);
  const opNebula = computeOpacity(scrollProgress, 0.41, 0.44, 0.48, 0.51);
  const opBinary = computeOpacity(scrollProgress, 0.47, 0.50, 0.54, 0.57);
  const opSupernova = computeOpacity(scrollProgress, 0.53, 0.56, 0.60, 0.63);
  const opBlackHole = computeOpacity(scrollProgress, 0.59, 0.62, 0.66, 0.69);
  const opQuasar = computeOpacity(scrollProgress, 0.65, 0.68, 0.72, 0.75);
  const opComet = computeOpacity(scrollProgress, 0.71, 0.74, 0.78, 0.81);
  const opExoplanet = computeOpacity(scrollProgress, 0.77, 0.80, 0.84, 0.87);
  const opAurora = computeOpacity(scrollProgress, 0.83, 0.86, 0.89, 0.92);
  const opConstellations = computeOpacity(scrollProgress, 0.89, 0.92, 0.95, 0.98);

  return (
    <>
      <CameraController scrollProgress={scrollProgress} />
      <Starfield count={3600} />

      <Moon scrollProgress={scrollProgress} opacity={opMoon} />
      <RiverOfStars active={opRiver > 0.01} opacity={opRiver} />
      <EarthAndAstronaut active={opEarth > 0.01} opacity={opEarth} />
      <UniverseGalaxy active={opUniverse > 0.01} opacity={opUniverse} />
      <SolarSystem active={opSolar > 0.01} opacity={opSolar} />
      <AsteroidBelt active={opAsteroids > 0.01} opacity={opAsteroids} />
      <Nebula active={opNebula > 0.01} opacity={opNebula} />
      <BinaryStars active={opBinary > 0.01} opacity={opBinary} />
      <Supernova active={opSupernova > 0.01} opacity={opSupernova} />
      <BlackHole active={opBlackHole > 0.01} opacity={opBlackHole} />
      <Quasar active={opQuasar > 0.01} opacity={opQuasar} />
      <Comet active={opComet > 0.01} opacity={opComet} />
      <Exoplanet active={opExoplanet > 0.01} opacity={opExoplanet} />
      <Aurora active={opAurora > 0.01} opacity={opAurora} />
      <Constellations active={opConstellations > 0.01} opacity={opConstellations} />
    </>
  );
}

export function CosmicCanvas({ scrollProgress = 0 }) {
  return (
    <div className="canvas-container" id="cosmic-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 48, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      >
        <Suspense fallback={null}>
          <SceneElements scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
