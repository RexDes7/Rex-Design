# Implementation Plan: Visual Enhancements

## Overview

Реализация визуальных улучшений для портфолио сайта включает добавление анимаций появления элементов, бегущих строк (marquee), микро-анимаций и других интерактивных эффектов. Все улучшения сохраняют существующий brutalism стиль и текущие анимации, используя Framer Motion для сложных анимаций и CSS для простых эффектов.

## Tasks

- [x] 1. Установить зависимости и создать базовую конфигурацию
  - Установить Framer Motion: `npm install framer-motion`
  - Создать структуру директорий: `lib/animations/`, `components/animations/`, `styles/animations/`
  - _Requirements: 9.1, 9.2_

- [ ] 2. Создать централизованную конфигурацию анимаций
  - [x] 2.1 Создать файл конфигурации анимаций
    - Создать `lib/animations/config.ts` с параметрами durations, easing, stagger, marquee speeds, thresholds
    - Экспортировать типизированный объект animationConfig
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 2.2 Написать property test для централизованной конфигурации
    - **Property 16: Centralized animation configuration**
    - **Validates: Requirements 9.2**

  - [x] 2.3 Создать Framer Motion variants
    - Создать `lib/animations/variants.ts` с fadeInVariants, slideUpVariants, slideLeftVariants, scaleVariants, staggerContainerVariants
    - Использовать параметры из animationConfig
    - _Requirements: 9.2, 9.3_

  - [ ]* 2.4 Написать unit tests для variants
    - Проверить структуру variants соответствует Framer Motion формату
    - Проверить что variants используют значения из config
    - _Requirements: 9.2_

- [ ] 3. Создать систему обработки ошибок и feature detection
  - [x] 3.1 Создать error handling utilities
    - Создать `lib/animations/errorHandling.ts` с функциями getAnimationCapabilities, shouldEnableAnimations, getAnimationComplexity
    - Реализовать проверки для IntersectionObserver, CSS animations, transforms3d, prefers-reduced-motion
    - _Requirements: 3.6, 8.1, 8.4_

  - [ ]* 3.2 Написать unit tests для error handling
    - Тестировать fallback для отсутствующего IntersectionObserver
    - Тестировать определение prefers-reduced-motion
    - Тестировать определение device capabilities
    - _Requirements: 3.6, 8.1, 8.4_

  - [ ]* 3.3 Написать property test для reduced motion
    - **Property 9: Reduced motion accessibility**
    - **Validates: Requirements 3.6, 8.4**

- [x] 4. Checkpoint - Проверить базовую инфраструктуру
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Создать компонент Marquee
  - [x] 5.1 Создать Marquee компонент
    - Создать `components/animations/Marquee.tsx` с интерфейсом MarqueeProps
    - Реализовать дублирование контента для бесшовной анимации
    - Добавить поддержку direction, speed, pauseOnHover
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 5.2 Создать CSS стили для Marquee
    - Создать `styles/animations/Marquee.module.css` с keyframes для анимации
    - Использовать CSS animation с infinite iteration
    - Добавить will-change: transform для оптимизации
    - _Requirements: 2.2, 2.3, 7.1_

  - [ ]* 5.3 Написать unit tests для Marquee
    - Тестировать рендеринг с items
    - Тестировать дублирование контента
    - Тестировать пустой массив items (edge case)
    - _Requirements: 2.1, 2.5_

  - [ ]* 5.4 Написать property test для Marquee seamless animation
    - **Property 3: Marquee seamless animation**
    - **Validates: Requirements 2.2, 2.3, 2.5**

  - [ ]* 5.5 Написать property test для Marquee responsive speed
    - **Property 4: Marquee responsive speed**
    - **Validates: Requirements 2.4**

- [ ] 6. Создать компонент FadeInWhenVisible
  - [x] 6.1 Создать FadeInWhenVisible HOC
    - Создать `components/animations/FadeInWhenVisible.tsx` с интерфейсом FadeInWhenVisibleProps
    - Использовать Framer Motion useInView hook для определения видимости
    - Поддержать варианты: fadeIn, slideUp, slideLeft, scale
    - Добавить параметры delay, duration, threshold, once
    - _Requirements: 3.1, 3.5, 5.1_

  - [ ]* 6.2 Написать unit tests для FadeInWhenVisible
    - Тестировать trigger анимации при intersection
    - Тестировать параметр once (анимация только один раз)
    - Тестировать разные variants
    - _Requirements: 3.1, 3.5_

  - [ ]* 6.3 Написать property test для scroll-triggered animations
    - **Property 5: Scroll-triggered entrance animations**
    - **Validates: Requirements 3.1, 3.5, 5.1, 5.4**

