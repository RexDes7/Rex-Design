/**
 * Lazy-loaded AnimatedSection Component
 * 
 * This component provides lazy loading for the AnimatedSection animation component,
 * reducing initial bundle size by code-splitting Framer Motion.
 * 
 * Validates: Requirements 7.5
 */

'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { AnimatedSectionProps } from './AnimatedSection';

// Dynamically import AnimatedSection with no SSR
const AnimatedSection = dynamic(() => import('./AnimatedSection'), {
  ssr: false,
  loading: () => null, // No loading state, just render children immediately
});

/**
 * Lazy-loaded wrapper for AnimatedSection that code-splits Framer Motion
 */
export default function LazyAnimatedSection(props: AnimatedSectionProps): JSX.Element {
  return <AnimatedSection {...props} />;
}
