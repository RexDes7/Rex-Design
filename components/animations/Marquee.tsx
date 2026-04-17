'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from '@/styles/animations/Marquee.module.css';
import { useAnimationComplexity } from '@/lib/animations/useAnimationComplexity';

/**
 * Marquee Component - Seamless infinite scrolling text animation
 * Validates: Requirements 2.1, 2.2, 2.3, 2.5
 */

export interface MarqueeProps {
  items: string[];           // Элементы для отображения
  speed?: number;            // Скорость анимации (px/s), default: 50
  direction?: 'left' | 'right'; // Направление, default: 'left'
  pauseOnHover?: boolean;    // Пауза при наведении, default: false
  className?: string;
}

export default function Marquee({
  items,
  speed = 50,
  direction = 'left',
  pauseOnHover = false,
  className = '',
}: MarqueeProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState<number>(20);
  const complexity = useAnimationComplexity();

  // Disable animation on mobile/simplified devices
  const isDisabled = complexity === 'none';

  // Adjust speed for simplified mode (slower on mobile)
  const effectiveSpeed = complexity === 'simplified' ? speed * 0.6 : speed;

  useEffect(() => {
    if (contentRef.current) {
      const contentWidth = contentRef.current.scrollWidth / 2;
      const duration = contentWidth / effectiveSpeed;
      setAnimationDuration(duration);
    }
  }, [items, effectiveSpeed]);

  if (!items || items.length === 0) {
    return <div className={`${styles.marquee} ${className}`} />;
  }

  const marqueeClasses = [
    styles.marquee,
    direction === 'right' ? styles.reverse : '',
    pauseOnHover ? styles.pauseOnHover : '',
    isDisabled ? styles.noAnimation : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={marqueeClasses}>
      <div
        ref={contentRef}
        className={styles.marqueeContent}
        style={{
          animationDuration: `${animationDuration}s`,
        }}
      >
        {items.map((item, index) => (
          <span key={`original-${index}`} className={styles.marqueeItem}>
            {item}
          </span>
        ))}
        {items.map((item, index) => (
          <span key={`duplicate-${index}`} className={styles.marqueeItem}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
