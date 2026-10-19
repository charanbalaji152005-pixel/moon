import React from 'react';
import { SECTIONS_DATA } from '../data/sectionsData';

export function SectionOverlay() {
  return (
    <div className="sections-container" id="sections-scroll-track">
      {SECTIONS_DATA.map((section, idx) => {
        const isReturn = section.id === 'return-summary';
        const hasCards = section.cards && section.cards.length > 0;
        const hasConstellations = section.constellations && section.constellations.length > 0;

        return (
          <section
            key={section.id}
            id={section.id}
            className={`section-panel section-panel--${section.id}`}
            data-index={idx}
          >
            <div className="section-content">
              {/* Eyebrow badge */}
              <div className="eyebrow-wrapper">
                <span className="eyebrow-badge">
                  {section.eyebrow}
                </span>
              </div>

              {/* Massive Cinematic Title */}
              <h1 className="section-title">
                {section.title}
              </h1>

              {/* Subtitle Description */}
              <p className="section-subtitle">
                {section.subtitle}
              </p>

              {/* Evocative Italic Quote */}
              {section.quote && (
                <p className="section-quote">
                  {section.quote}
                </p>
              )}

              {/* Special Cards for Skies Without Borders */}
              {hasCards && (
                <div className="special-cards-grid">
                  {section.cards.map((card, cIdx) => (
                    <div key={cIdx} className="special-card">
                      <h4 className="special-card__title">{card.title}</h4>
                      <p className="special-card__text">{card.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Constellation Badges */}
              {hasConstellations && (
                <div className="constellations-badges-row">
                  {section.constellations.map((c, cIdx) => (
                    <div key={cIdx} className="constellation-pill">
                      <span className="constellation-pill__name">{c.name}</span>
                      <span className="constellation-pill__stars">{c.stars} Stars</span>
                      <span className="constellation-pill__myth">{c.myth}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Return Log Bullet Points */}
              {isReturn && section.bulletPoints && (
                <ul className="return-bullet-list">
                  {section.bulletPoints.map((point, bIdx) => (
                    <li key={bIdx} className="return-bullet-item">
                      <span className="bullet-dot" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Micro Telemetry Badges */}
              {section.telemetry && (
                <div className="telemetry-badges-row">
                  {section.telemetry.map((item, tIdx) => (
                    <div key={tIdx} className="telemetry-pill">
                      <span className="telemetry-pill__label">{item.label}:</span>
                      <span className="telemetry-pill__val">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
