'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

interface Contacts {
  email: string;
  telegram: string;
  behance: string;
  phone?: string;
}

export default function Footer() {
  const [contacts, setContacts] = useState<Contacts>({
    email: 'rafaelaparyan@yandex.ru',
    telegram: 'https://t.me/RLC_W',
    behance: 'https://behance.net/arhiv24',
  });

  useEffect(() => {
    let isMounted = true;

    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.data) {
          setContacts({
            email: data.data.email || 'rafaelaparyan@yandex.ru',
            telegram: data.data.telegram || '',
            behance: data.data.behance || '',
            phone: data.data.phone || '',
          });
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
    { href: contacts.telegram, label: 'Telegram', icon: 'send' },
    { href: contacts.behance, label: 'Behance', icon: 'palette' },
    { href: `mailto:${contacts.email}`, label: 'Email', icon: 'mail' },
  ].filter(l => l.href);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top: CTA + nav */}
        <div className={styles.topGrid}>
          <div className={styles.ctaBlock}>
            <span className={styles.label}>СВЯЖЕМСЯ</span>
            <h2 className={styles.ctaHeading}>
              Давайте создадим
              <br />
              что-то&nbsp;
              <span className={styles.ctaAccent}>запоминающееся</span>.
            </h2>
            <Link href="/contact" className={styles.ctaButton}>
              Начать проект
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>

          <nav className={styles.navBlock} aria-label="Footer navigation">
            <span className={styles.label}>НАВИГАЦИЯ</span>
            <ul className={styles.navList}>
              <li><Link href="/">Главная</Link></li>
              <li><Link href="/cases">Портфолио</Link></li>
              <li><Link href="/about">Обо мне</Link></li>
              <li><Link href="/contact">Контакты</Link></li>
            </ul>
          </nav>

          <div className={styles.socialBlock}>
            <span className={styles.label}>СОЦИАЛЬНЫЕ СЕТИ</span>
            <ul className={styles.navList}>
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {link.icon}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom: logo + copyright */}
        <div className={styles.bottomBar}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>R</span>
            <span className={styles.logoText}>REX DESIGN</span>
          </Link>
          <p className={styles.copyright}>
            © 2020–2026 REX DESIGN. Все права защищены.
          </p>
          <p className={styles.credit}>
            Дизайн и разработка — <span className={styles.creditAccent}>Апарян Рафаэль</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
