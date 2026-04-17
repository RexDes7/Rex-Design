'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import styles from '@/styles/Contact.module.css';

interface ContactData {
  email: string;
  telegram: string;
  phone?: string;
  behance?: string;
  dribbble?: string;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactData>({
    email: 'hello@archive24.ru',
    telegram: '@archive24',
    phone: '+7 (999) 123-45-67'
  });
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <main id="main-content" className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          ДАВАЙТЕ <br /> <span className={styles.accent}>РАБОТАТЬ</span>
        </h1>
        <p className={styles.heroDescription}>
          Мы выполним ваш проект в лучшем виде из всех возможных. Оставьте заявку ниже и мы свяжемся с вами в кратчайшие сроки.
        </p>
      </section>

      {/* Content Grid - Form and Sidebar */}
      <div className={styles.container}>
        <div className={styles.contentGrid}>
          {/* Form Section - 8 columns */}
          <div className={styles.formSection}>
            <ContactForm />
          </div>

          {/* Sidebar Section - 4 columns */}
          <aside className={styles.sidebar}>
            {/* Contact Information */}
            <div className={styles.contactInfo}>
              <h2 className={styles.sidebarTitle}>КОНТАКТЫ</h2>
              
              {contacts.email && (
                <div className={styles.contactItem}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    mail
                  </span>
                  <div>
                    <p className={styles.contactLabel}>EMAIL</p>
                    <a href={`mailto:${contacts.email}`} className={styles.contactLink}>
                      {contacts.email}
                    </a>
                  </div>
                </div>
              )}

              {contacts.telegram && (
                <div className={styles.contactItem}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    send
                  </span>
                  <div>
                    <p className={styles.contactLabel}>TELEGRAM</p>
                    <a 
                      href={contacts.telegram.startsWith('http') ? contacts.telegram : `https://t.me/${contacts.telegram.replace('@', '')}`} 
                      className={styles.contactLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.numberFont}>
                        {contacts.telegram.startsWith('@') ? contacts.telegram : `@${contacts.telegram}`}
                      </span>
                    </a>
                  </div>
                </div>
              )}

              {contacts.phone && (
                <div className={styles.contactItem}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    call
                  </span>
                  <div>
                    <p className={styles.contactLabel}>ТЕЛЕФОН</p>
                    <a href={`tel:${contacts.phone.replace(/\s/g, '')}`} className={styles.contactLink}>
                      <span className={styles.numberFont}>{contacts.phone}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Workspace Image */}
            <div className={styles.workspaceContainer}>
              {!imageLoaded && (
                <div className={styles.imageSkeleton} aria-hidden="true" />
              )}
              <Image
                src="/images/portrait.svg"
                alt="Рабочее пространство"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`${styles.workspaceImage} ${imageLoaded ? styles.imageLoaded : styles.imageLoading}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Quote Section */}
            <div className={styles.quoteSection}>
              <blockquote className={styles.quote}>
                &ldquo;Дизайн — это не то, как это выглядит. Дизайн — это то, как это работает.&rdquo;
              </blockquote>
              <cite className={styles.quoteAttribution}>— Стив Джобс</cite>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
