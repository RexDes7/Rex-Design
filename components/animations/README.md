# Animation Components

This directory contains animation components for the portfolio site, with lazy loading support for optimal bundle size.

## Components

### FadeInWhenVisible
Higher-order component that triggers animations when elements become visible during scroll.

**Features:**
- Multiple animation variants: fadeIn, slideUp, slideLeft, scale
- Configurable delay, duration, and threshold
- Uses Framer Motion's useInView hook
- Lazy-loaded by default

### AnimatedSection
Wrapper component that applies staggered animations to its children.

**Features:**
- Staggered entrance animations
- Configurable stagger delay
- Uses Framer Motion's staggerChildren
- Lazy-loaded by default

### Marquee
Seamless infinite scrolling text animation component.

**Features:**
- Continuous horizontal animation
- Configurable speed and direction
- Pause on hover support
- Pure CSS animations (no lazy loading needed)

## Lazy Loading

The animation components use Next.js dynamic imports to code-split Framer Motion, reducing the initial bundle size.

### Usage

```tsx
// Recommended: Import from barrel export (lazy-loaded by default)
import { FadeInWhenVisible, AnimatedSection } from '@/components/animations';

// Direct import (if you need non-lazy version)
import FadeInWhenVisible from '@/components/animations/FadeInWhenVisible';
```

### How It Works

1. `LazyFadeInWhenVisible.tsx` and `LazyAnimatedSection.tsx` use Next.js `dynamic()` to lazy-load the actual components
2. The barrel export (`index.ts`) exports the lazy versions by default
3. Framer Motion is only loaded when these components are rendered
4. SSR is disabled (`ssr: false`) to avoid hydration issues

### Benefits

- **Reduced Initial Bundle**: Framer Motion (~50KB gzipped) is not included in the initial bundle
- **Faster Page Load**: Critical content loads faster
- **Code Splitting**: Animation library is loaded on-demand
- **Better Performance**: Especially beneficial for users who don't scroll or interact with animations

## Validates

- **Requirements 7.5**: Animation library lazy loading and code splitting