- [ ] 7. Создать компонент AnimatedSection
  - [x] 7.1 Создать AnimatedSection wrapper
    - Создать `components/animations/AnimatedSection.tsx` с интерфейсом AnimatedSectionProps
    - Использовать Framer Motion staggerChildren для последовательной анимации
    - Добавить параметр staggerDelay
    - _Requirements: 3.2, 4.2, 5.2_

  - [ ]* 7.2 Написать unit tests для AnimatedSection
    - Тестировать применение stagger к дочерним элементам
    - Тестировать разные значения staggerDelay
    - _Requirements: 3.2, 5.2_

  - [ ]* 7.3 Написать property test для staggered delays
    - **Property 6: Staggered animation delays**
    - **Validates: Requirements 3.2, 4.2, 5.2**

- [x] 8. Checkpoint - Проверить базовые компоненты анимаций
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Интегрировать анимации в Hero секцию
  - [x] 9.1 Добавить анимации заголовка и кнопок в Hero
    - Обернуть заголовок Hero в FadeInWhenVisible с variant slideUp
    - Обернуть кнопки в AnimatedSection с stagger delay
    - Использовать durations.hero из config (1500ms)
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 9.2 Написать unit tests для Hero анимаций
    - Тестировать наличие анимаций при загрузке
    - Тестировать stagger для кнопок
    - _Requirements: 4.1, 4.2_

  - [ ]* 9.3 Написать property test для animation timing constraints
    - **Property 8: Animation timing constraints**
    - **Validates: Requirements 3.4, 4.3**

- [ ] 10. Интегрировать анимации в Projects секцию
  - [x] 10.1 Обновить ProjectCard с анимациями появления
    - Обернуть каждую ProjectCard в FadeInWhenVisible с variant slideUp
    - Использовать AnimatedSection для stagger эффекта между карточками
    - Добавить hover transform эффект (scale или translate)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 6.1_

  - [ ]* 10.2 Написать unit tests для ProjectCard анимаций
    - Тестировать entrance animation при scroll
    - Тестировать hover эффект
    - _Requirements: 3.1, 6.1_

  - [ ]* 10.3 Написать property test для GPU-accelerated animations
    - **Property 7: GPU-accelerated animations**
    - **Validates: Requirements 3.3, 7.1**

  - [ ]* 10.4 Написать property test для hover micro-animations
    - **Property 11: Hover micro-animations**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

- [ ] 11. Интегрировать анимации в Manifesto секцию
  - [x] 11.1 Обновить ManifestoCard с анимациями появления
    - Обернуть каждую ManifestoCard в FadeInWhenVisible с variant fadeIn (отличается от Projects)
    - Использовать AnimatedSection для stagger эффекта
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 11.2 Написать unit tests для ManifestoCard анимаций
    - Тестировать entrance animation при scroll
    - Тестировать отличие от ProjectCard animations
    - _Requirements: 5.1, 5.3_

  - [ ]* 11.3 Написать property test для visual variety
    - **Property 10: Visual variety in animations**
    - **Validates: Requirements 5.3**

- [ ] 12. Добавить микро-анимации для интерактивных элементов
  - [x] 12.1 Добавить hover эффекты для навигации
    - Добавить CSS transitions для navigation элементов
    - Использовать transform или color change при hover
    - Длительность <= 300ms
    - _Requirements: 6.2, 6.4_

  - [x] 12.2 Добавить анимации для form inputs в Contact секции
    - Добавить focus и blur анимации для input полей
    - Использовать CSS transitions
    - _Requirements: 6.3, 6.4_

  - [ ]* 12.3 Написать unit tests для микро-анимаций
    - Тестировать hover эффекты для навигации
    - Тестировать focus/blur для form inputs
    - _Requirements: 6.2, 6.3_

