/**
 * Simplified Admin Panel Layout
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from '@/styles/admin/Admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Add admin-page class to body
  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  // Check authentication
  useEffect(() => {
    if (isLoginPage) return;

    const token = localStorage.getItem('auth-token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, [pathname, isLoginPage]);

  // If login page, render without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
