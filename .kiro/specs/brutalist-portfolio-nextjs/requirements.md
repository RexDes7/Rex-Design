# Requirements Document

## Introduction

This document defines the requirements for converting an existing HTML brutalist portfolio website into a modern Next.js application. The project involves transforming four HTML pages (Cases_code.html, Form_code.html, Head_code.html, Me_code.html) into a Next.js application structure while maintaining the radical brutalist design aesthetic defined in DESIGN.md. The conversion must replace Tailwind CSS classes with custom CSS that adheres to the "Цифровой Манифест" (Digital Manifesto) design system principles.

## Glossary

- **Next_App**: The Next.js application being created
- **Design_System**: The brutalist design system defined in DESIGN.md ("Цифровой Манифест")
- **HTML_Source**: The existing HTML files (Cases_code.html, Form_code.html, Head_code.html, Me_code.html)
- **CSS_Module**: CSS files implementing the Design_System without Tailwind
- **Navigation_Component**: The shared navigation bar component
- **Footer_Component**: The shared footer component
- **Page_Component**: Individual Next.js page components (Home, Portfolio, About, Contact)
- **Font_Loader**: Next.js font loading mechanism for Plus Jakarta Sans and Space Grotesk
- **Hard_Shadow**: The brutalist shadow effect (4px 4px 0px #000000 or 8px 8px 0px #000000)
- **Primary_Color**: The bold yellow accent color (#ffd709)
- **Border_Style**: The characteristic 3-4px solid black borders

## Requirements

### Requirement 1: Next.js Project Structure

**User Story:** As a developer, I want a properly structured Next.js application, so that I can maintain and extend the portfolio website efficiently.

#### Acceptance Criteria

1. THE Next_App SHALL use Next.js App Router architecture
2. THE Next_App SHALL organize components in a /components directory
3. THE Next_App SHALL organize pages using the /app directory structure
4. THE Next_App SHALL include a /styles directory for CSS_Module files
5. THE Next_App SHALL include a /public directory for static assets
6. THE Next_App SHALL include proper TypeScript configuration files
7. THE Next_App SHALL include a package.json with all required dependencies

### Requirement 2: Design System CSS Implementation

**User Story:** As a designer, I want the brutalist design system implemented in pure CSS, so that the visual aesthetic matches the original design manifesto without Tailwind dependencies.

#### Acceptance Criteria

1. THE CSS_Module SHALL define all color tokens from the Design_System (#ffd709, #f6f6f6, #2d2f2f, #000000)
2. THE CSS_Module SHALL implement Hard_Shadow utilities (4px and 8px variants)
3. THE CSS_Module SHALL enforce zero border radius (border-radius: 0px) globally
4. THE CSS_Module SHALL define typography scales using Plus Jakarta Sans for headlines and Space Grotesk for body text
5. THE CSS_Module SHALL implement Border_Style utilities (3px and 4px solid black)
6. THE CSS_Module SHALL include hover states with Hard_Shadow transitions
7. THE CSS_Module SHALL implement the active state translations (translate-x-1, translate-y-1)
8. THE CSS_Module SHALL define surface container color variants for layering
9. WHEN a button is hovered, THE CSS_Module SHALL apply Hard_Shadow effects
10. THE CSS_Module SHALL implement grayscale filters with hover color transitions for images

### Requirement 3: Font Loading and Typography

**User Story:** As a user, I want fonts to load efficiently and display correctly, so that the brutalist typography hierarchy is preserved.

#### Acceptance Criteria

1. THE Font_Loader SHALL load Plus Jakarta Sans with weights 700, 800, and 900
2. THE Font_Loader SHALL load Space Grotesk with weights 400, 500, and 700
3. THE Font_Loader SHALL use Next.js font optimization features
4. THE CSS_Module SHALL apply Plus Jakarta Sans to headline elements with font-black weight
5. THE CSS_Module SHALL apply Space Grotesk to body and label elements
6. THE CSS_Module SHALL implement negative letter-spacing (-0.05em) for large headlines
7. THE CSS_Module SHALL enforce uppercase transformation for major headings
8. THE CSS_Module SHALL implement proper line-height ratios (0.85 for display, 0.9 for headlines)

### Requirement 4: Navigation Component

**User Story:** As a user, I want consistent navigation across all pages, so that I can easily move between sections of the portfolio.

#### Acceptance Criteria

1. THE Navigation_Component SHALL display the "АРХИВ-24" logo text
2. THE Navigation_Component SHALL include links to Portfolio, About Me, and Contact pages
3. THE Navigation_Component SHALL highlight the active page with 4px underline decoration
4. THE Navigation_Component SHALL include a "ЗАКАЗАТЬ" (Order) button with Primary_Color background
5. THE Navigation_Component SHALL be sticky positioned at the top with z-index 50
6. THE Navigation_Component SHALL have a 4px solid black bottom border
7. WHEN a navigation link is hovered, THE Navigation_Component SHALL apply Primary_Color background
8. THE Navigation_Component SHALL be responsive and collapse to mobile menu on small screens
9. THE Navigation_Component SHALL use font-black weight for all text elements

### Requirement 5: Footer Component

**User Story:** As a user, I want consistent footer information across all pages, so that I can access social links and copyright information.

#### Acceptance Criteria

1. THE Footer_Component SHALL display the "АРХИВ-24" branding
2. THE Footer_Component SHALL include links to Telegram, Behance, Dribbble, and Email
3. THE Footer_Component SHALL display copyright text "© 2024 ЦИФРОВОЙ МАНИФЕСТ. ВСЕ ПРАВА ЗАЩИЩЕНЫ."
4. THE Footer_Component SHALL have a 4px solid black top border
5. THE Footer_Component SHALL use Space Grotesk font for link text
6. WHEN a social link is hovered, THE Footer_Component SHALL apply italic styling and scale-105 transform
7. THE Footer_Component SHALL be responsive with flex layout

### Requirement 6: Home Page Component

**User Story:** As a visitor, I want an impactful home page, so that I immediately understand the brutalist design philosophy.

#### Acceptance Criteria

1. THE Page_Component SHALL display a hero section with "АРХИВ-2024: ЦИФРОВОЙ МАНИФЕСТ" headline
2. THE Page_Component SHALL include a manifesto grid with three principle cards (Брутальность, Честность, Сигнал)
3. THE Page_Component SHALL display a featured projects bento grid with mixed card sizes
4. THE Page_Component SHALL include a contact section with email and phone information
5. THE Page_Component SHALL include a contact form with name, email, and project description fields
6. WHEN a manifesto card is hovered, THE Page_Component SHALL change background to Primary_Color
7. WHEN a project card is hovered, THE Page_Component SHALL apply scale and shadow transforms
8. THE Page_Component SHALL include decorative "24" text element with opacity
9. THE Page_Component SHALL display Material Symbols icons for visual accents

### Requirement 7: Portfolio/Cases Page Component

**User Story:** As a visitor, I want to browse portfolio projects in a grid layout, so that I can see the designer's work.

#### Acceptance Criteria

1. THE Page_Component SHALL display "ЦИФРОВОЙ МАНИФЕСТ" as the main headline with Primary_Color accent
2. THE Page_Component SHALL include a filter bar with project categories (Все Проекты, Веб-Дизайн, Брендинг, Типографика, UI/UX)
3. THE Page_Component SHALL display projects in a responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)
4. THE Page_Component SHALL include at least 5 project cards with images, titles, descriptions, and year badges
5. THE Page_Component SHALL feature one wide project card spanning 2 columns
6. WHEN a project card is hovered, THE Page_Component SHALL apply -translate-y-2, -translate-x-2, and enhanced Hard_Shadow
7. WHEN a project image is hovered, THE Page_Component SHALL transition from grayscale to color
8. THE Page_Component SHALL include a CTA section with "ЕСТЬ ПРОЕКТ ДЛЯ МЕНЯ?" headline
9. THE Page_Component SHALL display project metadata (category, year) with label styling

### Requirement 8: About Me Page Component

**User Story:** As a visitor, I want to learn about the designer, so that I can understand their background and skills.

#### Acceptance Criteria

1. THE Page_Component SHALL display "ДИЗАЙН КАК ОРУЖИЕ МЫСЛИ" as the main headline
2. THE Page_Component SHALL include a large portrait image with grayscale filter and hover color transition
3. THE Page_Component SHALL display biographical text in two paragraphs with different font sizes
4. THE Page_Component SHALL include a skills grid with at least 5 skill cards (Figma, Motion, Research, Webflow, Branding)
5. THE Page_Component SHALL use asymmetric grid layout (7 columns text, 5 columns image on desktop)
6. WHEN a skill card is hovered, THE Page_Component SHALL apply Primary_Color background
7. THE Page_Component SHALL include a CTA section with "ЕСТЬ ИДЕЯ?" prompt
8. THE Page_Component SHALL display a "50+ ПРОЕКТОВ" statistics card
9. THE Page_Component SHALL position the portrait image as sticky on desktop

### Requirement 9: Contact Form Page Component

**User Story:** As a visitor, I want to submit a contact form, so that I can inquire about working with the designer.

#### Acceptance Criteria

1. THE Page_Component SHALL display "ДАВАЙТЕ РАБОТАТЬ" as the main headline with Primary_Color accent
2. THE Page_Component SHALL include form fields for name, email/telegram, budget, and project description
3. THE Page_Component SHALL use 4px bottom borders for all input fields
4. WHEN an input field is focused, THE Page_Component SHALL apply Primary_Color background
5. THE Page_Component SHALL include a budget dropdown with three options (100К-300К, 300К-700К, 700К+)
6. THE Page_Component SHALL display a large "ОТПРАВИТЬ" submit button with black background
7. THE Page_Component SHALL include a sidebar with contact information (email, telegram, phone)
8. THE Page_Component SHALL display a workspace image with grayscale filter
9. THE Page_Component SHALL include a quote section with attribution
10. THE Page_Component SHALL use asymmetric grid layout (8 columns form, 4 columns sidebar on desktop)

### Requirement 10: Responsive Design Implementation

**User Story:** As a mobile user, I want the website to work on my device, so that I can view the portfolio on any screen size.

#### Acceptance Criteria

1. THE Next_App SHALL implement mobile-first responsive breakpoints (640px, 768px, 1024px, 1280px)
2. THE Next_App SHALL stack grid layouts vertically on mobile devices
3. THE Next_App SHALL adjust font sizes proportionally for mobile (reduce by 30-50%)
4. THE Next_App SHALL hide desktop navigation and show mobile menu button on small screens
5. THE Next_App SHALL adjust padding and spacing for mobile viewports
6. THE Next_App SHALL maintain Border_Style and Hard_Shadow effects on all screen sizes
7. THE Next_App SHALL ensure touch targets are at least 44px for mobile interaction
8. THE Next_App SHALL preserve the brutalist aesthetic across all breakpoints

### Requirement 11: Image Optimization and Assets

**User Story:** As a developer, I want optimized images, so that the website loads quickly while maintaining visual quality.

#### Acceptance Criteria

1. THE Next_App SHALL use Next.js Image component for all images
2. THE Next_App SHALL implement lazy loading for below-the-fold images
3. THE Next_App SHALL provide appropriate alt text for all images
4. THE Next_App SHALL apply grayscale filters via CSS rather than image processing
5. THE Next_App SHALL include Material Symbols Outlined icon font
6. THE Next_App SHALL configure proper image sizes and srcset attributes
7. THE Next_App SHALL store static images in the /public directory

### Requirement 12: Interactive States and Animations

**User Story:** As a user, I want interactive feedback, so that I know when elements are clickable and responsive.

#### Acceptance Criteria

1. THE Next_App SHALL implement hover states for all interactive elements
2. THE Next_App SHALL apply Hard_Shadow transitions with 200-300ms duration
3. THE Next_App SHALL implement active states with translate transforms (1px x and y)
4. THE Next_App SHALL apply scale transforms (scale-105, scale-110) on hover for specific elements
5. THE Next_App SHALL transition grayscale filters to color on image hover (500ms duration)
6. THE Next_App SHALL implement smooth color transitions for background changes
7. THE Next_App SHALL remove shadows on active button press to simulate depth
8. THE Next_App SHALL maintain 60fps performance during animations

### Requirement 13: Accessibility and Semantic HTML

**User Story:** As a user with assistive technology, I want accessible markup, so that I can navigate and understand the website content.

#### Acceptance Criteria

1. THE Next_App SHALL use semantic HTML5 elements (header, nav, main, section, article, footer)
2. THE Next_App SHALL include proper heading hierarchy (h1, h2, h3)
3. THE Next_App SHALL provide aria-labels for icon-only buttons
4. THE Next_App SHALL ensure color contrast ratios meet WCAG AA standards
5. THE Next_App SHALL include focus visible states for keyboard navigation
6. THE Next_App SHALL provide skip-to-content links for keyboard users
7. THE Next_App SHALL use proper form labels associated with inputs
8. THE Next_App SHALL include lang attribute on html element

### Requirement 14: Performance and SEO

**User Story:** As a website owner, I want good performance and SEO, so that the portfolio ranks well and loads quickly.

#### Acceptance Criteria

1. THE Next_App SHALL implement Next.js metadata API for page titles and descriptions
2. THE Next_App SHALL include Open Graph tags for social media sharing
3. THE Next_App SHALL generate a sitemap.xml file
4. THE Next_App SHALL implement proper heading structure for SEO
5. THE Next_App SHALL achieve Lighthouse performance score above 90
6. THE Next_App SHALL implement font preloading for critical fonts
7. THE Next_App SHALL minimize CSS bundle size through modular imports
8. THE Next_App SHALL use static generation where possible for optimal performance
