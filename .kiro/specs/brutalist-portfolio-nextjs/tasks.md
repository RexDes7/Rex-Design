# Implementation Plan: Brutalist Portfolio Next.js Conversion

## Overview

This implementation plan converts an existing HTML brutalist portfolio into a modern Next.js 14+ application with TypeScript and CSS Modules. The project maintains the radical "Цифровой Манифест" (Digital Manifesto) brutalist design aesthetic while leveraging Next.js features for performance and maintainability.

## Tasks

- [x] 1. Initialize Next.js project and configure TypeScript
  - Create Next.js 14+ project with App Router
  - Configure TypeScript with strict mode
  - Set up project directory structure (/app, /components, /styles, /public, /lib, /types)
  - Install dependencies (React, Next.js, TypeScript)
  - Configure next.config.js for image optimization
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 2. Implement CSS design system and tokens
  - [x] 2.1 Create design tokens in styles/tokens.css
    - Define color variables (--color-primary: #ffd709, surface colors, black/white)
    - Define typography variables (font families, sizes, weights, line-heights)
    - Define spacing scale (--spacing-1 through --spacing-16)
    - Define border variables (--border-width-thin: 3px, --border-width-thick: 4px)
    - Define shadow variables (--shadow-hard-small: 4px 4px 0px #000000, --shadow-hard-large: 8px 8px 0px #000000)
    - Define transition variables (--transition-fast: 200ms, --transition-medium: 300ms, --transition-slow: 500ms)
    - Define responsive breakpoints (--breakpoint-sm: 640px, --breakpoint-md: 768px, --breakpoint-lg: 1024px, --breakpoint-xl: 1280px)
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.8_

  - [x] 2.2 Create global styles in styles/globals.css
    - Import design tokens
    - Implement CSS reset and normalize
    - Set global border-radius: 0px
    - Configure box-sizing: border-box
    - Set up base typography styles
    - Define utility classes for brutalist effects
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ]* 2.3 Write property test for button hover shadow
    - **Property 1: Button Hover Shadow Application**
    - **Validates: Requirements 2.9**

- [x] 3. Configure font loading and typography
  - [x] 3.1 Set up Next.js font loading in app/layout.tsx
    - Import Plus Jakarta Sans (weights: 700, 800, 900, subsets: latin + cyrillic)
    - Import Space Grotesk (weights: 400, 500, 700, subsets: latin + cyrillic)
    - Configure font variables (--font-headline, --font-body)
    - Set display: swap for optimal loading
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.2 Implement typography CSS classes
    - Create headline classes with Plus Jakarta Sans and font-black weight
    - Create body text classes with Space Grotesk
    - Implement negative letter-spacing (-0.05em) for large headlines
    - Set up uppercase transformation for major headings
    - Configure line-height ratios (0.85 for display, 0.9 for headlines)
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Create TypeScript type definitions
  - Define Project interface in types/project.ts (id, title, description, category, year, image, imageAlt, wide)
  - Define Skill interface in types/skill.ts (name, icon)
  - Define ManifestoPrinciple interface (title, description, icon)
  - Define ContactFormData interface (name, contact, budget, description)
  - _Requirements: 1.6_

- [x] 5. Create static data file
  - Create lib/data.ts with exported arrays
  - Define projects array with at least 6 project objects
  - Define skills array with at least 5 skill objects
  - Define manifestoPrinciples array with 3 principle objects (Брутальность, Честность, Сигнал)
  - _Requirements: 6.2, 7.4, 8.4_

- [x] 6. Implement Navigation component
  - [x] 6.1 Create Navigation component with TypeScript
    - Create components/Navigation.tsx with NavigationProps interface
    - Implement sticky positioning with z-index 50
    - Add "АРХИВ-24" logo text with font-black weight
    - Add navigation links (Portfolio, About Me, Contact)
    - Add "ЗАКАЗАТЬ" CTA button with primary color background
    - Add 4px solid black bottom border
    - Use Next.js Link component for routing
    - Use usePathname() hook for active route detection
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6, 4.9_

  - [x] 6.2 Create Navigation CSS module
    - Create styles/Navigation.module.css
    - Implement sticky header styles
    - Style navigation links with hover states (primary color background)
    - Style active link with 4px underline decoration
    - Implement responsive mobile menu (collapse at 768px)
    - Style CTA button with primary color and hover effects
    - _Requirements: 4.3, 4.7, 4.8_

  - [ ]* 6.3 Write property test for active page navigation highlight
    - **Property 3: Active Page Navigation Highlight**
    - **Validates: Requirements 4.3**

  - [ ]* 6.4 Write property test for navigation link hover background
    - **Property 4: Navigation Link Hover Background**
    - **Validates: Requirements 4.7**

- [x] 7. Implement Footer component
  - [x] 7.1 Create Footer component with TypeScript
    - Create components/Footer.tsx
    - Add "АРХИВ-24" branding text
    - Add social media links (Telegram, Behance, Dribbble, Email)
    - Add copyright text "© 2024 ЦИФРОВОЙ МАНИФЕСТ. ВСЕ ПРАВА ЗАЩИЩЕНЫ."
    - Add 4px solid black top border
    - Use Space Grotesk font for link text
    - Implement responsive flex layout
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_

  - [x] 7.2 Create Footer CSS module
    - Create styles/Footer.module.css
    - Style social links with hover states (italic + scale-105 transform)
    - Implement responsive layout adjustments
    - _Requirements: 5.6_

  - [ ]* 7.3 Write property test for social link hover transform
    - **Property 5: Social Link Hover Transform**
    - **Validates: Requirements 5.6**

- [x] 8. Checkpoint - Verify layout components
  - Ensure Navigation and Footer render correctly
  - Test responsive behavior at all breakpoints
  - Verify font loading and typography styles
  - Ask the user if questions arise

- [x] 9. Implement ProjectCard component
  - [x] 9.1 Create ProjectCard component with TypeScript
    - Create components/ProjectCard.tsx with ProjectCardProps interface
    - Use Next.js Image component for project image
    - Display title, description, category, and year
    - Implement grayscale filter on image (grayscale(100%))
    - Add category and year badges with label styling
    - Handle wide variant for 2-column spanning
    - _Requirements: 7.4, 7.9_

  - [x] 9.2 Create ProjectCard CSS module
    - Create styles/ProjectCard.module.css
    - Implement hover effects (scale, hard shadow, translate)
    - Implement image grayscale to color transition (500ms)
    - Style category and year badges
    - Implement responsive grid spanning for wide variant
    - _Requirements: 7.6, 7.7_

  - [ ]* 9.3 Write property test for image grayscale transition
    - **Property 2: Image Grayscale Transition**
    - **Validates: Requirements 2.10, 7.7, 12.5**

  - [ ]* 9.4 Write property test for project card hover transform
    - **Property 7: Project Card Hover Transform**
    - **Validates: Requirements 6.7, 7.6**

- [x] 10. Implement SkillCard component
  - [x] 10.1 Create SkillCard component with TypeScript
    - Create components/SkillCard.tsx with SkillCardProps interface
    - Display skill name in uppercase
    - Include Material Symbols icon if provided
    - Add 3px solid black border
    - _Requirements: 8.4_

  - [x] 10.2 Create SkillCard CSS module
    - Create styles/SkillCard.module.css
    - Implement hover state with primary color background
    - Style uppercase text
    - _Requirements: 8.6_

  - [ ]* 10.3 Write property test for skill card hover background
    - **Property 8: Skill Card Hover Background**
    - **Validates: Requirements 8.6**

- [x] 11. Implement ManifestoCard component
  - [x] 11.1 Create ManifestoCard component with TypeScript
    - Create components/ManifestoCard.tsx with ManifestoCardProps interface
    - Display principle title and description
    - Include Material Symbols icon
    - Add hard shadow effects
    - _Requirements: 6.2_

  - [x] 11.2 Create ManifestoCard CSS module
    - Create styles/ManifestoCard.module.css
    - Implement hover state with primary color background transition
    - Style hard shadow effects
    - _Requirements: 6.6_

  - [ ]* 11.3 Write property test for manifesto card hover background
    - **Property 6: Manifesto Card Hover Background**
    - **Validates: Requirements 6.6**

- [x] 12. Implement ContactForm component
  - [x] 12.1 Create ContactForm component with TypeScript
    - Create components/ContactForm.tsx with ContactFormProps interface
    - Add form fields (name, contact, budget dropdown, description textarea)
    - Implement client-side validation (required fields, email format)
    - Add 4px bottom borders on all inputs
    - Add large "ОТПРАВИТЬ" submit button with black background
    - Use React state for form data and validation errors
    - _Requirements: 6.5, 9.2, 9.3, 9.5, 9.6_

  - [x] 12.2 Create ContactForm CSS module
    - Create styles/ContactForm.module.css
    - Implement focus states with primary color background
    - Style budget dropdown
    - Style submit button with hover and active states
    - Display validation error messages
    - _Requirements: 9.4_

  - [ ]* 12.3 Write property test for input focus background
    - **Property 9: Input Focus Background**
    - **Validates: Requirements 9.4**

  - [ ]* 12.4 Write unit tests for ContactForm validation
    - Test required field validation
    - Test email format validation
    - Test form submission prevention with invalid data
    - _Requirements: 9.2_

- [x] 13. Checkpoint - Verify all components
  - Ensure all components render with correct props
  - Test hover and focus states
  - Verify responsive behavior
  - Ask the user if questions arise

- [x] 14. Implement Home page
  - [x] 14.1 Create Home page component
    - Create app/page.tsx
    - Add hero section with "АРХИВ-2024: ЦИФРОВОЙ МАНИФЕСТ" headline
    - Add manifesto grid with three ManifestoCard components
    - Add featured projects bento grid with ProjectCard components (mixed sizes)
    - Add contact section with email and phone information
    - Add ContactForm component
    - Add decorative "24" text element with opacity
    - Include Material Symbols icons for visual accents
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.8, 6.9_

  - [x] 14.2 Create Home page CSS module
    - Create styles/Home.module.css
    - Style hero section with large typography
    - Implement manifesto grid layout (3 columns on desktop)
    - Implement bento grid layout for projects (mixed card sizes)
    - Style contact section
    - Implement responsive layouts for mobile and tablet
    - _Requirements: 6.2, 6.3_

- [x] 15. Implement Cases/Portfolio page
  - [x] 15.1 Create Cases page component
    - Create app/cases/page.tsx
    - Add "ЦИФРОВОЙ МАНИФЕСТ" headline with primary color accent
    - Add filter bar with category buttons (Все Проекты, Веб-Дизайн, Брендинг, Типографика, UI/UX)
    - Implement filter state with React useState
    - Display filtered projects in responsive grid
    - Add CTA section with "ЕСТЬ ПРОЕКТ ДЛЯ МЕНЯ?" headline
    - Include at least one wide project card
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.8_

  - [x] 15.2 Create Cases page CSS module
    - Create styles/Cases.module.css
    - Style headline with primary color accent
    - Style filter bar with button states
    - Implement responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)
    - Style CTA section
    - _Requirements: 7.1, 7.3_

