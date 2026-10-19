import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { CosmicCanvas } from './components/canvas/CosmicCanvas';
import { Navigation } from './components/Navigation';
import { SectionOverlay } from './components/SectionOverlay';
import { ScrollPrompt } from './components/ScrollPrompt';
import { CustomCursor } from './components/CustomCursor';
import { SECTIONS_DATA } from './data/sectionsData';

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5
    });

    lenisRef.current = lenis;

    // Scroll listener to update progress and active chapter
    lenis.on('scroll', (e) => {
      const scrollY = e.scroll;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      setScrollProgress(progress);

      // Determine active section index
      const sectionCount = SECTIONS_DATA.length;
      const calculatedIndex = Math.min(
        sectionCount - 1,
        Math.floor(progress * sectionCount + 0.15)
      );
      setActiveIndex(calculatedIndex);
    });

    // Animation frame pump for Lenis
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Jump to specific chapter via keyboard navigation (V key)
  const handleNavigate = useCallback((index) => {
    const targetSection = SECTIONS_DATA[index];
    if (!targetSection) return;

    const el = document.getElementById(targetSection.id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        duration: 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  }, []);

  // Keyboard shortcut listener for V key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v' || e.key === 'V') {
        const nextIdx = (activeIndex + 1) % SECTIONS_DATA.length;
        handleNavigate(nextIdx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNavigate]);

  return (
    <div className="cosmic-experience" id="beyond-the-moon-app">
      {/* Interactive Cursor */}
      <CustomCursor />

      {/* Top Cosmic Navigation & Telemetry with Sound Button */}
      <Navigation
        activeIndex={activeIndex}
        scrollProgress={scrollProgress}
      />

      {/* 3D WebGL Canvas Layer (Fixed full-screen) */}
      <CosmicCanvas scrollProgress={scrollProgress} />

      {/* Scrollable Cinematic HTML Content Overlay */}
      <main className="content-scroll-layer">
        <SectionOverlay />
      </main>

      {/* Non-clickable Bottom Scroll Indicator on Hero */}
      <ScrollPrompt activeIndex={activeIndex} />
    </div>
  );
}

export default App;
