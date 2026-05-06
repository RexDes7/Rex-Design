'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

interface Contacts {
  email: string;
  telegram: string;
  behance: string;
}

export default function Footer() {
  const [contacts, setContacts] = useState<Contacts>({
    email: 'hello@arhiv24.com',
    telegram: 'https://t.me/RLC_W',
    behance: 'https://behance.net/arhiv24'
  });

  useEffect(() => {
    let isMounted = true;
    
    // Load contacts from API
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setContacts(data.data);
        }
      })
      .catch(error => {
        console.error('Failed to load contacts:', error);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  const socialLinks = [
    { href: contacts.telegram, label: 'Telegram' },
    { href: contacts.behance, label: 'Behance' },
    { href: `mailto:${contacts.email}`, label: 'Email' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <Link href="/" className={styles.logo}>
            REX
          </Link>
        </div>

        <nav className={styles.socialLinks} aria-label="Social media links">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.copyright}>
          <p>© 2020-2026 REX DESIGN. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
        </div>
      </div>
    </footer>
  );
}
