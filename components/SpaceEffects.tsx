'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/SpaceEffects.module.css';

export default function SpaceEffects() {
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; delay: number; duration: number; top: number; left: number }>>([]);

  useEffect(() => {
    // Generate shooting stars periodically
    const generateShootingStar = () => {
      const id = Date.now();
      const delay = Math.random() * 2;
      const duration = 1 + Math.random() * 1.5;
      const top = Math.random() * 50; // Top half of screen
      const left = Math.random() * 100;

      setShootingStars(prev => [...prev, { id, delay, duration, top, left }]);

      // Remove after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
      }, (delay + duration) * 1000 + 100);
    };

    // Generate shooting star every 12-20 seconds (increased from 8-15)
    const interval = setInterval(() => {
      generateShootingStar();
    }, 12000 + Math.random() * 8000);

    // Generate first one after 5 seconds (increased from 3)
    const timeout = setTimeout(generateShootingStar, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={styles.spaceEffects}>
      {/* Shooting Stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className={styles.shootingStar}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Satellite */}
      <div className={styles.satellite}>
        <div className={styles.satelliteBody}>
          <div className={styles.satelliteLight} />
          <div className={styles.satelliteLight} style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
}
