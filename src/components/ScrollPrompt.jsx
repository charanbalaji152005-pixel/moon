import React from 'react';

export function ScrollPrompt({ activeIndex }) {
  // Only display subtle scroll indicator on hero section
  if (activeIndex !== 0) return null;

  return (
    <div className="scroll-indicator-minimal" id="scroll-prompt-indicator">
      <div className="scroll-mouse-icon">
        <span className="scroll-mouse-wheel" />
      </div>
    </div>
  );
}
