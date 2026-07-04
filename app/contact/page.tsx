'use client';

import { useState, useEffect } from 'react';
import ContactForm from '@/components/ContactForm';
import SectionLabel from '@/components/SectionLabel';
import { FadeInWhenVisible } from '@/components/animations';
import styles from '@/styles/Contact.module.css';

interface ContactData {
  email: string;
  telegram: string;
  phone?: string;
  behance?: string;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactData>({
    email: 'rafaelaparyan@yandex.ru',
    telegram: '@RLC_W',
    phone: '+7 902 212 10 44',
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        if (data.success && data.data) {
          setContacts(data.data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const telegramUrl = contacts.telegram?.startsWith('http')
    ? contacts.telegram
    : `https://t.me/${contacts.telegram?.replace('@', '')}`;

  return (
    <main id="main-content" className={styles.main}>
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBlob} />
          <div className={styles.heroGrid} />
        </div>

        <div className={styles.heroContainer}>
          <FadeInWhenVisible variant="slideUp">
            <div className={styles.heroContent}>
              <SectionLabel number="01">Контакты</SectionLabel>
              <h1 className={styles.heroTitle}>
                Давайте создадим
                <br />
                <span className={styles.accent}>что-то стоящее</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Открыт к новым проектам с 2020 года. Расскажите о задаче —
                отвечу в течение 24 часов с предварительной оценкой.
              </p>
              <div className={styles.availability}>
                <span className={styles.availabilityDot} aria-hidden="true" />
                <span>Свободен для новых проектов</span>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTENT GRID: form + sidebar */}
      {/* ===================================================== */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          {/* Form column */}
          <FadeInWhenVisible variant="slideUp">
            <div className={styles.formColumn}>
              <SectionLabel number="02">Бриф</SectionLabel>
              <h2 className={styles.formTitle}>
                Расскажите<br />
                <span className={styles.accent}>о проекте</span>
              </h2>
              <p className={styles.formText}>
                Чем подробнее вы опишете задачу, тем точнее я смогу оценить
                сроки и стоимость. Все поля обязательны, кроме бюджета.
              </p>
              <ContactForm />
            </div>
          </FadeInWhenVisible>

          {/* Sidebar */}
          <FadeInWhenVisible variant="slideUp" delay={0.15}>
            <aside className={styles.sidebar}>
              {/* Direct contacts */}
              <div className={styles.sidebarBlock}>
                <h3 className={styles.sidebarTitle}>Прямой контакт</h3>
                <ul className={styles.contactList}>
                  {contacts.email && (
                    <li>
                      <a
                        href={`mailto:${contacts.email}`}
                        className={styles.contactItem}
                      >
                        <div className={styles.contactIcon}>
                          <span className="material-symbols-outlined" aria-hidden="true">
                            mail
                          </span>
                        </div>
                        <div className={styles.contactInfo}>
                          <span className={styles.contactLabel}>Email</span>
                          <span className={styles.contactValue}>
                            {contacts.email}
                          </span>
                        </div>
                        <span className={styles.contactArrow} aria-hidden="true">
                          <span className="material-symbols-outlined">
                            arrow_outward
                          </span>
                        </span>
                      </a>
                    </li>
                  )}

                  {contacts.telegram && (
                    <li>
                      <a
                        href={telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactItem}
                      >
                        <div className={styles.contactIcon}>
                          <span className="material-symbols-outlined" aria-hidden="true">
                            send
                          </span>
                        </div>
                        <div className={styles.contactInfo}>
                          <span className={styles.contactLabel}>Telegram</span>
                          <span className={styles.contactValue}>
                            {contacts.telegram.startsWith('http')
                              ? `@${contacts.telegram.split('/').pop()}`
                              : contacts.telegram}
                          </span>
                        </div>
                        <span className={styles.contactArrow} aria-hidden="true">
                          <span className="material-symbols-outlined">
                            arrow_outward
                          </span>
                        </span>
                      </a>
                    </li>
                  )}

                  {contacts.phone && (
                    <li>
                      <a
                        href={`tel:${contacts.phone.replace(/\s/g, '')}`}
                        className={styles.contactItem}
                      >
                        <div className={styles.contactIcon}>
                          <span className="material-symbols-outlined" aria-hidden="true">
                            call
                          </span>
                        </div>
                        <div className={styles.contactInfo}>
                          <span className={styles.contactLabel}>Телефон</span>
                          <span className={styles.contactValue}>
                            {contacts.phone}
                          </span>
                        </div>
                        <span className={styles.contactArrow} aria-hidden="true">
                          <span className="material-symbols-outlined">
                            arrow_outward
                          </span>
                        </span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Response time card */}
              <div className={styles.responseCard}>
                <div className={styles.responseIcon}>
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h4 className={styles.responseTitle}>Время ответа</h4>
                  <p className={styles.responseText}>
                    Обычно отвечаю в течение 24 часов. В рабочее время — быстрее.
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteMark} aria-hidden="true">
                  <span className="material-symbols-outlined">format_quote</span>
                </div>
                <blockquote className={styles.quoteText}>
                  Дизайн — это не то, как это выглядит.
                  Дизайн — это то, как это работает.
                </blockquote>
                <cite className={styles.quoteAuthor}>— Стив Джобс</cite>
              </div>
            </aside>
          </FadeInWhenVisible>
        </div>
      </section>
    </main>
  );
}
