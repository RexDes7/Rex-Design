/**
 * Lazy-loaded FadeInWhenVisible Component
 * 
 * This component provides lazy loading for the FadeInWhenVisible animation component,
 * reducing initial bundle size by code-splitting Framer Motion.
 * 
 * Validates: Requirements 7.5
 */

'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { FadeInWhenVisibleProps } from './FadeInWhenVisible';

// Dynamically import FadeInWhenVisible with no SSR
const FadeInWhenVisible = dynamic(() => import('./FadeInWhenVisible'), {
  ssr: false,
  loading: () => null, // No loading state, just render children immediately
});

/**
 * Lazy-loaded wrapper for FadeInWhenVisible that code-splits Framer Motion
 */
export default function LazyFadeInWhenVisible(props: FadeInWhenVisibleProps): JSX.Element {
  return <FadeInWhenVisible {...props} />;
}
