'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import { skills } from '@/lib/data';
import styles from '@/styles/About.module.css';

export default function AboutPage() {
  const [avatar, setAvatar] = useState('/images/portrait.svg');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        const data = await response.json();
        if (data.success && data.data.avatar) {
          setAvatar(data.data.avatar);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <main id="main-content" className={styles.main}>
      <div className={styles.container}>
        {/* Hero Section: Asymmetric Bio & Portrait */}
        <section className={styles.contentGrid}>
          {/* Biography Section - 7 columns */}
          <div className={styles.biographySection}>
            <h1 className={styles.heroTitle}>
              ДИЗАЙН <br />
              <span className={styles.accentText}>КАК ОРУЖИЕ</span> <br />
              МЫСЛИ.
            </h1>
            <div className={styles.biographyContent}>
              <p className={styles.biographyTextLarge}>
                МЕНЯ ЗОВУТ РАФАЭЛЬ. Я — МУЛЬТИДИСЦИПЛИНАРНЫЙ ДИЗАЙНЕР, КОТОРЫЙ ВЕРИТ В ПРАГМАТИЧНУЮ ЭСТЕТИКУ И ФУНКЦИОНАЛЬНУЮ ЧЕСТНОСТЬ. МОЯ РАБОТА — ЭТО СОЗДАТЬ ПРОДУКТ, КОТОРЫЙ ТОЧНО БУДЕТ В РЯДАХ ПЕРВОЙ КАТЕГОРИИ.
              </p>
              <p className={styles.biographyText}>
                С 2020 года, я разрабатываю визуал, который не просто выглядит красиво, но и правильно работает в маркетинговом поле. Не важно это небольшой баннер или большой проект, подход к ним одинаково серьезный. Множество довольных клиентов и десятки компаний с которыми я работал, в число которых можете войти и ВЫ!
              </p>
            </div>
          </div>

          {/* Portrait Section - 5 columns */}
          <div className={styles.portraitSection}>
            <div className={styles.portraitWrapper}>
              <div className={styles.portraitContainer}>
                {!imageLoaded && (
                  <div className={styles.imageSkeleton} aria-hidden="true" />
                )}
                <Image
                  src={avatar}
                  alt="Портрет дизайнера"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  className={`${styles.portraitImage} ${imageLoaded ? styles.imageLoaded : styles.imageLoading}`}
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
                <div className={styles.portraitOverlay}>
                  <div className={styles.overlayName}>АПАРЯН РАФАЭЛЬ</div>
                  <div className={styles.overlayTitle}>Ведущий дизайнер</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.skillsSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.iconBox}>
              <span className="material-symbols-outlined" aria-hidden="true">
                bolt
              </span>
            </span>
            АРСЕНАЛ НАВЫКОВ
          </h2>
          <div className={styles.skillsGrid}>
            {skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        {/* CTA Section - Bento Grid */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaGrid}>
            <div className={styles.ctaCard}>
              <div>
                <h3 className={styles.ctaTitle}>ЕСТЬ ИДЕЯ?</h3>
                <p className={styles.ctaDescription}>
                  ДАВАЙТЕ ПРЕВРАТИМ ЕЕ В ВИЗУАЛЬНЫЙ МАНИФЕСТ, КОТОРЫЙ НЕВОЗМОЖНО ИГНОРИРОВАТЬ.
                </p>
              </div>
              <div className={styles.ctaButtons}>
                <Link href="/contact" className={`${styles.ctaButton} ${styles.primary}`}>
                  ОБСУДИТЬ ПРОЕКТ
                </Link>
                <button className={`${styles.ctaButton} ${styles.secondary}`}>
                  СКАЧАТЬ CV
                </button>
              </div>
            </div>
            <div className={styles.statsCard}>
              <p className={styles.statsNumber}>50+</p>
              <p className={styles.statsLabel}>ПРОЕКТОВ</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
