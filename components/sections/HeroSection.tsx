'use client';

import { useEffect, useState, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   SeamlessVideo — Manual ping-pong (no native loop)
   
   Two <video> elements alternate. When the active one nears
   its end, the standby one starts from 0 and crossfades in.
   NO browser loop or autoPlay — we control every frame.
   Always at least one video at full opacity.
   ───────────────────────────────────────────────────────────── */
function SeamlessVideo({ src, containerOpacity }: { src: string; containerOpacity: number }) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  const CROSSFADE = 0.6; // seconds of crossfade overlap

  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB || containerOpacity <= 0) return;

    // State tracked via refs (no React re-renders)
    let active: HTMLVideoElement = vA;
    let standby: HTMLVideoElement = vB;
    let switching = false;

    // Initialize: A plays, B waits
    vA.currentTime = 0.03; // skip frame-0 compression artifacts
    vA.playbackRate = 0.4;
    vA.style.opacity = '1';
    vA.play().catch(() => { });

    vB.currentTime = 0.03;
    vB.playbackRate = 0.4;
    vB.pause();
    vB.style.opacity = '0';

    let raf: number;
    const tick = () => {
      const d = active.duration;
      if (d && isFinite(d)) {
        const remaining = d - active.currentTime;

        // Start crossfade when nearing the end
        if (remaining <= CROSSFADE && !switching) {
          switching = true;
          standby.currentTime = 0.03; // skip frame-0 glitch
          standby.play().catch(() => { });
        }

        if (switching) {
          // Smooth crossfade progress (0 → 1)
          const progress = Math.max(0, Math.min(1, 1 - remaining / CROSSFADE));
          active.style.opacity = String(1 - progress);
          standby.style.opacity = String(progress);

          // Swap when crossfade is complete
          if (progress >= 1 || active.ended) {
            active.pause();
            active.style.opacity = '0';
            standby.style.opacity = '1';

            // Swap roles
            const tmp = active;
            active = standby;
            standby = tmp;
            switching = false;
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      vA.pause();
      vB.pause();
    };
  }, [containerOpacity, src]);

  if (containerOpacity <= 0) return null;

  const videoClass = "absolute inset-0 h-full w-full object-cover object-center";

  return (
    <div
      className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
      style={{ opacity: containerOpacity }}
    >
      <video ref={videoARef} src={src} muted playsInline preload="auto" className={videoClass} />
      <video ref={videoBRef} src={src} muted playsInline preload="auto" className={videoClass} />
    </div>
  );
}

// Seeded PRNG (mulberry32) to avoid hydration mismatches from Math.random()
function createSeededRandom(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const seeded = createSeededRandom(42);

// Pre-compute deterministic data once at module level
const petals = Array.from({ length: 35 }, (_, i) => {
  const r1 = seeded(), r2 = seeded(), r3 = seeded(), r4 = seeded(), r5 = seeded();
  return {
    delay: i * 1.2 + r1 * 2,
    left: r2 * 100,
    size: 5 + r3 * 6,
    reverse: r4 > 0.5,
    opacity: 0.5 + r5 * 0.3,
    duration: 8 + seeded() * 6,
  };
});

const stars = Array.from({ length: 30 }, (_, i) => {
  const r1 = seeded(), r2 = seeded(), r3 = seeded(), r4 = seeded(), r5 = seeded();
  return {
    top: r1 * 45,
    left: r2 * 100,
    size: 1 + r3 * 2.5,
    delay: r4 * 5,
    duration: 2 + r5 * 3,
  };
});

const SakuraPetal = ({ delay, left, size, reverse, opacity, duration }: {
  delay: number; left: number; size: number; reverse?: boolean; opacity: number; duration: number;
}) => (
  <div
    className={`absolute ${reverse ? 'animate-petal-reverse' : 'animate-petal'} pointer-events-none`}
    style={{
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      top: '-20px'
    }}>
    <div
      className="rounded-full bg-[#f6b8d1]"
      style={{
        width: `${size}px`,
        height: `${size * 0.6}px`,
        opacity,
        boxShadow: '0 0 6px rgba(246, 184, 209, 0.11)',
      }} />
  </div>
);


const Star = ({ top, left, size, delay, duration }: {
  top: number; left: number; size: number; delay: number; duration: number;
}) => (
  <div
    className="absolute rounded-full bg-[#e8e4db] animate-twinkle"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      boxShadow: `0 0 ${size * 3}px rgba(232, 228, 219, 0.3)`,
    }} />
);

