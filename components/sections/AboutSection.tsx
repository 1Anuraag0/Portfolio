'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DialogueBox from '../DialogueBox';

gsap.registerPlugin(ScrollTrigger);

// Skill color mapping by language
const langColors: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3572a5',
  Java: '#b07219', 'C++': '#f34b7d', CSS: '#563d7c', HTML: '#e34c26',
  Go: '#00add8', Rust: '#dea584', Ruby: '#701516', PHP: '#4f5d95',
  Shell: '#89e051', Dart: '#00b4ab', Swift: '#f05138', Kotlin: '#a97bff',
  C: '#555555', 'C#': '#178600', Lua: '#000080', Vue: '#41b883',
  SCSS: '#c6538c', Dockerfile: '#384d54', Makefile: '#427819',
};

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
  fork: boolean;
  topics: string[];
}

interface LangStat {
  name: string;
  bytes: number;
  level: number;
  color: string;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [dialogueVisible, setDialogueVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [readmeBio, setReadmeBio] = useState<string | null>(null);
  const [skills, setSkills] = useState<LangStat[]>([]);
  const [quests, setQuests] = useState<GitHubRepo[]>([]);
  const [tools, setTools] = useState<string[]>([]);

  useEffect(() => {
    const username = '1Anuraag0';

    fetch('/api/github')
      .then(res => res.json())
      .then(data => {
        if (!data || data.error || !Array.isArray(data.repos)) {
          setProfile({ name: 'Anurag Dolui', public_repos: 24, followers: 12, following: 15, bio: 'Undergraduate student passionate about frontend development.', avatar_url: `https://github.com/${username}.png` });
          setQuests([
            { name: 'Portfolio', description: 'Next.js immersive dynamic portfolio.', language: 'TypeScript', stargazers_count: 5, updated_at: new Date().toISOString(), html_url: 'https://github.com/1Anuraag0/Portfolio', fork: false, topics: [] } as any,
            { name: 'Ecommerce-App', description: 'Fullstack high-performance ecommerce platform.', language: 'JavaScript', stargazers_count: 3, updated_at: new Date().toISOString(), html_url: 'https://github.com/1Anuraag0', fork: false, topics: [] } as any,
            { name: 'Game-Engine', description: 'A mystical HTML5 Canvas rendering project.', language: 'HTML', stargazers_count: 2, updated_at: new Date().toISOString(), html_url: 'https://github.com/1Anuraag0', fork: false, topics: [] } as any
          ]);
          setTools(['TypeScript', 'JavaScript', 'HTML', 'CSS', 'React']);
          setSkills([
            { name: 'TYPESCRIPT', bytes: 1000, level: 95, color: '#3178c6' },
            { name: 'JAVASCRIPT', bytes: 800, level: 80, color: '#f7df1e' },
            { name: 'HTML', bytes: 500, level: 65, color: '#e34c26' },
            { name: 'CSS', bytes: 400, level: 50, color: '#563d7c' },
            { name: 'REACT', bytes: 300, level: 45, color: '#61dafb' }
          ]);
          return;
        }

        setProfile(data.profile);
        if (data.bio) setReadmeBio(data.bio);
        
        const ownRepos = data.repos;
        setQuests(ownRepos.slice(0, 5));

        const allLangs = new Set<string>();
        ownRepos.forEach((r: any) => {
          if (r.language) allLangs.add(r.language);
        });
        setTools(Array.from(allLangs).slice(0, 10));

        const sorted = Object.entries(data.langTotals)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 6);

        if (sorted.length > 0) {
          const maxBytes = sorted[0][1] as number;
          const skillList: LangStat[] = sorted.map(([name, bytes]) => ({
            name: name.toUpperCase(),
            bytes: bytes as number,
            level: Math.round(((bytes as number) / maxBytes) * 100),
            color: langColors[name] || '#7ec8e3',
          }));
          setSkills(skillList);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(panelLeftRef.current, {
        x: -300, opacity: 0, rotation: -5, duration: 1, ease: 'bounce.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
      gsap.from(panelRightRef.current, {
        x: 300, opacity: 0, rotation: 5, duration: 1, ease: 'bounce.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
      });
      gsap.from(statsRef.current, {
        y: -200, opacity: 0, duration: 1.2, ease: 'bounce.out',
        scrollTrigger: {
          trigger: statsRef.current, start: 'top 80%', toggleActions: 'play none none reverse',
          onEnter: () => setStatsVisible(true),
          onLeaveBack: () => setStatsVisible(false),
        },
      });
      ScrollTrigger.create({
        trigger: sectionRef.current, start: 'top 50%',
        onEnter: () => setDialogueVisible(true),
        onLeaveBack: () => setDialogueVisible(false),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const formatQuestDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getFullYear().toString();
  };

  const displaySkills = skills.length > 0 ? skills : [
    { name: 'LOADING...', bytes: 0, level: 50, color: '#555' },
  ];

  const toolEmoji = (lang: string) => {
    const map: Record<string, string> = {
      TypeScript: '🟦', JavaScript: '🟨', Python: '🐍', Java: '☕',
      CSS: '🎨', HTML: '🌐', Go: '🐹', Rust: '⚙', Ruby: '💎',
      PHP: '🐘', Shell: '🐚', Dart: '🎯', Swift: '🐦', Kotlin: '🟣',
      'C++': '⚡', C: '🔧', 'C#': '🟩', Vue: '💚', SCSS: '🎨',
      Dockerfile: '🐳', Makefile: '🔨', Lua: '🌙',
    };
    return map[lang] || '🔹';
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section"
      style={{
        background: 'linear-gradient(180deg, #2d3a1e 0%, #1a1a2e 20%, #16213e 100%)',
        position: 'relative',
        paddingTop: '100px', paddingBottom: '100px',
      }}
    >
      {/* Indoor ambient glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '30%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(245, 199, 107, 0.1) 0%, transparent 70%)',
        zIndex: 0,
      }} />

      {/* Secondary ambient glow — right side */}
      <div style={{
        position: 'absolute', bottom: '20%', right: '15%',
        width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(69, 181, 170, 0.06) 0%, transparent 70%)',
        zIndex: 0,
      }} />

      <div className="section-inner" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Section Title — Embossed gold heading */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 className="pixel-glow-gold" style={{
            fontFamily: 'var(--font-pixel)', fontSize: 'clamp(14px, 2.5vw, 20px)',
            color: 'var(--amber-light)', letterSpacing: '4px', textTransform: 'uppercase',
          }}>
            ⚔ About The Wanderer ⚔
          </h2>
          {profile && (
            <div style={{
              fontFamily: 'var(--font-retro)', fontSize: '14px', color: 'var(--text-secondary)',
              marginTop: '8px', opacity: 0.7,
              textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            }}>
              {profile.public_repos} repositories • {profile.followers} followers • {profile.following} following
            </div>
          )}
        </div>

        {/* Two-panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
          {/* Left panel - Character Stats */}
          <div ref={panelLeftRef} className="rpg-panel">
            <div className="rpg-panel-title">⚙ Character Stats</div>

            {/* Character info */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
              {/* GitHub Avatar — embossed portrait */}
              <div style={{
                width: '64px', height: '64px',
                border: '3px solid var(--pixel-border)',
                borderTopColor: 'var(--pixel-border-light)',
                borderLeftColor: 'var(--pixel-border-light)',
                flexShrink: 0, overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4))',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 2px 2px 0 rgba(0,0,0,0.3)',
              }}>
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px' }}>🧙</div>
                )}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '10px',
                  color: 'var(--text-primary)', marginBottom: '4px', textTransform: 'uppercase',
                  textShadow: '0 1px 0 rgba(0,0,0,0.4)',
                }}>
                  {profile?.name || 'THE DEVELOPER'}
                </div>
                <div style={{
                  fontFamily: 'var(--font-retro)', fontSize: '14px', color: 'var(--text-secondary)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}>
                  LV. {profile?.public_repos || '??'} • {profile?.bio ? profile.bio.split(' ').slice(0, 4).join(' ') : 'Developer'}
                </div>
              </div>
            </div>

            {/* Stat bars — powered by GitHub language data */}
            <div ref={statsRef}>
              <div style={{
                fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text-secondary)',
                marginBottom: '8px', letterSpacing: '1px', opacity: 0.6,
                textShadow: '0 1px 0 rgba(0,0,0,0.4)',
              }}>
                📊 LANGUAGE PROFICIENCY (FROM REPOS)
              </div>
              {displaySkills.map((skill, i) => (
                <div key={i} className="stat-bar-container">
                  <div className="stat-bar-label">
                    <span>{skill.name}</span>
                    <span>{skill.level}/100</span>
                  </div>
                  <div className="stat-bar-track">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: statsVisible ? `${skill.level}%` : '0%',
                        background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                        transitionDelay: `${i * 0.2}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - Quest Log */}
          <div ref={panelRightRef} className="rpg-panel">
            <div className="rpg-panel-title">📜 Quest Log</div>
            <div style={{
              fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text-secondary)',
              marginBottom: '12px', letterSpacing: '1px', opacity: 0.6,
              textShadow: '0 1px 0 rgba(0,0,0,0.4)',
            }}>
              RECENT EXPEDITIONS (GITHUB REPOS)
            </div>

            {quests.length > 0 ? quests.map((repo, i) => (
              <a
                key={i}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px', marginBottom: '12px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.25))',
                  border: '2px solid var(--pixel-border)',
                  borderTopColor: 'var(--pixel-border-light)',
                  borderLeftColor: 'var(--pixel-border-light)',
                  display: 'flex', gap: '12px',
                  alignItems: 'flex-start', textDecoration: 'none', cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 2px 2px 0 rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(240,168,48,0.12), rgba(240,168,48,0.05))';
                  e.currentTarget.style.borderColor = 'var(--sunset-gold)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 12px rgba(240,168,48,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.25))';
                  e.currentTarget.style.borderColor = 'var(--pixel-border)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.05), 2px 2px 0 rgba(0,0,0,0.2)';
                }}
              >
                {/* Year badge — embossed pill */}
                <div style={{
                  fontFamily: 'var(--font-pixel)', fontSize: '8px', padding: '4px 8px',
                  background: 'linear-gradient(180deg, var(--sunset-orange), #c05a38)',
                  color: 'var(--pixel-black)', flexShrink: 0,
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                  textShadow: '0 1px 0 rgba(255,255,255,0.2)',
                }}>
                  {formatQuestDate(repo.updated_at)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-primary)',
                    marginBottom: '4px', textTransform: 'uppercase',
                    textShadow: '0 1px 0 rgba(0,0,0,0.4)',
                  }}>
                    {repo.name.replace(/-/g, ' ')}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-retro)', fontSize: '13px', color: 'var(--text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}>
                    {repo.description || 'A mysterious artifact...'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                    {repo.language && (
                      <span style={{
                        fontFamily: 'var(--font-retro)', fontSize: '11px', padding: '2px 6px',
                        background: `${langColors[repo.language] || '#555'}22`,
                        border: `1px solid ${langColors[repo.language] || '#555'}`,
                        color: langColors[repo.language] || '#aaa',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                      }}>
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-retro)', fontSize: '11px', color: '#f0a830',
                        textShadow: '0 0 6px rgba(240, 168, 48, 0.3)',
                      }}>
                        ⭐ {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            )) : (
              // Loading placeholder — embossed skeleton
              Array.from({ length: 3 }, (_, i) => (
                <div key={i} style={{
                  padding: '12px', marginBottom: '12px',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.25))',
                  border: '2px solid var(--pixel-border)',
                  borderTopColor: 'var(--pixel-border-light)',
                  height: '60px',
                  animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.2}s`,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                }} />
              ))
            )}

            {/* Equipped Tools section — metallic tool rack */}
            <div style={{
              marginTop: '16px', padding: '12px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
              border: '2px solid var(--pixel-border)',
              borderTopColor: 'var(--pixel-border-light)',
              borderLeftColor: 'var(--pixel-border-light)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--teal-accent)',
                marginBottom: '10px', letterSpacing: '1px',
                textShadow: '0 0 6px rgba(69, 181, 170, 0.3), 0 1px 0 rgba(0,0,0,0.4)',
              }}>
                🛡 EQUIPPED TOOLS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(tools.length > 0 ? tools : ['Loading...']).map((tool, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--font-retro)', fontSize: '12px', padding: '4px 10px',
                    background: 'linear-gradient(180deg, rgba(69, 181, 170, 0.18), rgba(69, 181, 170, 0.08))',
                    border: '2px solid var(--teal-dark)',
                    borderTopColor: '#3a9a8a',
                    color: 'var(--teal-accent)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 1px 1px 0 rgba(0,0,0,0.2)',
                    textShadow: '0 1px 0 rgba(0,0,0,0.3)',
                  }}>
                    {toolEmoji(tool)} {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dialogue box */}
        <div style={{ marginTop: '30px' }}>
          <DialogueBox
            isVisible={dialogueVisible}
            speaker={profile?.name ? profile.name.toUpperCase() : "THE WANDERER"}
            avatarEmoji="🧙"
            text={readmeBio || profile?.bio || "A mysterious developer whose artifacts and deeds are recorded in the Github archives. They wander the digital realm building open-source magic."}
            typingSpeed={25}
          />
        </div>

        {/* LinkedIn Connection — Skeuomorphic button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a
            href="https://www.linkedin.com/in/anuragdolui"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn"
            style={{
              background: 'linear-gradient(180deg, #4a90d9 0%, #3570b0 100%)',
              color: '#fff', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              borderColor: '#2a5080',
              borderTopColor: '#6ab0f0',
              borderLeftColor: '#6ab0f0',
            }}
          >
            <span style={{ fontSize: '18px' }}>💼</span> CONNECT ON LINKEDIN
          </a>
        </div>
      </div>

    </section>
  );
}
