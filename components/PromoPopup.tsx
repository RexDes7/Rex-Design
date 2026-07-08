'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/PromoPopup.module.css';

const STORAGE_KEY_30S = 'rex_popup_30s_shown';
const STORAGE_KEY_2MIN = 'rex_popup_2min_shown';

const FIRST_POPUP_DELAY = 30000;          // 30 seconds
const SECOND_POPUP_INACTIVITY = 120000;   // 2 minutes
const RECURRING_POPUP_INACTIVITY = 600000; // 10 minutes
const INACTIVITY_CHECK_INTERVAL = 10000;  // check every 10s

type PopupType = 'first' | 'second' | 'recurring';

export default function PromoPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>('first');
  const lastActivityRef = useRef<number>(Date.now());
  const firstPopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityCheckerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Listen for activity events (modal open, form submit)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener('rex:activity', handleActivity);
    return () => {
      window.removeEventListener('rex:activity', handleActivity);
    };
  }, []);

  // Reset activity timer on route change (navigation = activity)
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, [pathname]);

  // First popup: 30s after initial mount
  // On main page load/refresh, clear flags so popup re-triggers
  useEffect(() => {
    // Clear flags on main page (refresh of main page = new session)
    if (pathname === '/') {
      sessionStorage.removeItem(STORAGE_KEY_30S);
      sessionStorage.removeItem(STORAGE_KEY_2MIN);
    }

    const alreadyShown = sessionStorage.getItem(STORAGE_KEY_30S);
    if (alreadyShown) return;

    firstPopupTimerRef.current = setTimeout(() => {
      // Don't show if project modal is open
      if (document.body.hasAttribute('data-modal-open')) return;
      setPopupType('first');
      setIsOpen(true);
      sessionStorage.setItem(STORAGE_KEY_30S, 'true');
    }, FIRST_POPUP_DELAY);

    return () => {
      if (firstPopupTimerRef.current) clearTimeout(firstPopupTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inactivity checker — runs continuously, checks every 10s
  useEffect(() => {
    inactivityCheckerRef.current = setInterval(() => {
      // Skip if popup already open or project modal is open
      if (isOpen) return;
      if (document.body.hasAttribute('data-modal-open')) return;

      const now = Date.now();
      const inactiveFor = now - lastActivityRef.current;
      const shown2min = sessionStorage.getItem(STORAGE_KEY_2MIN);

      if (!shown2min && inactiveFor >= SECOND_POPUP_INACTIVITY) {
        // Second popup: 2 min inactivity (once per session)
        setPopupType('second');
        setIsOpen(true);
        sessionStorage.setItem(STORAGE_KEY_2MIN, 'true');
        lastActivityRef.current = now;
      } else if (shown2min && inactiveFor >= RECURRING_POPUP_INACTIVITY) {
        // Recurring popup: 10 min inactivity (repeats)
        setPopupType('recurring');
        setIsOpen(true);
        lastActivityRef.current = now;
      }
    }, INACTIVITY_CHECK_INTERVAL);

    return () => {
      if (inactivityCheckerRef.current) clearInterval(inactivityCheckerRef.current);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Closing popup counts as activity — resets inactivity timer
    lastActivityRef.current = Date.now();
  };

  if (!isOpen) return null;

  const content = {
    first: {
      icon: 'handshake',
      title: 'Обсудим ваш проект?',
      text: 'Расскажите о задаче — отвечу в течение 24 часов с предварительной оценкой и планом работы.',
    },
    second: {
      icon: 'help_outline',
      title: 'Ещё подумываете?',
      text: 'Если есть вопросы или нужны уточнения — напишите, помогу разобраться без обязательств.',
    },
    recurring: {
      icon: 'mail',
      title: 'Я всё ещё на связи',
      text: 'Свободен для новых проектов. Напишите — обсудим детали и сроки.',
    },
  }[popupType];

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className={styles.icon}>
          <span className="material-symbols-outlined">{content.icon}</span>
        </div>

        <h3 className={styles.title}>{content.title}</h3>
        <p className={styles.text}>{content.text}</p>

        <div className={styles.buttons}>
          <Link
            href="/contact"
            className={styles.ctaButton}
            onClick={handleClose}
          >
            Начать проект
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <button className={styles.laterButton} onClick={handleClose}>
            Позже
          </button>
        </div>
      </div>
    </div>
  );
}