- [x] 16. Implement About page
  - [x] 16.1 Create About page component
    - Create app/about/page.tsx
    - Add "ДИЗАЙН КАК ОРУЖИЕ МЫСЛИ" headline
    - Add large portrait image with grayscale filter and hover transition
    - Add biographical text in two paragraphs with different font sizes
    - Add skills grid with SkillCard components (at least 5 skills)
    - Add "50+ ПРОЕКТОВ" statistics card
    - Add CTA section with "ЕСТЬ ИДЕЯ?" prompt
    - Use Next.js Image component for portrait
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.7, 8.8_

  - [x] 16.2 Create About page CSS module
    - Create styles/About.module.css
    - Implement asymmetric grid layout (7 columns text, 5 columns image on desktop)
    - Style portrait image with grayscale filter and hover transition
    - Implement sticky positioning for portrait on desktop
    - Style skills grid
    - Implement responsive layout for mobile
    - _Requirements: 8.2, 8.5, 8.9_

- [x] 17. Implement Contact page
  - [x] 17.1 Create Contact page component
    - Create app/contact/page.tsx
    - Add "ДАВАЙТЕ РАБОТАТЬ" headline with primary color accent
    - Add ContactForm component
    - Add sidebar with contact information (email, telegram, phone)
    - Add workspace image with grayscale filter
    - Add quote section with attribution
    - _Requirements: 9.1, 9.7, 9.8, 9.9_

  - [x] 17.2 Create Contact page CSS module
    - Create styles/Contact.module.css
    - Implement asymmetric grid layout (8 columns form, 4 columns sidebar on desktop)
    - Style sidebar with contact information
    - Style workspace image
    - Style quote section
    - Implement responsive layout for mobile
    - _Requirements: 9.10_

