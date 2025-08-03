'use client';

import styles from './CourtAnimation.module.scss';
import { useEffect, useState } from 'react';

export default function CourtAnimation() {
  const [position, setPosition] = useState({ x: 350, y: 120 });
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const moveBall = () => {
      const newX =
        direction === 'right'
          ? Math.floor(Math.random() * 120 + 300) // 300–420
          : Math.floor(Math.random() * 120 + 60); // 60–180

      const newY = Math.floor(Math.random() * 180 + 90); // 90–270

      setPosition({ x: newX, y: newY });
      setDirection((prev) => (prev === 'left' ? 'right' : 'left'));

      setTimeout(moveBall, 2000);
    };

    const timeoutId = setTimeout(moveBall, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" className={styles.tennisCourt}>
      {/* Background */}
      <rect width="600" height="360" fill="#C1EDC1" rx="40" />

      {/* Court */}
      <rect x="60" y="60" width="480" height="240" fill="#88D88D" stroke="white" strokeWidth="4" />

      {/* Net */}
      <line x1="300" y1="60" x2="300" y2="300" stroke="white" strokeWidth="4" />

      {/* Singles & Doubles Lines */}
      <line x1="60" y1="60" x2="540" y2="60" stroke="white" strokeWidth="2" />
      <line x1="60" y1="300" x2="540" y2="300" stroke="white" strokeWidth="2" />
      <line x1="60" y1="90" x2="540" y2="90" stroke="white" strokeWidth="2" />
      <line x1="60" y1="270" x2="540" y2="270" stroke="white" strokeWidth="2" />

      {/* Service Boxes */}
      <line x1="180" y1="90" x2="180" y2="270" stroke="white" strokeWidth="2" />
      <line x1="420" y1="90" x2="420" y2="270" stroke="white" strokeWidth="2" />
      <line x1="180" y1="180" x2="300" y2="180" stroke="white" strokeWidth="2" />
      <line x1="300" y1="180" x2="420" y2="180" stroke="white" strokeWidth="2" />

      {/* Interactive Zones */}
      <rect className={styles.zone} x="180" y="90" width="120" height="90" fill="transparent" />
      <rect className={styles.zone} x="180" y="180" width="120" height="90" fill="transparent" />
      <rect className={styles.zone} x="300" y="90" width="120" height="90" fill="transparent" />
      <rect className={styles.zone} x="300" y="180" width="120" height="90" fill="transparent" />

      {/* Ball Animations */}
      <circle
        className={styles.ball}
        cx="100"
        cy="120"
        r="10"
        style={
          {
            '--end-x': `${position.x}px`,
            '--end-y': `${position.y - 120}px`,
          } as React.CSSProperties
        }
      />
    </svg>
  );
}
