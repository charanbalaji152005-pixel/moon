import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);
  const synthCtxRef = useRef(null);

  // Initialize or toggle audio
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((err) => {
          console.warn('Audio autoplay prevented, starting Web Audio ambient drone:', err);
          startAmbientSynth();
          setIsPlaying(true);
          setHasInteracted(true);
        });
    }
  };

  // Fallback procedural ambient space drone using Web Audio API
  const startAmbientSynth = () => {
    if (synthCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      synthCtxRef.current = ctx;

      // Deep root drone (55 Hz - A1)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
    } catch (e) {
      console.warn('Web Audio synth failed:', e);
    }
  };

  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}cornfield_chase.mp3`);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      if (synthCtxRef.current) {
        synthCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="audio-control-wrapper">
      <button
        id="audio-toggle-btn"
        className={`audio-btn interactive ${isPlaying ? 'audio-btn--playing' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? 'Mute Interstellar Audio' : 'Play Interstellar Soundtrack'}
        aria-label="Toggle Cosmic Audio"
      >
        <span className="audio-btn__radar">
          <span className="audio-btn__wave" />
          <span className="audio-btn__wave" />
        </span>

        {isPlaying ? (
          <Volume2 size={15} className="audio-btn__icon" />
        ) : (
          <VolumeX size={15} className="audio-btn__icon" />
        )}

        <span className="audio-btn__label">
          {isPlaying ? 'SOUND ON' : 'PLAY SOUND'}
        </span>

        {/* Animated Sound Equalizer Bars */}
        {isPlaying && (
          <div className="audio-bars">
            <span className="audio-bar audio-bar--1" />
            <span className="audio-bar audio-bar--2" />
            <span className="audio-bar audio-bar--3" />
          </div>
        )}
      </button>
    </div>
  );
}
