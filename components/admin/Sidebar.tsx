/**
 * Simplified Admin Sidebar Navigation
 */

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/styles/admin/Admin.module.css';

const navItems = [
  { label: 'Панель', href: '/admin', icon: '📊' },
  { label: 'Проекты', href: '/admin/projects', icon: '🎨' },
  { label: 'Контакты', href: '/admin/contacts', icon: '📧' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/admin/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Админ Панель</h2>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.sidebarLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>Выход</span>
        </button>
      </div>
    </aside>
  );
}
