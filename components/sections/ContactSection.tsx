'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);
  const pigeonRef = useRef<HTMLDivElement>(null);
  const [pigeonFlying, setPigeonFlying] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        y: 200, opacity: 0, scaleY: 0.3,
        transformOrigin: 'bottom center', duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(socialsRef.current?.children || [], {
        scale: 0, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(3)',
        scrollTrigger: {
          trigger: socialsRef.current, start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      ScrollTrigger.create({
        trigger: creditsRef.current, start: 'top 80%',
        onEnter: () => setShowCredits(true),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSend = () => {
    setPigeonFlying(true);
    if (pigeonRef.current) {
      gsap.to(pigeonRef.current, {
        y: -500, x: 200, rotation: -15, opacity: 0, duration: 2, ease: 'power2.in',
        onComplete: () => {
          setPigeonFlying(false);
          setFormData({ name: '', email: '', message: '' });
          if (pigeonRef.current) {
            gsap.set(pigeonRef.current, { y: 0, x: 0, rotation: 0, opacity: 1 });
          }
        },
      });
    }
  };

  const socials = [
    { icon: '🐦', label: 'Twitter', link: '#', color: '#7ec8e3' },
    { icon: '📦', label: 'GitHub', link: 'https://github.com/1Anuraag0', color: '#f5e6c8' },
    { icon: '💼', label: 'LinkedIn', link: 'https://www.linkedin.com/in/anuragdolui', color: '#4a90d9' },
    { icon: '📧', label: 'Email', link: '#', color: '#f0a830' },
    { icon: '🎨', label: 'Dribbble', link: '#', color: '#d6618f' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section"
      style={{
        background: 'linear-gradient(180deg, #162030 0%, #0d1b2a 30%, #0a1628 100%)',
        position: 'relative',
        paddingTop: '80px', paddingBottom: '60px',
        minHeight: '100vh',
      }}
    >
      {/* Starry sky (deterministic) */}
      {Array.from({ length: 40 }, (_, i) => {
        const seed = (i * 7 + 13) % 100;
        const seed2 = (i * 11 + 3) % 100;
        const size = 1 + (i % 3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${seed * 0.5}%`, left: `${seed2}%`,
              width: `${size}px`, height: `${size}px`,
              background: '#f0f4f8',
              zIndex: 0,
              animation: `float ${2 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i % 7) * 0.4}s`,
              opacity: 0.2 + (seed % 6) * 0.1,
              boxShadow: `0 0 ${size * 2}px rgba(240, 244, 248, 0.2)`,
            }}
          />
        );
      })}

      {/* Moon — embossed celestial body */}
      <div style={{
        position: 'absolute', top: '8%', right: '15%',
        width: '60px', height: '60px',
        background: 'radial-gradient(circle at 40% 40%, #f0f4f8 0%, #c0d6e4 50%, #8aa8c0 100%)',
        boxShadow: `
          0 0 40px rgba(192, 214, 228, 0.4),
          0 0 80px rgba(192, 214, 228, 0.2),
          inset -4px -4px 8px rgba(0,0,0,0.15),
          inset 2px 2px 4px rgba(255,255,255,0.3)
        `,
        zIndex: 1, borderRadius: '50%',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '30%',
          width: '10px', height: '10px',
          background: 'rgba(0,0,0,0.1)', borderRadius: '50%',
          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.15)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '55%',
          width: '8px', height: '8px',
          background: 'rgba(0,0,0,0.08)', borderRadius: '50%',
          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.1)',
        }} />
      </div>

      {/* Hillside with lanterns — kept as-is for pixel art charm */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '100%', height: '30%', zIndex: 1,
      }}>
        <svg viewBox="0 0 1440 300" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
          <path fill="#0a2218" d="M0,200 Q200,100 400,150 Q600,200 800,120 Q1000,80 1200,140 Q1350,180 1440,150 L1440,300 L0,300 Z" />
          <path fill="#081a12" d="M0,250 Q300,200 600,230 Q900,260 1200,220 Q1350,210 1440,240 L1440,300 L0,300 Z" />
        </svg>

        {[15, 30, 50, 70, 85].map((left, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: `${20 + Math.sin(left * 0.06) * 15}%`,
            left: `${left}%`, zIndex: 2,
          }}>
            <div style={{
              width: '8px', height: '12px',
              background: 'linear-gradient(180deg, #ffd700, #e8b800)',
              border: '1px solid #a67c2e',
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.5), 0 0 24px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
              animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }} />
            <div style={{
              width: '3px', height: '20px',
              background: 'linear-gradient(180deg, #5a4530, #3a2510)',
              margin: '0 auto',
            }} />
          </div>
        ))}
      </div>

      <div className="section-inner" style={{ position: 'relative', zIndex: 5 }}>
        {/* Section title — embossed moonlit heading */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(14px, 2.5vw, 20px)',
            color: 'var(--moon-silver)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            textShadow: '0 0 20px rgba(192, 214, 228, 0.4), 0 2px 0 rgba(0,0,0,0.5)',
          }}>
            🌙 End of the Trail 🌙
          </h2>
          <p style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '16px',
            color: 'var(--text-secondary)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}>
            Leave a message at the hilltop mailbox
          </p>
        </div>

        {/* Contact form — skeuomorphic scroll panel */}
        <div ref={formRef} style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <div className="rpg-panel" style={{
            position: 'relative', overflow: 'visible',
          }}>
            <div className="rpg-panel-title" style={{ color: 'var(--lantern-gold)' }}>
              📜 Compose Message
            </div>

            {/* Pigeon */}
            <div
              ref={pigeonRef}
              style={{
                position: 'absolute', top: '-30px', right: '20px',
                fontSize: '28px',
                transition: pigeonFlying ? 'none' : 'transform 0.3s',
                cursor: 'pointer',
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
              }}
            >
              🕊️
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '8px',
                  color: 'var(--text-secondary)', letterSpacing: '1px',
                  marginBottom: '6px', display: 'block',
                  textShadow: '0 1px 0 rgba(0,0,0,0.4)',
                }}>
                  YOUR NAME
                </label>
                <input
                  className="pixel-input" type="text"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '8px',
                  color: 'var(--text-secondary)', letterSpacing: '1px',
                  marginBottom: '6px', display: 'block',
                  textShadow: '0 1px 0 rgba(0,0,0,0.4)',
                }}>
                  YOUR EMAIL
                </label>
                <input
                  className="pixel-input" type="email"
                  placeholder="Enter your email..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '8px',
                  color: 'var(--text-secondary)', letterSpacing: '1px',
                  marginBottom: '6px', display: 'block',
                  textShadow: '0 1px 0 rgba(0,0,0,0.4)',
                }}>
                  YOUR MESSAGE
                </label>
                <textarea
                  className="pixel-input" rows={5}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                className="pixel-btn"
                onClick={handleSend}
                style={{
                  alignSelf: 'center',
                  background: 'linear-gradient(180deg, #ffd700, #e8b800)',
                  color: 'var(--pixel-black)',
                  marginTop: '8px',
                  borderColor: '#a67c2e',
                  borderTopColor: '#ffe44d',
                  borderLeftColor: '#ffe44d',
                }}
              >
                🕊 Send Carrier Pigeon
              </button>
            </div>
          </div>
        </div>

        {/* Social links — embossed icon panels */}
        <div
          ref={socialsRef}
          style={{
            display: 'flex', justifyContent: 'center', gap: '16px',
            marginBottom: '60px', flexWrap: 'wrap',
          }}
        >
          {socials.map((social, i) => (
            <a
              key={i}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '6px',
                padding: '12px 16px',
                background: 'linear-gradient(180deg, rgba(42, 34, 48, 0.8), rgba(28, 22, 32, 0.9))',
                border: '3px solid var(--pixel-border)',
                borderTopColor: 'var(--pixel-border-light)',
                borderLeftColor: 'var(--pixel-border-light)',
                textDecoration: 'none',
                transition: 'all 0.25s',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = social.color;
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 16px ${social.color}33, 3px 3px 0 rgba(0,0,0,0.3)`;
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--pixel-border)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '3px 3px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>{social.icon}</span>
              <span style={{
                fontFamily: 'var(--font-pixel)', fontSize: '7px',
                color: social.color, letterSpacing: '1px',
                textShadow: `0 0 6px ${social.color}44, 0 1px 0 rgba(0,0,0,0.4)`,
              }}>
                {social.label}
              </span>
            </a>
          ))}
        </div>

        {/* End credits — engraved */}
        <div ref={creditsRef} style={{
          textAlign: 'center', paddingTop: '40px',
          borderTop: '2px solid var(--pixel-border)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {showCredits && (
            <div style={{ animation: 'slideUp 2s ease-out forwards' }}>
              <p style={{
                fontFamily: 'var(--font-pixel)', fontSize: '11px',
                color: 'var(--moon-silver)', marginBottom: '16px',
                letterSpacing: '3px',
                textShadow: '0 0 12px rgba(192, 214, 228, 0.3), 0 2px 0 rgba(0,0,0,0.4)',
              }}>
                THANK YOU FOR VISITING
              </p>
              <p style={{
                fontFamily: 'var(--font-retro)', fontSize: '16px',
                color: 'var(--text-secondary)', marginBottom: '8px',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}>
                ~ The journey continues ~
              </p>
              <p style={{
                fontFamily: 'var(--font-pixel)', fontSize: '7px',
                color: 'var(--pixel-border)', letterSpacing: '2px', marginTop: '20px',
                textShadow: '0 1px 0 rgba(0,0,0,0.3)',
              }}>
                CRAFTED WITH ❤️ AND PIXELS
              </p>
              <p style={{
                fontFamily: 'var(--font-retro)', fontSize: '13px',
                color: 'var(--pixel-border)', marginTop: '8px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}>
                © 2025 — All quests reserved
              </p>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