- [x] 18. Implement root layout
  - [x] 18.1 Create root layout component
    - Create app/layout.tsx
    - Apply font variables to html element
    - Add Navigation component
    - Add children slot for page content
    - Add Footer component
    - Configure metadata (title, description)
    - Add lang="ru" attribute to html element
    - _Requirements: 3.1, 3.2, 3.3, 13.8_

  - [x] 18.2 Configure metadata and SEO
    - Implement Next.js metadata API for page titles
    - Add Open Graph tags for social media sharing
    - Add meta descriptions for each page
    - Configure viewport and charset meta tags
    - _Requirements: 14.1, 14.2_

- [x] 19. Checkpoint - Verify all pages
  - Test navigation between all pages
  - Verify all components render correctly on each page
  - Test responsive layouts at all breakpoints
  - Ask the user if questions arise

- [x] 20. Implement responsive design optimizations
  - [x] 20.1 Add mobile-specific styles
    - Adjust font sizes for mobile (reduce by 30-50%)
    - Implement mobile navigation menu with hamburger button
    - Stack grid layouts vertically on mobile
    - Adjust padding and spacing for mobile viewports
    - Ensure touch targets are at least 44px
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.7_

  - [x] 20.2 Test responsive behavior
    - Verify layouts at 320px, 640px, 768px, 1024px, and 1280px
    - Test mobile menu functionality
    - Verify border styles and shadows maintain on all screen sizes
    - Test touch interactions on mobile devices
    - _Requirements: 10.6, 10.8_

  - [ ]* 20.3 Write property test for mobile touch target size
    - **Property 10: Mobile Touch Target Size**
    - **Validates: Requirements 10.7**

