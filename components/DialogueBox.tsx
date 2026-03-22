'use client';

import { useEffect, useRef, useState } from 'react';

interface DialogueBoxProps {
  text: string;
  speaker?: string;
  avatarEmoji?: string;
  isVisible: boolean;
  typingSpeed?: number;
}

export default function DialogueBox({
  text,
  speaker = '',
  avatarEmoji = '🧙',
  isVisible,
  typingSpeed = 30,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('');
      indexRef.current = 0;
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    indexRef.current = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [isVisible, text, typingSpeed]);

  if (!isVisible) return null;

  return (
    <div className="dialogue-box" style={{
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    }}>
      {/* Avatar — Embossed portrait frame */}
      <div style={{
        width: '64px',
        height: '64px',
        background: 'linear-gradient(180deg, #1c1620, #0e0a14)',
        border: '3px solid var(--pixel-border)',
        borderTopColor: 'var(--pixel-border-light)',
        borderLeftColor: 'var(--pixel-border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        flexShrink: 0,
        boxShadow: `
          inset 0 2px 4px rgba(0,0,0,0.5),
          inset 0 -1px 0 rgba(255,255,255,0.05),
          2px 2px 0 rgba(0,0,0,0.3)
        `,
      }}>
        {avatarEmoji}
      </div>

      {/* Text area */}
      <div style={{ flex: 1 }}>
        {speaker && (
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '11px',
            color: 'var(--sunset-gold)',
            marginBottom: '8px',
            letterSpacing: '1px',
            textShadow: '0 0 8px rgba(240, 168, 48, 0.4), 0 1px 0 rgba(0,0,0,0.5)',
          }}>
            {speaker}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-retro)',
          fontSize: '15px',
          lineHeight: '1.7',
          color: 'var(--text-primary)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          {displayedText}
          {isTyping && <span className="typewriter-cursor" />}
        </div>
      </div>
    </div>
  );
}
