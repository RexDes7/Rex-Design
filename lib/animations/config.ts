// Animation configuration for visual enhancements
// Validates: Requirements 9.1, 9.2, 9.3

export const animationConfig = {
  // Durations (ms)
  durations: {
    fast: 200,
    normal: 400,
    slow: 600,
    hero: 1500,
  },
  
  // Easing functions
  easing: {
    easeOut: [0.16, 1, 0.3, 1],
    easeIn: [0.7, 0, 0.84, 0],
    easeInOut: [0.87, 0, 0.13, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  
  // Stagger delays (ms)
  stagger: {
    cards: 100,
    buttons: 150,
    list: 50,
  },
  
  // Marquee speeds (px/s)
  marquee: {
    slow: 30,
    normal: 50,
    fast: 80,
  },
  
  // Intersection thresholds
  thresholds: {
    minimal: 0.1,
    half: 0.5,
    full: 1.0,
  },
} as const;

export type AnimationConfig = typeof animationConfig;
