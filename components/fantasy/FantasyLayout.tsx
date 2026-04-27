'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '@/styles/fantasy/FantasyLayout.module.css';

const navigationItems = [
  { href: '/', label: 'Landing' },
  { href: '/character-builder', label: 'Character Builder' },
  { href: '/item-builder', label: 'Item Builder' },
  { href: '/map-editor', label: 'Map Editor' },
  { href: '/profile', label: 'Profile' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/library', label: 'Library' },
  { href: '/game', label: 'Game' },
];

interface FantasyLayoutProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function FantasyLayout({
  children,
  eyebrow = 'Arcana Tabletop Suite',
  title,
  description,
}: FantasyLayoutProps) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Arcana Tabletop Suite home">
          <span className={styles.brandMark}>A</span>
          <span>Arcana</span>
        </Link>
        <nav className={styles.nav} aria-label="Fantasy application pages">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {(title || description) && (
        <section className={styles.pageHeader}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          {title && <h1>{title}</h1>}
          {description && <p className={styles.description}>{description}</p>}
        </section>
      )}

      {children}
    </main>
  );
}
