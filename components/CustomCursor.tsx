'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/CustomCursor.module.css';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Detect touch devices and disable custom cursor
    const isTouch = ('ontouchstart' in window) || 
                    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) || 
                    window.matchMedia('(pointer: coarse)').matches;
    
    if (isTouch) {
      setIsTouchDevice(true);
      return;
    }

    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Detect actual background color under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const actualBgColor = getActualBackgroundColor(element);
        const isBgDark = isColorDark(actualBgColor);

        setIsInverted(isBgDark);

        // Check if hovering over an interactive element
        const isInteractive = element?.matches('a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])') ||
                              !!element?.closest('a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])');
        setIsHovering(!!isInteractive);
      }

      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: trailId++ }];
        return newTrail.slice(-10);
      });
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Get actual background color by traversing up the DOM tree
  const getActualBackgroundColor = (element: Element): string => {
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const bgColor = style.backgroundColor;
      
      // Check if background is not transparent
      if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
        // Check alpha channel
        const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
          const alpha = match[4] ? parseFloat(match[4]) : 1;
          if (alpha > 0.5) {
            return bgColor;
          }
        }
      }
      
      current = current.parentElement;
    }
    
    // Default to body background or white
    return window.getComputedStyle(document.body).backgroundColor || 'rgb(255, 255, 255)';
  };

  // Helper function to determine if color is dark
  const isColorDark = (color: string): boolean => {
    // Parse rgb/rgba color
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return false;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    // Check if it's very dark (close to black)
    // Consider it dark only if all RGB values are less than 50
    return r < 50 && g < 50 && b < 50;
  };

  if (isTouchDevice) return null;
  if (!isVisible) return null;

  return (
    <>
      {/* Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className={`${styles.trailPoint} ${isInverted ? styles.inverted : ''}`}
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: (index + 1) / trail.length * 0.5,
            transform: `scale(${(index + 1) / trail.length})`,
          }}
        />
      ))}

      {/* Main cursor - larger dot */}
      <div
        className={`${styles.cursor} ${isInverted ? styles.inverted : ''} ${isHovering ? styles.hover : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}
