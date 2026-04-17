'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/Navigation.module.css';
import { useTrackClick } from '@/components/AnalyticsTracker';

export interface NavigationProps {
  // No props needed - component uses usePathname hook
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const trackLogoClick = useTrackClick('nav-logo', 'link');
  const trackPortfolioClick = useTrackClick('nav-portfolio', 'link');
  const trackAboutClick = useTrackClick('nav-about', 'link');
  const trackContactClick = useTrackClick('nav-contact', 'link');
  const trackCtaClick = useTrackClick('nav-cta-button', 'button');

  const navLinks = [
    { href: '/cases', label: 'Портфолио', trackClick: trackPortfolioClick },
    { href: '/about', label: 'Обо мне', trackClick: trackAboutClick },
    { href: '/contact', label: 'Контакты', trackClick: trackContactClick },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <nav className={styles.navigation} aria-label="Main navigation">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={() => { trackLogoClick(); closeMobileMenu(); }}>
          REX
        </Link>

        {/* Hamburger Button - Mobile Only */}
        <button
          className={styles.hamburger}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Desktop Navigation */}
        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${
                pathname === link.href ? styles.active : ''
              }`}
              onClick={() => { link.trackClick(); closeMobileMenu(); }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/contact" className={styles.ctaButton} onClick={() => { trackCtaClick(); closeMobileMenu(); }}>
          ЗАКАЗАТЬ
        </Link>
      </div>
    </nav>
    </header>
  );
}