/**
 * Compute which video phase we're in based on the current hour.
 *
 * Timeline (24h):
 *   0–5    → full night  (Nighthero.mp4, opacity 1)
 *   5–7    → dawn blend  (crossfade night→day)
 *   7–17   → full day    (Herobg.mp4, opacity 1)
 *   17–19  → dusk blend  (crossfade day→night)
 *   19–24  → full night  (Nighthero.mp4, opacity 1)
 *
 * Returns { dayOpacity, nightOpacity, isNight, showStars }
 */
function getTimeOfDayState() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  let dayOpacity = 0;
  let nightOpacity = 1;

  if (hour < 5) {
    // Deep night
    nightOpacity = 1;
    dayOpacity = 0;
  } else if (hour < 7) {
    // Dawn transition: night fades out, day fades in
    const t = (hour - 5) / 2; // 0→1 over 2 hours
    nightOpacity = 1 - t;
    dayOpacity = t;
  } else if (hour < 17) {
    // Full day
    nightOpacity = 0;
    dayOpacity = 1;
  } else if (hour < 19) {
    // Dusk transition: day fades out, night fades in
    const t = (hour - 17) / 2; // 0→1 over 2 hours
    nightOpacity = t;
    dayOpacity = 1 - t;
  } else {
    // Night
    nightOpacity = 1;
    dayOpacity = 0;
  }

  const isNight = nightOpacity > 0.5;
  const showStars = nightOpacity > 0.2;

  return { dayOpacity, nightOpacity, isNight, showStars };
}


export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [timeState, setTimeState] = useState({
    dayOpacity: 0,
    nightOpacity: 1,
    isNight: true,
    showStars: true,
  });

  // Update time state on mount and every minute
  const updateTimeState = useCallback(() => {
    setTimeState(getTimeOfDayState());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateTimeState();
    const interval = setInterval(updateTimeState, 60_000); // Update every minute
    return () => clearInterval(interval);
  }, [updateTimeState]);

  return (
    <section id="hero" className="relative min-h-screen w-full flex-shrink-0 flex-grow-0 overflow-hidden bg-[#0a0a0f]">
      {/* Video backgrounds — seamless double-buffer loops */}
      <div className="absolute inset-0">
        <SeamlessVideo src="/Nighthero.mp4" containerOpacity={timeState.nightOpacity} />
        <SeamlessVideo src="/Herobg.mp4" containerOpacity={timeState.dayOpacity} />

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 via-transparent to-transparent" />
      </div>

      {/* Stars — visible during night and transition periods */}
      {timeState.showStars && (
        <div
          className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
          style={{ opacity: timeState.nightOpacity }}
        >
          {stars.map((star, i) =>
            <Star key={i} {...star} />
          )}
        </div>
      )}

      {/* Sakura petals */}
      <div className="absolute inset-0 overflow-hidden">
        {petals.map((petal, i) =>
          <SakuraPetal key={i} {...petal} />
        )}
      </div>

      {/* Amber glow accent — bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-[#d09140]/10 blur-[100px] animate-glow-pulse" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">

        {/* Main heading — clean, bold name */}
        <h1
          className={`text-balance text-center text-white ${loaded ? 'animate-float-up' : 'opacity-0'}`}
          style={{
            animationDelay: '0.4s',
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 'clamp(32px, 12vw, 120px)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}>
          <span className="block" style={{
            textShadow: `
              0 2px 0 rgba(0,0,0,0.5),
              0 4px 12px rgba(0,0,0,0.4),
              0 0 60px rgba(246, 184, 209, 0.12)
            `,
          }}>Anurag Dolui</span>
        </h1>

        {/* Subtitle — refined with decorative line */}
        <div
          className={loaded ? 'animate-float-up' : 'opacity-0'}
          style={{
            animationDelay: '0.7s',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{
            width: '40px', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(154, 146, 166, 0.5))',
          }} />
          <p style={{
            textAlign: 'center',
            fontSize: 'clamp(11px, 1.5vw, 15px)',
            fontWeight: 300,
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: '#9a92a6',
            fontFamily: "'Outfit', sans-serif",
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}>
            Developer &amp; Creator
          </p>
          <div style={{
            width: '40px', height: '1px',
            background: 'linear-gradient(270deg, transparent, rgba(154, 146, 166, 0.5))',
          }} />
        </div>

        {/* Subtle CTA hint — animated dots instead of scroll */}
        <div
          className={loaded ? 'animate-float-up' : 'opacity-0'}
          style={{
            animationDelay: '1.2s',
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '4px', height: '4px',
              borderRadius: '50%',
              background: '#5a4f62',
              animation: 'float 2s ease-in-out infinite',
              animationDelay: `${i * 0.3}s`,
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
