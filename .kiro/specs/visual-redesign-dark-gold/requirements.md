# Requirements Document

## Introduction

Данный документ описывает требования к визуальному редизайну сайта-портфолио REX DESIGN. Редизайн направлен на создание премиального темного интерфейса с золотыми акцентами при сохранении всей существующей функциональности, структуры компонентов и адаптивности. Изменения касаются исключительно визуального оформления: цветовой схемы, типографики, spacing и стилей UI-элементов.

## Glossary

- **Portfolio_Site**: Веб-приложение на Next.js с App Router, включающее страницы главную, about, cases, contact и admin панель
- **Visual_Layer**: CSS стили, включая globals.css, CSS Modules компонентов и inline стили
- **Component_Structure**: React компоненты и их иерархия (Navigation, Footer, ProjectCard, ContactForm, CustomCursor и др.)
- **Functional_Layer**: JavaScript/TypeScript логика, API routes, обработчики событий, анимации Framer Motion
- **Dark_Theme**: Цветовая схема с черным фоном (#000000 или близкий оттенок)
- **Gold_Accent**: Золотой цвет (#D4AF37 или подобный) для акцентных элементов
- **Typography_System**: Система шрифтов, включая семейства, размеры, веса и межстрочные интервалы
- **Spacing_System**: Система отступов (margins, paddings) и промежутков между элементами
- **UI_Element**: Интерактивные элементы интерфейса (кнопки, формы, карточки, модальные окна)
- **Responsive_Behavior**: Адаптивное поведение для различных размеров экранов (mobile, tablet, desktop)
- **Animation_Style**: Визуальные характеристики анимаций (timing, easing), не затрагивающие их логику

## Requirements

### Requirement 1: Темная цветовая схема

**User Story:** Как пользователь, я хочу видеть сайт в темной теме с черным фоном, чтобы получить премиальное визуальное впечатление.

#### Acceptance Criteria

1. THE Visual_Layer SHALL использовать черный (#000000) или близкий темный оттенок (#0a0a0a, #121212) в качестве основного цвета фона
2. THE Visual_Layer SHALL использовать белый (#FFFFFF) или светло-серый (#F5F5F5, #E0E0E0) цвет для основного текста
3. THE Visual_Layer SHALL обеспечивать контрастность текста и фона не менее 7:1 для соответствия WCAG AAA
4. WHEN пользователь просматривает любую страницу Portfolio_Site, THE Visual_Layer SHALL применять темную цветовую схему ко всем секциям
5. THE Visual_Layer SHALL использовать темно-серые оттенки (#1a1a1a, #2a2a2a) для вторичных фоновых элементов и карточек

### Requirement 2: Золотые акценты

**User Story:** Как пользователь, я хочу видеть золотые акценты на ключевых элементах, чтобы ощутить премиальность дизайна.

#### Acceptance Criteria

1. THE Visual_Layer SHALL использовать золотой цвет (#D4AF37 или подобный: #C5A572, #B8860B) для акцентных элементов
2. THE Visual_Layer SHALL применять золотой цвет к primary кнопкам (CTA buttons)
3. THE Visual_Layer SHALL применять золотой цвет к активным состояниям навигационных ссылок
4. THE Visual_Layer SHALL применять золотой цвет к hover состояниям интерактивных элементов
5. THE Visual_Layer SHALL применять золотой цвет к декоративным элементам и разделителям
6. THE Visual_Layer SHALL использовать золотой цвет для иконок и акцентного текста

### Requirement 3: Типографическая система

**User Story:** Как пользователь, я хочу видеть современную типографику с крупными заголовками, чтобы контент был легко читаемым и визуально привлекательным.

#### Acceptance Criteria

1. THE Typography_System SHALL использовать sans-serif шрифты для всего текста (например: Inter, Helvetica Neue, Arial)
2. THE Typography_System SHALL устанавливать размер заголовка h1 не менее 48px на desktop и не менее 32px на mobile
3. THE Typography_System SHALL устанавливать размер заголовка h2 не менее 36px на desktop и не менее 28px на mobile
4. THE Typography_System SHALL использовать font-weight 700 или выше для заголовков h1 и h2
5. THE Typography_System SHALL устанавливать размер основного текста 16px-18px с line-height 1.6-1.8
6. THE Typography_System SHALL использовать uppercase трансформацию для заголовков секций и кнопок
7. THE Typography_System SHALL устанавливать letter-spacing 0.05em-0.1em для uppercase текста

### Requirement 4: Стили кнопок

**User Story:** Как пользователь, я хочу видеть стилизованные кнопки, соответствующие новому дизайну, чтобы интерфейс выглядел целостно.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять золотой фон к primary кнопкам с черным текстом
2. THE Visual_Layer SHALL применять черную рамку и прозрачный фон к secondary кнопкам с белым текстом
3. WHEN пользователь наводит курсор на primary кнопку, THE Visual_Layer SHALL инвертировать цвета (черный фон, золотой текст)
4. WHEN пользователь наводит курсор на secondary кнопку, THE Visual_Layer SHALL применять золотую рамку
5. THE Visual_Layer SHALL устанавливать padding кнопок 16px-24px по вертикали и 32px-48px по горизонтали
6. THE Visual_Layer SHALL использовать uppercase текст для всех кнопок
7. THE Visual_Layer SHALL применять transition длительностью 0.3s для hover эффектов кнопок

### Requirement 5: Стили карточек проектов

**User Story:** Как пользователь, я хочу видеть карточки проектов в новом стиле, чтобы портфолио выглядело современно и премиально.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять темно-серый фон (#1a1a1a или подобный) к карточкам проектов
2. THE Visual_Layer SHALL применять тонкую золотую рамку (1px) к карточкам проектов
3. WHEN пользователь наводит курсор на карточку проекта, THE Visual_Layer SHALL увеличивать яркость изображения на 10-20%
4. WHEN пользователь наводит курсор на карточку проекта, THE Visual_Layer SHALL применять золотое свечение (box-shadow) к рамке
5. THE Visual_Layer SHALL применять белый цвет к заголовкам проектов
6. THE Visual_Layer SHALL применять светло-серый цвет (#B0B0B0) к описаниям проектов
7. THE Visual_Layer SHALL применять золотой фон к badge элементам (категория, год) с черным текстом

### Requirement 6: Стили форм

**User Story:** Как пользователь, я хочу видеть стилизованные формы, соответствующие темной теме, чтобы комфортно заполнять контактные данные.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять темно-серый фон (#1a1a1a) к полям ввода (input, textarea)
2. THE Visual_Layer SHALL применять светло-серую рамку (#3a3a3a) к полям ввода
3. WHEN поле ввода находится в фокусе, THE Visual_Layer SHALL применять золотую рамку
4. THE Visual_Layer SHALL применять белый цвет к тексту в полях ввода
5. THE Visual_Layer SHALL применять светло-серый цвет (#808080) к placeholder тексту
6. THE Visual_Layer SHALL устанавливать padding полей ввода 12px-16px
7. THE Visual_Layer SHALL применять золотой фон к submit кнопке формы

### Requirement 7: Навигация

**User Story:** Как пользователь, я хочу видеть навигацию в новом стиле, чтобы легко перемещаться по сайту.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять черный или темно-серый фон к навигационной панели
2. THE Visual_Layer SHALL применять белый цвет к логотипу "REX"
3. THE Visual_Layer SHALL применять светло-серый цвет (#B0B0B0) к неактивным навигационным ссылкам
4. WHEN навигационная ссылка активна, THE Visual_Layer SHALL применять золотой цвет
5. WHEN пользователь наводит курсор на навигационную ссылку, THE Visual_Layer SHALL применять золотой цвет
6. THE Visual_Layer SHALL применять золотой фон к CTA кнопке "ЗАКАЗАТЬ" в навигации
7. THE Visual_Layer SHALL сохранять функциональность мобильного меню (hamburger) без изменений

### Requirement 8: Footer

**User Story:** Как пользователь, я хочу видеть footer в новом стиле, чтобы дизайн был целостным до конца страницы.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять черный или темно-серый фон к footer
2. THE Visual_Layer SHALL применять белый цвет к логотипу "REX" в footer
3. THE Visual_Layer SHALL применять светло-серый цвет к ссылкам социальных сетей
4. WHEN пользователь наводит курсор на ссылку социальной сети, THE Visual_Layer SHALL применять золотой цвет
5. THE Visual_Layer SHALL применять светло-серый цвет (#808080) к тексту copyright
6. THE Visual_Layer SHALL применять золотую линию-разделитель (1px) над footer секцией

### Requirement 9: Модальные окна

**User Story:** Как пользователь, я хочу видеть модальные окна в новом стиле, чтобы просмотр деталей проектов был комфортным.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять темно-серый фон (#1a1a1a) к модальным окнам
2. THE Visual_Layer SHALL применять золотую рамку (2px) к модальным окнам
3. THE Visual_Layer SHALL применять полупрозрачный черный overlay (rgba(0,0,0,0.8)) к фону за модальным окном
4. THE Visual_Layer SHALL применять белый цвет к заголовкам в модальных окнах
5. THE Visual_Layer SHALL применять светло-серый цвет к тексту в модальных окнах
6. THE Visual_Layer SHALL применять золотой цвет к кнопке закрытия модального окна
7. WHEN пользователь наводит курсор на кнопку закрытия, THE Visual_Layer SHALL увеличивать яркость золотого цвета

### Requirement 10: Spacing и Layout

**User Story:** Как пользователь, я хочу видеть сбалансированные отступы и промежутки, чтобы контент был легко воспринимаемым.

#### Acceptance Criteria

1. THE Spacing_System SHALL увеличивать вертикальные отступы между секциями до 80px-120px на desktop
2. THE Spacing_System SHALL увеличивать вертикальные отступы между секциями до 60px-80px на mobile
3. THE Spacing_System SHALL устанавливать внутренние отступы секций (padding) 40px-60px на desktop
4. THE Spacing_System SHALL устанавливать внутренние отступы секций (padding) 24px-32px на mobile
5. THE Spacing_System SHALL устанавливать промежутки между карточками проектов 24px-32px
6. THE Spacing_System SHALL сохранять существующую grid структуру компонентов
7. THE Spacing_System SHALL сохранять существующие breakpoints для адаптивности

### Requirement 11: Анимации

**User Story:** Как пользователь, я хочу видеть плавные анимации, соответствующие новому стилю, чтобы взаимодействие с сайтом было приятным.

#### Acceptance Criteria

1. THE Animation_Style SHALL сохранять существующие Framer Motion анимации (fadeIn, slideUp)
2. THE Animation_Style SHALL устанавливать timing функцию ease-in-out для всех transition эффектов
3. THE Animation_Style SHALL устанавливать длительность hover transition 0.3s для UI_Element
4. THE Animation_Style SHALL устанавливать длительность color transition 0.2s для текстовых элементов
5. WHEN пользователь наводит курсор на интерактивный элемент, THE Animation_Style SHALL применять плавный переход к золотому цвету
6. THE Animation_Style SHALL сохранять существующие stagger delays для анимации списков

### Requirement 12: Декоративные элементы

**User Story:** Как пользователь, я хочу видеть декоративные элементы в новом стиле, чтобы дизайн был визуально богатым.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять золотой цвет к декоративному тексту "24" на hero секции
2. THE Visual_Layer SHALL применять золотой цвет к иконкам Material Symbols
3. THE Visual_Layer SHALL применять тонкие золотые линии-разделители (1px) между секциями
4. THE Visual_Layer SHALL применять золотое свечение (box-shadow) к акцентным элементам при hover
5. THE Visual_Layer SHALL сохранять существующие декоративные элементы без изменения их позиционирования

### Requirement 13: Адаптивность

**User Story:** Как пользователь, я хочу видеть корректное отображение нового дизайна на всех устройствах, чтобы пользоваться сайтом с любого экрана.

#### Acceptance Criteria

1. THE Responsive_Behavior SHALL сохранять существующие media queries без изменений
2. THE Responsive_Behavior SHALL сохранять существующие breakpoints (mobile: <768px, tablet: 768px-1024px, desktop: >1024px)
3. THE Responsive_Behavior SHALL применять новую цветовую схему на всех размерах экранов
4. THE Responsive_Behavior SHALL применять адаптивные размеры типографики на всех размерах экранов
5. THE Responsive_Behavior SHALL сохранять функциональность мобильного меню
6. THE Responsive_Behavior SHALL сохранять адаптивную grid структуру для карточек проектов

### Requirement 14: Сохранение функциональности

**User Story:** Как пользователь, я хочу, чтобы вся функциональность сайта работала без изменений, чтобы продолжать пользоваться всеми возможностями.

#### Acceptance Criteria

1. THE Functional_Layer SHALL сохранять всю JavaScript/TypeScript логику без изменений
2. THE Functional_Layer SHALL сохранять все API routes без изменений
3. THE Functional_Layer SHALL сохранять все обработчики событий (onClick, onSubmit, onChange) без изменений
4. THE Functional_Layer SHALL сохранять логику Framer Motion анимаций без изменений
5. THE Functional_Layer SHALL сохранять функциональность форм (валидация, отправка) без изменений
6. THE Functional_Layer SHALL сохранять функциональность модальных окон (открытие, закрытие) без изменений
7. THE Functional_Layer SHALL сохранять функциональность admin панели без изменений
8. THE Functional_Layer SHALL сохранять функциональность CustomCursor без изменений

### Requirement 15: Структура компонентов

**User Story:** Как разработчик, я хочу сохранить структуру компонентов, чтобы не нарушить архитектуру приложения.

#### Acceptance Criteria

1. THE Component_Structure SHALL сохранять иерархию React компонентов без изменений
2. THE Component_Structure SHALL сохранять props интерфейсы компонентов без изменений
3. THE Component_Structure SHALL сохранять JSX разметку компонентов без изменений
4. THE Component_Structure SHALL изменять только CSS Modules и inline стили
5. THE Component_Structure SHALL сохранять существующие className привязки
6. THE Component_Structure SHALL сохранять существующую структуру папок и файлов

### Requirement 16: Admin панель

**User Story:** Как администратор, я хочу видеть admin панель в новом стиле, чтобы управление контентом было комфортным.

#### Acceptance Criteria

1. THE Visual_Layer SHALL применять темную цветовую схему к admin панели
2. THE Visual_Layer SHALL применять золотые акценты к активным элементам sidebar
3. THE Visual_Layer SHALL применять темно-серый фон к таблицам и формам в admin панели
4. THE Visual_Layer SHALL применять золотой цвет к primary кнопкам в admin панели
5. THE Visual_Layer SHALL сохранять функциональность всех admin компонентов (ContentEditor, ProjectForm, ImageUploader и др.)
6. THE Visual_Layer SHALL применять белый цвет к тексту в admin панели

### Requirement 17: Accessibility

**User Story:** Как пользователь с ограниченными возможностями, я хочу, чтобы сайт оставался доступным, чтобы пользоваться всеми функциями.

#### Acceptance Criteria

1. THE Visual_Layer SHALL обеспечивать контрастность текста и фона не менее 7:1 для основного текста
2. THE Visual_Layer SHALL обеспечивать контрастность текста и фона не менее 4.5:1 для крупного текста (18px+)
3. THE Visual_Layer SHALL обеспечивать контрастность золотых акцентов на черном фоне не менее 4.5:1
4. THE Visual_Layer SHALL сохранять все aria-label атрибуты без изменений
5. THE Visual_Layer SHALL сохранять все aria-hidden атрибуты без изменений
6. THE Visual_Layer SHALL сохранять focus states для интерактивных элементов с золотым outline

### Requirement 18: Performance

**User Story:** Как пользователь, я хочу, чтобы сайт загружался быстро, чтобы не ждать отображения контента.

#### Acceptance Criteria

1. THE Visual_Layer SHALL не увеличивать размер CSS файлов более чем на 20%
2. THE Visual_Layer SHALL использовать CSS переменные для цветовой схемы для упрощения поддержки
3. THE Visual_Layer SHALL не добавлять дополнительные внешние шрифты, если текущие подходят
4. THE Visual_Layer SHALL оптимизировать CSS селекторы для минимизации специфичности
5. THE Visual_Layer SHALL использовать CSS transitions вместо JavaScript анимаций где возможно

### Requirement 19: Browser compatibility

**User Story:** Как пользователь, я хочу видеть корректное отображение дизайна в разных браузерах, чтобы пользоваться сайтом независимо от выбора браузера.

#### Acceptance Criteria

1. THE Visual_Layer SHALL корректно отображаться в Chrome последних двух версий
2. THE Visual_Layer SHALL корректно отображаться в Firefox последних двух версий
3. THE Visual_Layer SHALL корректно отображаться в Safari последних двух версий
4. THE Visual_Layer SHALL корректно отображаться в Edge последних двух версий
5. THE Visual_Layer SHALL использовать CSS fallbacks для свойств с ограниченной поддержкой

### Requirement 20: Документация изменений

**User Story:** Как разработчик, я хочу иметь документацию изменений, чтобы понимать, что было изменено в визуальном слое.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL содержать файл VISUAL_REDESIGN.md с описанием изменений
2. THE VISUAL_REDESIGN.md SHALL содержать список измененных CSS файлов
3. THE VISUAL_REDESIGN.md SHALL содержать цветовую палитру (hex коды) темной темы
4. THE VISUAL_REDESIGN.md SHALL содержать типографическую систему (шрифты, размеры, веса)
5. THE VISUAL_REDESIGN.md SHALL содержать инструкции по дальнейшей кастомизации стилей
