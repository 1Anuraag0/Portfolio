'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PixelCard from '../PixelCard';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/1Anuraag0/repos?sort=updated&per_page=12')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setProjects([
            { title: 'Portfolio', description: 'Interactive React/Next.js portfolio.', tags: ['TypeScript', 'React'], icon: '⚡', color: '#7ec8e3', link: 'https://github.com/1Anuraag0/Portfolio' },
            { title: 'More Artifacts', description: 'Explore more on GitHub directly.', tags: ['Code', 'Open Source'], icon: '📦', color: '#e8764e', link: 'https://github.com/1Anuraag0' }
          ]);
          setLoading(false);
          return;
        }
        const formatted = data
          .filter((repo: any) => !repo.fork)
          .slice(0, 6)
          .map((repo: any, i: number) => ({
            title: repo.name,
            description: repo.description || 'A fascinating artifact forged in code.',
            tags: [repo.language || 'Code', ...(repo.topics || [])].slice(0, 3),
            icon: ['📦', '⭐', '⚡', '🔥', '🛡', '🔮'][i % 6],
            color: ['#e8764e', '#45b5aa', '#7ec8e3', '#f0a830', '#d6618f', '#6b3fa0'][i % 6],
            link: repo.html_url,
          }));
        setProjects(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch from GitHub', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || projects.length === 0) return;

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {
        gsap.fromTo(cardsRef.current?.children || [],
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.1, duration: 0.6, ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current, start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, [loading, projects.length]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section"
      style={{
        background: 'linear-gradient(180deg, #16213e 0%, #1a2838 30%, #162030 100%)',
        position: 'relative',
        paddingTop: '80px',
        paddingBottom: '100px',
      }}
    >
      {/* Subtle ambient lighting */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '300px',
        background: 'radial-gradient(circle, rgba(245, 199, 107, 0.05) 0%, transparent 70%)',
        zIndex: 0,
      }} />

      <div className="section-inner">
        {/* Section title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 'clamp(14px, 2.5vw, 20px)',
            color: 'var(--sunset-orange)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            textShadow: '0 0 10px rgba(232, 118, 78, 0.3), 0 2px 0 rgba(0,0,0,0.4)',
          }}>
            ⚒ The Workshop ⚒
          </h2>
          <p style={{
            fontFamily: 'var(--font-retro)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}>
            Artifacts forged in code and creativity
          </p>
        </div>

        {/* Project cards grid */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {loading ? (
            <p style={{
              fontFamily: 'var(--font-retro)', color: 'var(--text-secondary)',
              fontSize: '15px', textAlign: 'center', gridColumn: '1 / -1',
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}>
              Summoning artifacts from GitHub...
            </p>
          ) : (
            projects.map((project, i) => (
              <PixelCard key={i} {...project} />
            ))
          )}
        </div>

        {/* Footer CTA */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}>
          <a
            href="https://github.com/1Anuraag0"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-retro)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              padding: '12px 32px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              transition: 'all 0.3s ease',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 118, 78, 0.4)';
              e.currentTarget.style.color = '#e8764e';
              e.currentTarget.style.background = 'rgba(232, 118, 78, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            View All on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
