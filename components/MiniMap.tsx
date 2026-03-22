'use client';

import { useEffect, useRef, useState } from 'react';

interface MiniMapProps {
  activeSection: number;
  sections: string[];
}

export default function MiniMap({ activeSection, sections }: MiniMapProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const icons = ['🏔️', '📚', '⚒️', '🌙'];

  return (
    <div className="hidden md:flex" style={{
      position: 'fixed',
      top: '50%',
      right: '20px',
      transform: 'translateY(-50%)',
      zIndex: 100,
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    }}>
      {/* Mini map frame — skeuomorphic brass-framed panel */}
      <div className="rpg-panel" style={{
        padding: '12px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        minWidth: '56px',
      }}>
        <div style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '7px',
          color: 'var(--sunset-gold)',
          letterSpacing: '1px',
          marginBottom: '4px',
          textAlign: 'center',
          textShadow: '0 0 6px rgba(240, 168, 48, 0.4), 0 1px 0 rgba(0,0,0,0.5)',
        }}>
          MAP
        </div>

        {sections.map((section, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            {/* Node — gem-like indicator with inset glow */}
            <div
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                background: i === activeSection
                  ? 'linear-gradient(180deg, rgba(232, 118, 78, 0.35), rgba(232, 118, 78, 0.15))'
                  : i < activeSection
                    ? 'linear-gradient(180deg, rgba(90, 140, 60, 0.25), rgba(90, 140, 60, 0.1))'
                    : 'linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.15))',
                border: i === activeSection
                  ? '3px solid var(--sunset-orange)'
                  : i < activeSection
                    ? '2px solid var(--grass-green)'
                    : '2px solid var(--pixel-border)',
                borderTopColor: i === activeSection
                  ? '#f09070'
                  : i < activeSection
                    ? '#7aac5c'
                    : 'var(--pixel-border-light)',
                borderLeftColor: i === activeSection
                  ? '#f09070'
                  : i < activeSection
                    ? '#7aac5c'
                    : 'var(--pixel-border-light)',
                transition: 'all 0.4s ease',
                filter: i <= activeSection ? 'none' : 'grayscale(0.8) opacity(0.5)',
                boxShadow: i === activeSection
                  ? 'inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.3), 0 0 12px rgba(232,118,78,0.3)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -2px 4px rgba(0,0,0,0.3)',
              }}
              title={section}
            >
              {icons[i]}
            </div>

            {/* Connector line — engraved groove */}
            {i < sections.length - 1 && (
              <div style={{
                width: '3px',
                height: '16px',
                background: i < activeSection
                  ? 'linear-gradient(180deg, var(--grass-green), #3a6a2c)'
                  : 'var(--pixel-border)',
                transition: 'background 0.4s ease',
                boxShadow: i < activeSection
                  ? '0 0 6px rgba(90, 140, 60, 0.3)'
                  : 'inset 1px 0 0 rgba(255,255,255,0.05)',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
