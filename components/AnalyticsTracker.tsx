/**
 * Simplified Analytics Tracker Component
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    
    // Don't track admin pages
    if (pathname.startsWith('/admin')) {
      return;
    }

    // Send pageview to tracking API
    fetch('/api/track/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname })
    }).catch(error => {
      if (isMounted) {
        console.error('Failed to track pageview:', error);
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return null;
}

/**
 * Hook to track clicks on elements
 * Simplified version - just returns a no-op function
 */
export function useTrackClick(elementId: string, elementType: string) {
  return () => {
    // Simplified - no click tracking for now
    console.log(`Click tracked: ${elementId} (${elementType})`);
  };
}

/**
 * Function to track form submissions
 * Simplified version - just logs
 */
export function trackFormSubmission(
  formId: string,
  name: string,
  contact: string,
  description: string
) {
  // Simplified - no form submission tracking for now
  console.log(`Form submitted: ${formId}`, { name, contact, description });
}