- [x] 13. Checkpoint - Проверить все интеграции анимаций
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Добавить дополнительные визуальные улучшения
  - [x] 14.1 Реализовать smooth scroll behavior
    - Добавить scroll-behavior: smooth в глобальные стили
    - Или использовать JavaScript smooth scrolling для anchor links
    - _Requirements: 10.2_

  - [x] 14.2 Добавить section transition эффекты
    - Использовать FadeInWhenVisible для major section boundaries
    - Применить fade или slide transitions
    - _Requirements: 10.3_

  - [x] 14.3 Добавить loading animations для изображений
    - Создать skeleton loader или fade-in эффект для изображений
    - Использовать onLoad event для trigger анимации
    - _Requirements: 10.5_

  - [ ]* 14.4 Написать unit tests для дополнительных улучшений
    - Тестировать smooth scroll применяется
    - Тестировать section transitions
    - Тестировать image loading states
    - _Requirements: 10.2, 10.3, 10.5_

  - [ ]* 14.5 Написать property test для smooth scroll
    - **Property 18: Smooth scroll behavior**
    - **Validates: Requirements 10.2**

  - [ ]* 14.6 Написать property test для section transitions
    - **Property 19: Section transition effects**
    - **Validates: Requirements 10.3**

  - [ ]* 14.7 Написать property test для image loading
    - **Property 20: Image loading animations**
    - **Validates: Requirements 10.5**

- [x] 15. Оптимизация производительности
  - [x] 15.1 Реализовать lazy loading для Framer Motion
    - Использовать dynamic import для Framer Motion компонентов
    - Добавить code splitting для animation библиотеки
    - _Requirements: 7.5_

  - [x] 15.2 Добавить mobile optimization
    - Использовать getAnimationComplexity для определения device capabilities
    - Упрощать или отключать анимации на mobile (viewport < 768px)
    - Создан responsive hook useAnimationComplexity с debounce resize listener
    - _Requirements: 8.1, 8.2_

  - [x] 15.3 Написать unit tests для оптимизаций
    - Тестировать lazy loading Framer Motion
    - Тестировать mobile simplification
    - _Requirements: 7.5, 8.2_

  - [ ]* 15.4 Написать property test для animation library code splitting
    - **Property 13: Animation library code splitting**
    - **Validates: Requirements 7.5**

  - [ ]* 15.5 Написать property test для mobile simplification
    - **Property 14: Mobile animation simplification**
    - **Validates: Requirements 8.2**

  - [ ]* 15.6 Написать property test для responsive compatibility
    - **Property 15: Responsive animation compatibility**
    - **Validates: Requirements 8.3**

- [x] 16. Проверка сохранения существующих анимаций
  - [x] 16.1 Верифицировать существующие анимации работают
    - Проверить custom cursor с trail effect
    - Проверить hover эффекты для кнопок
    - Проверить brutalism стиль сохранен (yellow background, black borders, bold fonts)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x]* 16.2 Написать property test для preservation
    - **Property 1: Existing animations preservation**
    - **Validates: Requirements 1.1, 1.2, 1.3**

  - [x]* 16.3 Написать property test для brutalism consistency
    - **Property 2: Brutalism style consistency**
    - **Validates: Requirements 1.4_

- [x] 17. Финальные property tests
  - [x]* 17.1 Написать property test для no setInterval
    - **Property 12: No setInterval for animations**
    - **Validates: Requirements 7.3**

  - [x]* 17.2 Написать property test для configurable components
    - **Property 17: Configurable animation components**
    - **Validates: Requirements 9.3**

- [x] 18. Final checkpoint - Проверить все тесты и функциональность
  - Все 103 animation тестов прошли успешно

## Notes

- Задачи отмеченные `*` являются опциональными и могут быть пропущены для быстрого MVP
- Каждая задача ссылается на конкретные requirements для отслеживаемости
- Checkpoints обеспечивают инкрементальную валидацию
- Property tests проверяют универсальные свойства корректности
- Unit tests проверяют конкретные примеры и edge cases
- Используется TypeScript и React с Framer Motion для анимаций
- Все анимации должны использовать GPU-accelerated свойства (transform, opacity)
- Обязательна поддержка prefers-reduced-motion для accessibility
