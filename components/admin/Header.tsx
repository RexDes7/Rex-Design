/**
 * Simplified Admin Header Component
 */

'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/admin/Admin.module.css';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/admin/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.pageTitle}>Админ Панель</h1>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <span className="material-symbols-outlined">logout</span>
          Выход
        </button>
      </div>
    </header>
  );
}
