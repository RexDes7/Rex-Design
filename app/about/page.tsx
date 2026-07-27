'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import SectionLabel from '@/components/SectionLabel';
import ProcessStep from '@/components/ProcessStep';
import StatCard from '@/components/StatCard';
import { FadeInWhenVisible, AnimatedSection } from '@/components/animations';
import { animationConfig } from '@/lib/animations/config';
import {
  skills,
  processSteps,
  stats,
  tools,
  funFacts,
  experience,
} from '@/lib/data';
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
            <SectionLabel number="01">Обо мне</SectionLabel>
          </FadeInWhenVisible>

          <div className={styles.heroGrid}>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  Дизайнер,
                  <br />
                  <span className={styles.accent}>который создаёт осознанно</span>
                </h1>
                <p className={styles.heroLead}>
                  Меня зовут Рафаэль. Я мультидисциплинарный дизайнер из Ульяновска.
                  Шесть лет создаю бренды, веб-интерфейсы и графику, которые
                  работают на бизнес: привлекают клиентов и усиливают сообщение.
                </p>
                <div className={styles.heroMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Локация</span>
                    <span className={styles.metaValue}>Ульяновск, Россия</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Опыт</span>
                    <span className={styles.metaValue}>6 лет, 150+ проектов</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Статус</span>
                    <span className={styles.metaValue}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      Открыт к проектам
                    </span>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible variant="slideUp" delay={0.2}>
              <div className={styles.portraitWrap}>
                <div className={styles.portraitContainer}>
                  {!imageLoaded && (
                    <div className={styles.imageSkeleton} aria-hidden="true" />
                  )}
                  <Image
                    src={avatar}
                    alt="Портрет дизайнера — Апарян Рафаэль"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className={`${styles.portraitImage} ${
                      imageLoaded ? styles.imageLoaded : styles.imageLoading
                    }`}
                    priority
                    onLoad={() => setImageLoaded(true)}
                  />
                  <div className={styles.portraitOverlay}>
                    <span className={styles.overlayName}>Апарян Рафаэль</span>
                    <span className={styles.overlayTitle}>Ведущий дизайнер</span>
                  </div>
                </div>
                {/* TODO: заменить плейсхолдер portrait.svg на реальное фото */}
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STORY */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.storyLayout}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="02">История</SectionLabel>
            </FadeInWhenVisible>
            <div className={styles.storyContent}>
              <FadeInWhenVisible variant="slideUp" delay={0.1}>
                <h2 className={styles.sectionTitle}>
                  Как я пришёл<br />
                  <span className={styles.accent}>в дизайн</span>
                </h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible variant="slideUp" delay={0.2}>
                <div className={styles.storyText}>
                  <p>
                    В 2020 году я начал с простых заказов — логотипы, визитки,
                    полиграфия для малого бизнеса. Каждый проект учил видеть
                    суть задачи: за запросом «нужен логотип» всегда стоит
                    цель — чтобы бренд запомнили.
                  </p>
                  <p>
                    Через пару лет увидел, что клиенты приходят из интернета —
                    нужны сайты и интерфейсы. Начал проектировать сайты,
                    изучать UX, делать интерфейсы. Параллельно расширил стек:
                    инфографика для маркетплейсов, 2D-анимация,
                    самописные сайты под ключ.
                  </p>
                  <p>
                    Сегодня я работаю один. Вы общаетесь напрямую с человеком,
                    который делает ваш проект — от первого наброска до финальных
                    файлов. Полное внимание к каждой детали, без цепочки
                    менеджеров между нами.
                  </p>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* EXPERIENCE TIMELINE */}
      {/* ===================================================== */}
      <section className={`${styles.section} ${styles.sectionSecondary}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="03">Опыт</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Путь<br />
                <span className={styles.accent}>в вехах</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <div className={styles.timeline}>
            {experience.map((item, i) => (
              <FadeInWhenVisible
                key={item.year}
                variant="slideUp"
                delay={i * 0.08}
              >
                <div className={styles.timelineItem}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <div className={styles.timelineLine} aria-hidden="true" />
                  <div className={styles.timelineContent}>
                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                    <p className={styles.timelineText}>{item.description}</p>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="04">Цифры</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                За 6 лет<br />
                <span className={styles.accent}>в цифрах</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <AnimatedSection
            staggerDelay={animationConfig.stagger.cards}
            className={styles.statsGrid}
          >
            {stats.map((stat, i) => (
              <FadeInWhenVisible key={i} variant="slideUp" delay={i * 0.08}>
                <StatCard
                  value={stat.value}
                  label={stat.label}
                  description={stat.description}
                  variant={i === 0 ? 'dark' : 'default'}
                />
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SKILLS */}
      {/* ===================================================== */}
      <section className={`${styles.section} ${styles.sectionSecondary}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="05">Навыки</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Что я<br />
                <span className={styles.accent}>умею</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <AnimatedSection
            staggerDelay={animationConfig.stagger.cards}
            className={styles.skillsGrid}
          >
            {skills.map((skill, i) => (
              <FadeInWhenVisible key={skill.name} variant="slideUp" delay={i * 0.05}>
                <SkillCard skill={skill} />
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* TOOLS */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="06">Инструменты</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Чем<br />
                <span className={styles.accent}>работаю</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible variant="fadeIn">
            <div className={styles.toolsGrid}>
              {tools.map((tool) => (
                <div key={tool.name} className={styles.toolChip}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <span className={styles.toolName}>{tool.name}</span>
                </div>
              ))}
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROCESS */}
      {/* ===================================================== */}
      <section className={`${styles.section} ${styles.sectionSecondary}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="07">Процесс</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Как мы<br />
                <span className={styles.accent}>будем работать</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible variant="fadeIn">
            <div className={styles.processList}>
              {processSteps.map((step, i) => (
                <ProcessStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  duration={step.duration}
                  isLast={i === processSteps.length - 1}
                />
              ))}
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FUN FACTS */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="08">Личное</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Не только<br />
                <span className={styles.accent}>дизайн</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <AnimatedSection
            staggerDelay={animationConfig.stagger.cards}
            className={styles.funFactsGrid}
          >
            {funFacts.map((fact, i) => (
              <FadeInWhenVisible key={fact.title} variant="slideUp" delay={i * 0.08}>
                <article className={styles.factCard}>
                  <div className={styles.factIcon} aria-hidden="true">
                    <span className="material-symbols-outlined">{fact.icon}</span>
                  </div>
                  <h3 className={styles.factTitle}>{fact.title}</h3>
                  <p className={styles.factText}>{fact.description}</p>
                </article>
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA */}
      {/* ===================================================== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <FadeInWhenVisible variant="slideUp">
            <div className={styles.ctaInner}>
              <SectionLabel number="09">Контакты</SectionLabel>
              <h2 className={styles.ctaTitle}>
                Давайте<br />
                <span className={styles.ctaAccent}>поговорим</span>
              </h2>
              <p className={styles.ctaText}>
                Если вам близок мой подход — давайте работать вместе.
                Открыт к новым проектам и интересным задачам.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Начать проект
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </main>
  );
}