- [x] 21. Implement image optimization
  - [x] 21.1 Configure Next.js Image components
    - Replace all img tags with Next.js Image component
    - Configure appropriate sizes and srcset attributes
    - Implement lazy loading for below-the-fold images
    - Add proper alt text to all images
    - Apply grayscale filters via CSS (not image processing)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

  - [x] 21.2 Add Material Symbols icon font
    - Add Material Symbols Outlined font to project
    - Configure font loading in layout
    - Use icons in ManifestoCard and SkillCard components
    - _Requirements: 11.5_

  - [ ]* 21.3 Write property test for image alt text presence
    - **Property 11: Image Alt Text Presence**
    - **Validates: Requirements 11.3**

- [x] 22. Implement interactive states and animations
  - [x] 22.1 Add hover state styles
    - Ensure all interactive elements have hover states
    - Implement hard shadow transitions (200-300ms duration)
    - Add scale transforms for specific elements
    - Implement smooth color transitions for backgrounds
    - _Requirements: 12.1, 12.2, 12.4, 12.6_

  - [x] 22.2 Add active state styles
    - Implement active states with translate transforms (1px x and y)
    - Remove shadows on active button press
    - Test performance to maintain 60fps during animations
    - _Requirements: 12.3, 12.7, 12.8_

  - [ ]* 22.3 Write property test for interactive element hover states
    - **Property 12: Interactive Element Hover States**
    - **Validates: Requirements 12.1**

  - [ ]* 22.4 Write property test for hard shadow transition duration
    - **Property 13: Hard Shadow Transition Duration**
    - **Validates: Requirements 12.2**

  - [ ]* 22.5 Write property test for active state transform
    - **Property 14: Active State Transform**
    - **Validates: Requirements 12.3**

  - [ ]* 22.6 Write property test for background color transition smoothness
    - **Property 15: Background Color Transition Smoothness**
    - **Validates: Requirements 12.6**

  - [ ]* 22.7 Write property test for button active shadow removal
    - **Property 16: Button Active Shadow Removal**
    - **Validates: Requirements 12.7**

