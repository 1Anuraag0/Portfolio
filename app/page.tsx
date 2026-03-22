'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SmoothScroll from '@/components/SmoothScroll';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ParticleField from '@/components/ParticleField';
import MiniMap from '@/components/MiniMap';

gsap.registerPlugin(ScrollTrigger);

const sectionNames = ['Countryside', 'Study', 'Workshop', 'Hilltop'];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [particleType, setParticleType] = useState<'blossom' | 'firefly' | 'star'>('blossom');

  useEffect(() => {
    // Track active section for mini-map and particle changes
    const sectionIds = ['#hero', '#about', '#projects', '#contact'];
    const particleTypes: ('blossom' | 'firefly' | 'firefly' | 'star')[] = ['blossom', 'firefly', 'firefly', 'star'];

    sectionIds.forEach((id, i) => {
      ScrollTrigger.create({
        trigger: id,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setActiveSection(i);
          setParticleType(particleTypes[i]);
        },
        onEnterBack: () => {
          setActiveSection(i);
          setParticleType(particleTypes[i]);
        },
      });
    });

    // Background color transition through scroll
    const colors = [
      { bg: '#2a1a3e' },  // Sunset purple
      { bg: '#1a1a2e' },  // Indoor dark
      { bg: '#16213e' },  // Workshop blue
      { bg: '#0d1b2a' },  // Night
    ];

    sectionIds.forEach((id, i) => {
      if (i > 0) {
        gsap.to('body', {
          backgroundColor: colors[i].bg,
          ease: 'none',
          scrollTrigger: {
            trigger: id,
            start: 'top bottom',
            end: 'top center',
            scrub: 1,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <SmoothScroll>
    <div ref={containerRef}>
      {/* Background video layer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {/* 2026 Procedural Ambient Background System */}
        <div style={{
          width: '100%',
          height: '100%',
          opacity: 0.2,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(126, 200, 227, 0.4) 0%, transparent 70%)',
          animation: 'ambientDrift 12s infinite alternate ease-in-out',
          filter: 'blur(30px)'
        }} />
        <style>{`
          @keyframes ambientDrift {
            0% { transform: scale(1) translate(0, 0); opacity: 0.15; }
            100% { transform: scale(1.3) translate(2vw, -4vh); opacity: 0.3; }
          }
        `}</style>
        {/* Pixel grid overlay on video */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)
          `,
        }} />
      </div>

      {/* Floating particles (changes type per section) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        pointerEvents: 'none',
      }}>
        <ParticleField type={particleType} count={25} />
      </div>

      {/* Mini-map navigation */}
      <MiniMap activeSection={activeSection} sections={sectionNames} />

      {/* Page sections — the narrative journey */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
    </SmoothScroll>
  );
}
