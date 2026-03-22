'use client';

import { useState } from 'react';

interface PixelCardProps {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  color?: string;
  link?: string;
}

export default function PixelCard({
  title,
  description,
  tags,
  icon,
  color = 'var(--sunset-orange)',
  link = '#',
}: PixelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        /* Dark leather card surface */
        background: isHovered
          ? 'linear-gradient(180deg, #2e2638 0%, #201a28 50%, #161220 100%)'
          : 'linear-gradient(180deg, #241e2c 0%, #1a1522 100%)',
        /* Beveled border */
        border: isHovered ? `2px solid ${color}88` : '2px solid var(--pixel-border)',
        borderTopColor: isHovered ? `${color}aa` : 'var(--pixel-border-light)',
        borderLeftColor: isHovered ? `${color}aa` : 'var(--pixel-border-light)',
        boxShadow: isHovered
          ? `
            4px 4px 0 0 rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.08),
            inset 0 -2px 4px rgba(0,0,0,0.35),
            0 0 24px ${color}15,
            0 12px 36px rgba(0,0,0,0.5)
          `
          : `
            3px 3px 0 0 rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -2px 4px rgba(0,0,0,0.4),
            0 6px 24px rgba(0,0,0,0.4)
          `,
        padding: '0',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        overflow: 'hidden',
        borderRadius: '2px',
      }}
    >
      {/* Header strip — dark with subtle color accent, NOT full-color background */}
      <div style={{
        background: `linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5))`,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: `2px solid ${color}33`,
        position: 'relative',
      }}>
        {/* Subtle color accent line at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}88, transparent)`,
        }} />
        <span style={{ fontSize: '20px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}>{icon}</span>
        <span style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '10px',
          color: 'var(--text-primary)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textShadow: '0 1px 0 rgba(0,0,0,0.5)',
        }}>
          {title}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        <p style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '14px',
          lineHeight: '1.65',
          color: 'var(--text-secondary)',
          marginBottom: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          {description}
        </p>

        {/* Tags — subtle engraved badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '12px',
        }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '11px',
              fontWeight: 500,
              padding: '3px 10px',
              background: 'rgba(0,0,0,0.25)',
              border: `1px solid ${color}44`,
              color: `${color}`,
              letterSpacing: '0.3px',
              borderRadius: '1px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Hover reveal — examine link */}
        {isHovered && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '10px',
            marginTop: '4px',
          }}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-retro)',
                fontSize: '12px',
                fontWeight: 500,
                color: color,
                textDecoration: 'none',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textShadow: `0 0 10px ${color}44`,
              }}
            >
              → View Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
