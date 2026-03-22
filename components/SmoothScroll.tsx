'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — Lenis + GSAP ScrollTrigger sync
 *
 * Wraps children in a Lenis smooth-scroll instance that drives
 * GSAP ScrollTrigger. Uses rAF for buttery 60/120fps rendering
 * with lerp-based easing on every frame.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,              // Scroll lerp duration (lower = snappier)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easeOut
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (shares the same rAF loop)
    const tickHandler = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker gives seconds, Lenis wants ms
    };
    gsap.ticker.add(tickHandler);

    // Disable Lenis' own internal rAF since GSAP drives it
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickHandler);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
