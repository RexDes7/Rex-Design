'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { ReactNode } from 'react';

interface MainLayoutWrapperProps {
  children: ReactNode;
}

export default function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Don't show Navigation, Footer and CustomCursor on admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  const isFantasyPage = [
    '/',
    '/character-builder',
    '/item-builder',
    '/map-editor',
    '/profile',
    '/marketplace',
    '/library',
    '/game',
  ].includes(pathname || '');
  
  if (isAdminPage) {
    return <>{children}</>;
  }

  if (isFantasyPage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <CustomCursor />
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
