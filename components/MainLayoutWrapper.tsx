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
  
  if (isAdminPage) {
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