- [x] 23. Implement accessibility features
  - [x] 23.1 Add semantic HTML and ARIA attributes
    - Use semantic HTML5 elements (header, nav, main, section, article, footer)
    - Ensure proper heading hierarchy on all pages (single h1, no skipped levels)
    - Add aria-labels to icon-only buttons
    - Add skip-to-content link for keyboard users
    - Associate form labels with inputs using htmlFor/id
    - _Requirements: 13.1, 13.2, 13.3, 13.6, 13.7_

  - [x] 23.2 Add keyboard navigation styles
    - Implement focus-visible states for all interactive elements
    - Ensure focus indicators are visible and meet contrast requirements
    - Test keyboard navigation through all pages
    - _Requirements: 13.5_

  - [ ]* 23.3 Write property test for heading hierarchy validity
    - **Property 17: Heading Hierarchy Validity**
    - **Validates: Requirements 13.2, 14.4**

  - [ ]* 23.4 Write property test for icon button aria labels
    - **Property 18: Icon Button Aria Labels**
    - **Validates: Requirements 13.3**

  - [ ]* 23.5 Write property test for color contrast compliance
    - **Property 19: Color Contrast Compliance**
    - **Validates: Requirements 13.4**

  - [ ]* 23.6 Write property test for keyboard focus visibility
    - **Property 20: Keyboard Focus Visibility**
    - **Validates: Requirements 13.5**

  - [ ]* 23.7 Write property test for form label association
    - **Property 21: Form Label Association**
    - **Validates: Requirements 13.7**

- [x] 24. Implement performance optimizations
  - [x] 24.1 Configure Next.js optimizations
    - Implement static generation for all pages
    - Configure font preloading for critical fonts
    - Minimize CSS bundle size through modular imports
    - Configure image optimization settings in next.config.js
    - _Requirements: 14.5, 14.6, 14.7, 14.8_

  - [x] 24.2 Add sitemap and metadata
    - Generate sitemap.xml file
    - Verify metadata API implementation on all pages
    - Test Open Graph tags with social media validators
    - _Requirements: 14.3_

  - [ ]* 24.3 Run Lighthouse performance audit
    - Verify performance score above 90
    - Check accessibility score
    - Verify SEO score
    - _Requirements: 14.5_

- [x] 25. Final integration and testing
  - [x] 25.1 Set up testing framework
    - Install Jest and React Testing Library
    - Install fast-check for property-based testing
    - Configure Jest with Next.js
    - Create test utilities and helpers
    - _Requirements: All testing requirements_

  - [x] 25.2 Verify all functionality
    - Test navigation between all pages
    - Test form submission and validation
    - Test filter functionality on Cases page
    - Test responsive behavior at all breakpoints
    - Test all hover and focus states
    - Verify all images load correctly
    - Test keyboard navigation
    - _Requirements: All functional requirements_

- [x] 26. Final checkpoint - Complete verification
  - Run all tests and ensure they pass
  - Verify Lighthouse scores meet requirements
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on mobile devices
  - Ask the user if questions arise or if ready for deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All code examples use TypeScript as specified in the design document
- The brutalist design aesthetic must be preserved throughout implementation
