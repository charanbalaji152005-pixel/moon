import React from 'react';
import { AudioPlayer } from './AudioPlayer';

export function Navigation() {
  return (
    <header className="cosmic-header" id="main-navigation">
      {/* Top right: ONLY the Sound Button */}
      <div className="header-right-only">
        <AudioPlayer />
      </div>
    </header>
  );
}
