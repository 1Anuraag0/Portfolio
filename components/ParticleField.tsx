'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: 'firefly' | 'blossom' | 'star';
  phase: number;
}

interface ParticleFieldProps {
  type: 'firefly' | 'blossom' | 'star';
  count?: number;
}

export default function ParticleField({ type, count = 30 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse Tracking for Interactive Physics
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Initialize particles
    const colors = {
      firefly: ['#ffd700', '#f0a830', '#f5c76b'],
      blossom: ['#ffb7c5', '#ff91a4', '#ffd1dc', '#f5e6c8'],
      star: ['#f0f4f8', '#c0d6e4', '#ffd700', '#7ec8e3'],
    };

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: type === 'star' ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * (type === 'blossom' ? 1.5 : 0.5),
      speedY: type === 'blossom'
        ? Math.random() * 1.2 + 0.3
        : type === 'star'
          ? 0
          : (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[type][Math.floor(Math.random() * colors[type].length)],
      type,
      phase: Math.random() * Math.PI * 2,
    }));

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        const t = time * 0.001;

        if (p.type === 'firefly') {
          // Gentle floating with glow pulse
          p.x += p.speedX + Math.sin(t + p.phase) * 0.3;
          p.y += p.speedY + Math.cos(t + p.phase) * 0.2;
          const pulse = Math.sin(t * 2 + p.phase) * 0.3 + 0.7;

          ctx.save();
          ctx.globalAlpha = p.opacity * pulse;
          // Glow
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          // Pixelated square
          const s = Math.round(p.size);
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
          ctx.restore();
        } else if (p.type === 'blossom') {
          // Falling + gentle sway
          p.x += p.speedX + Math.sin(t * 0.8 + p.phase) * 0.8;
          p.y += p.speedY;

          ctx.save();
          ctx.globalAlpha = p.opacity;
          const s = Math.round(p.size);
          ctx.fillStyle = p.color;
          // Draw a tiny pixel cross for blossom
          ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
          ctx.fillRect(Math.round(p.x) - Math.round(s/2), Math.round(p.y) + Math.round(s/2), s, Math.round(s/2));
          ctx.fillRect(Math.round(p.x) + Math.round(s/2), Math.round(p.y) + Math.round(s/2), Math.round(s/2), s);
          ctx.restore();
        } else if (p.type === 'star') {
          // Twinkling stars
          const twinkle = Math.sin(t * 1.5 + p.phase) * 0.4 + 0.6;

          ctx.save();
          ctx.globalAlpha = p.opacity * twinkle;
          ctx.fillStyle = p.color;
          const s = Math.round(p.size);
          ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
          // Cross flare
          if (s > 2) {
            ctx.globalAlpha = p.opacity * twinkle * 0.3;
            ctx.fillRect(Math.round(p.x) - s, Math.round(p.y) + Math.floor(s/2), s * 3, 1);
            ctx.fillRect(Math.round(p.x) + Math.floor(s/2), Math.round(p.y) - s, 1, s * 3);
          }
          ctx.restore();
        }

        // --- 2026 Interactive Cursor Physics ---
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 140; // Area of effect

        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          const pushX = (dx / dist) * force * 4;
          const pushY = (dy / dist) * force * 4;
          
          p.x += pushX;
          p.y += pushY;
        }

        // Wrap around
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.y > canvas.height + 20) p.y = -20;
        if (p.y < -20) p.y = canvas.height + 20;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [type, count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
        imageRendering: 'pixelated',
      }}
    />
  );
}
