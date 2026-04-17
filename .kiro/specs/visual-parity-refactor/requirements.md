# Requirements Document

## Introduction

This document defines the requirements for refactoring the brutalist portfolio Next.js application to achieve pixel-perfect visual parity with the original HTML files. The current Next.js implementation works functionally but does not match the original Tailwind-based brutalist design. This refactoring will update all pages, components, and styles while preserving Next.js features (Image optimization, routing, TypeScript) and existing functionality.

## Glossary

- **Original_HTML**: The reference HTML files (Head_code.html, Cases_code.html, Me_code.html, Form_code.html) located in the Html/ folder that use Tailwind CSS
- **Next_App**: The current Next.js application that needs visual updates
- **Brutalist_Design**: A design aesthetic characterized by raw, bold typography, hard shadows, thick borders, zero border-radius, and high-contrast colors
- **Visual_Parity**: Pixel-perfect matching of layout, spacing, typography, colors, borders, shadows, and interactions between two implementations
- **CSS_Modules**: The current styling approach used in the Next.js application
- **Tailwind_Classes**: The utility-first CSS classes used in the Original_HTML files
- **Hard_Shadow**: A brutalist shadow effect with format "box-shadow: 8px 8px 0px 0px #000000"
- **Typography_System**: Font families (Plus Jakarta Sans for headlines, Space Grotesk for body), sizes, weights, letter-spacing, and line-heights
- **Color_System**: The custom color palette defined in the Tailwind config including primary-fixed (#ffd709), primary-container, surface colors, and semantic colors
- **Border_System**: Consistent 4px borders used throughout the design for major sections and 3px borders for interactive elements
- **Component**: Reusable React components (Navigation, Footer, ProjectCard, ManifestoCard, ContactForm, SkillCard)
- **Page**: Top-level route pages (Home, Cases, About, Contact)
- **Hover_State**: Interactive visual feedback when user hovers over elements
- **Responsive_Behavior**: How the design adapts across mobile, tablet, and desktop breakpoints

## Requirements

### Requirement 1: Match Typography System

**User Story:** As a designer, I want the Next.js app to use the exact same typography as the original HTML, so that the visual hierarchy and brutalist aesthetic are preserved.

#### Acceptance Criteria

1. THE Typography_System SHALL use "Plus Jakarta Sans" font family with weights 700, 800, 900 for all headline elements
2. THE Typography_System SHALL use "Space Grotesk" font family with weights 400, 500, 700 for all body and label text
3. WHEN rendering page titles, THE Next_App SHALL apply font-black (900 weight), uppercase transform, and tracking-tighter (-0.05em letter-spacing)
4. WHEN rendering hero headings, THE Next_App SHALL apply text-6xl on mobile and text-8xl or text-9xl on desktop with leading-[0.85] line-height
5. WHEN rendering navigation links, THE Next_App SHALL apply font-black, uppercase, tracking-tighter, and text-xl sizing
6. WHEN rendering body text, THE Next_App SHALL apply font-medium or font-bold weights with appropriate text-lg, text-xl, or text-2xl sizing
7. THE Typography_System SHALL match all font-size, font-weight, letter-spacing, line-height, and text-transform values from Original_HTML

### Requirement 2: Match Color System

**User Story:** As a designer, I want the Next.js app to use the exact color palette from the original HTML, so that the bold, high-contrast brutalist aesthetic is maintained.

#### Acceptance Criteria

1. THE Color_System SHALL define primary-fixed as #ffd709 (bright yellow)
2. THE Color_System SHALL define primary-container as #ffd709
3. THE Color_System SHALL define background as #f6f6f6 (light gray)
4. THE Color_System SHALL define surface colors: surface-container-low (#f0f1f1), surface-container-high (#e1e3e3), surface-container-highest (#dbdddd)
5. THE Color_System SHALL define on-surface as #2d2f2f (dark gray for text)
6. THE Color_System SHALL define all 50+ semantic colors from the Original_HTML Tailwind config
7. WHEN applying backgrounds, THE Next_App SHALL use white, black, primary-fixed, and surface colors matching Original_HTML
8. WHEN applying text colors, THE Next_App SHALL use black, white, black/60 opacity, and white/60 opacity matching Original_HTML

### Requirement 3: Match Border System

**User Story:** As a designer, I want all borders to match the original HTML thickness and style, so that the brutalist structure is visually consistent.

#### Acceptance Criteria

1. WHEN rendering major section dividers, THE Next_App SHALL apply border-[4px] border-black
2. WHEN rendering interactive elements (buttons, cards), THE Next_App SHALL apply border-[3px] or border-[4px] border-black
3. WHEN rendering the navigation header, THE Next_App SHALL apply border-b-[4px] border-black
4. WHEN rendering the footer, THE Next_App SHALL apply border-t-[4px] border-black
5. WHEN rendering grid layouts, THE Next_App SHALL apply border-[2px] or border-[4px] to grid cells matching Original_HTML
6. THE Border_System SHALL use border-radius: 0px for all elements (no rounded corners)
7. THE Border_System SHALL match all border widths, colors, and positions from Original_HTML

### Requirement 4: Match Hard Shadow Effects

**User Story:** As a designer, I want the brutalist hard shadows to match the original HTML exactly, so that the depth and layering effects are preserved.

#### Acceptance Criteria

1. THE Hard_Shadow SHALL be defined as "box-shadow: 8px 8px 0px 0px #000000"
2. THE Hard_Shadow small variant SHALL be defined as "box-shadow: 4px 4px 0px 0px #000000"
3. WHEN rendering project cards, THE Next_App SHALL apply Hard_Shadow effect
4. WHEN rendering buttons with shadow, THE Next_App SHALL apply Hard_Shadow small variant
5. WHEN hovering over cards, THE Next_App SHALL increase shadow to "box-shadow: 16px 16px 0px 0px #000000" and translate element by (-2px, -2px)
6. WHEN clicking buttons with shadow, THE Next_App SHALL remove shadow and translate element by (1px, 1px) for active state
7. THE Next_App SHALL match all shadow effects, hover transitions, and active states from Original_HTML

### Requirement 5: Match Layout and Spacing

**User Story:** As a designer, I want all spacing, padding, margins, and layout structures to match the original HTML, so that the visual rhythm and composition are identical.

#### Acceptance Criteria

1. WHEN rendering the navigation, THE Next_App SHALL apply px-6 py-4 on mobile and px-12 on desktop
2. WHEN rendering hero sections, THE Next_App SHALL apply px-6 md:px-12 py-20 or py-16 matching Original_HTML
3. WHEN rendering content sections, THE Next_App SHALL apply px-6 md:px-12 py-24 matching Original_HTML
4. WHEN rendering grid layouts, THE Next_App SHALL apply gap-8 or gap-12 matching Original_HTML
5. WHEN rendering card padding, THE Next_App SHALL apply p-6, p-8, or p-12 matching Original_HTML
6. WHEN rendering max-width containers, THE Next_App SHALL apply max-w-7xl mx-auto matching Original_HTML
7. THE Next_App SHALL match all padding, margin, gap, and max-width values from Original_HTML

### Requirement 6: Match Navigation Component

**User Story:** As a user, I want the navigation to look and behave exactly like the original HTML, so that the brutalist header design is consistent.

#### Acceptance Criteria

1. THE Navigation SHALL be sticky positioned at top-0 with z-50
2. THE Navigation SHALL have bg-white with border-b-[4px] border-black
3. THE Navigation SHALL display "АРХИВ-24" logo at text-3xl font-black uppercase tracking-[-0.05em]
4. WHEN rendering navigation links, THE Navigation SHALL show them at font-black uppercase tracking-tighter text-xl
5. WHEN a navigation link is active, THE Navigation SHALL apply underline decoration-[4px] underline-offset-8
6. WHEN hovering inactive links, THE Navigation SHALL apply hover:bg-yellow-400 hover:text-black transition
7. THE Navigation SHALL display "ЗАКАЗАТЬ" button with bg-primary-container border-[3px] border-black and Hard_Shadow small variant
8. WHEN clicking the button, THE Navigation SHALL apply active:translate-x-1 active:translate-y-1 active:shadow-none
9. ON mobile, THE Navigation SHALL hide navigation links (hidden md:flex)

### Requirement 7: Match Footer Component

**User Story:** As a user, I want the footer to match the original HTML design, so that the brutalist aesthetic is consistent throughout the page.

#### Acceptance Criteria

1. THE Footer SHALL have bg-stone-100 with border-t-[4px] border-black
2. THE Footer SHALL apply px-6 py-12 md:px-12 with flex layout
3. THE Footer SHALL display "АРХИВ-24" at text-4xl font-black
4. THE Footer SHALL display social links (TELEGRAM, BEHANCE, DRIBBBLE, EMAIL) at font-bold uppercase text-sm tracking-widest
5. WHEN hovering social links, THE Footer SHALL apply hover:italic hover:scale-105 transition
6. THE Footer SHALL display copyright text at font-bold uppercase text-sm tracking-widest with opacity-60
7. THE Footer SHALL use flex-col on mobile and flex-row on desktop with gap-8

### Requirement 8: Match Home Page Layout

**User Story:** As a user, I want the home page to match the original Head_code.html exactly, so that the brutalist portfolio landing page is visually identical.

#### Acceptance Criteria

1. THE Home_Page SHALL render hero section with bg-primary-fixed border-b-[4px] border-black py-20
2. THE Home_Page SHALL display hero title at font-black text-6xl md:text-[8rem] leading-[0.9] uppercase tracking-tighter
3. THE Home_Page SHALL render manifesto grid with 3 columns on desktop, each with p-12 border-[4px] border-black
4. WHEN hovering manifesto cards, THE Home_Page SHALL apply hover:bg-primary-fixed transition
5. THE Home_Page SHALL render featured projects in bento grid layout with gap-8
6. THE Home_Page SHALL render large project card at md:col-span-8 with Hard_Shadow and hover effects
7. THE Home_Page SHALL render contact section with 2-column layout: left side for contact info, right side for form
8. THE Home_Page SHALL render FAB button at fixed bottom-8 right-8 with bg-primary-fixed border-[4px] border-black and Hard_Shadow

### Requirement 9: Match Cases Page Layout

**User Story:** As a user, I want the cases page to match the original Cases_code.html exactly, so that the project portfolio grid is visually identical.

#### Acceptance Criteria

1. THE Cases_Page SHALL render hero section with px-6 md:px-12 py-16 border-b-[4px] border-black bg-white
2. THE Cases_Page SHALL display title at font-black text-6xl md:text-9xl uppercase tracking-tighter leading-[0.85]
3. THE Cases_Page SHALL render filter bar with bg-black text-white px-6 md:px-12 py-4
4. THE Cases_Page SHALL display filter options at font-bold uppercase text-sm tracking-widest
5. WHEN a filter is active, THE Cases_Page SHALL apply text-primary-container underline decoration-2 underline-offset-4
6. THE Cases_Page SHALL render project grid at grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12
7. WHEN rendering project cards, THE Cases_Page SHALL apply bg-white border-[4px] border-black Hard_Shadow
8. WHEN hovering project cards, THE Cases_Page SHALL apply hover:-translate-y-2 hover:-translate-x-2 and increase shadow to 16px
9. THE Cases_Page SHALL render featured wide card at md:col-span-2 with grid-cols-5 internal layout
10. THE Cases_Page SHALL render CTA section with bg-primary-container border-y-[4px] border-black py-24

### Requirement 10: Match About Page Layout

**User Story:** As a user, I want the about page to match the original Me_code.html exactly, so that the personal bio and skills section are visually identical.

#### Acceptance Criteria

1. THE About_Page SHALL render hero section with grid-cols-1 lg:grid-cols-12 gap-12
2. THE About_Page SHALL display title at font-black text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tighter
3. THE About_Page SHALL render portrait at lg:col-span-5 with aspect-[4/5] border-[4px] border-black
4. THE About_Page SHALL apply grayscale contrast-125 brightness-90 to portrait image
5. WHEN hovering portrait, THE About_Page SHALL apply group-hover:grayscale-0 transition
6. THE About_Page SHALL render portrait with offset shadow using absolute positioning and translate
7. THE About_Page SHALL render skills grid at grid-cols-2 md:grid-cols-3 lg:grid-cols-5 with gap-0 and border-[2px] border-black
8. WHEN hovering skill cards, THE About_Page SHALL apply hover:bg-primary-container transition
9. THE About_Page SHALL render CTA section with md:col-span-2 bg-surface-container-highest border-[4px] border-black p-12 Hard_Shadow

### Requirement 11: Match Contact Page Layout

**User Story:** As a user, I want the contact page to match the original Form_code.html exactly, so that the contact form design is visually identical.

#### Acceptance Criteria

1. THE Contact_Page SHALL render hero section with h1 at text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none
2. THE Contact_Page SHALL render form at lg:col-span-8 with space-y-12
3. WHEN rendering form fields, THE Contact_Page SHALL apply border-b-[4px] border-black with p-2
4. WHEN focusing form fields, THE Contact_Page SHALL apply focus-within:bg-primary-container transition
5. THE Contact_Page SHALL render labels at font-black text-2xl uppercase
6. THE Contact_Page SHALL render inputs at text-4xl md:text-5xl font-black uppercase
7. THE Contact_Page SHALL render submit button at text-4xl md:text-6xl px-12 py-8 border-[6px] border-black
8. WHEN hovering submit button, THE Contact_Page SHALL apply hover:Hard_Shadow transition
9. THE Contact_Page SHALL render sidebar at lg:col-span-4 with contact info card (bg-black text-white p-8 Hard_Shadow)
10. THE Contact_Page SHALL render sidebar image with aspect-square border-[4px] border-black grayscale contrast-125

### Requirement 12: Match ProjectCard Component

**User Story:** As a developer, I want the ProjectCard component to match the original HTML card design, so that project cards are visually consistent.

#### Acceptance Criteria

1. THE ProjectCard SHALL render with bg-white border-[4px] border-black Hard_Shadow
2. THE ProjectCard SHALL render image container with aspect-square bg-surface-container-high border-b-[4px] border-black
3. THE ProjectCard SHALL apply grayscale to images with group-hover:grayscale-0 transition
4. THE ProjectCard SHALL render title at font-black text-3xl uppercase tracking-tighter
5. THE ProjectCard SHALL render category badge at font-bold bg-black text-white px-2 py-1 text-xs
6. THE ProjectCard SHALL render description at font-bold uppercase text-sm opacity-70
7. WHEN hovering, THE ProjectCard SHALL apply hover:-translate-y-2 hover:-translate-x-2 and shadow-[16px_16px_0px_0px_#000000]

### Requirement 13: Match ManifestoCard Component

**User Story:** As a developer, I want the ManifestoCard component to match the original HTML manifesto grid design, so that the home page manifesto section is visually consistent.

#### Acceptance Criteria

1. THE ManifestoCard SHALL render with p-12 border-[4px] border-black bg-white
2. THE ManifestoCard SHALL display number at font-black text-8xl text-black/10
3. WHEN hovering, THE ManifestoCard SHALL apply group-hover:text-black to the number
4. THE ManifestoCard SHALL display title at font-black text-3xl uppercase
5. THE ManifestoCard SHALL display description at text-lg leading-snug
6. WHEN hovering, THE ManifestoCard SHALL apply hover:bg-primary-fixed transition

### Requirement 14: Match ContactForm Component

**User Story:** As a developer, I want the ContactForm component to match the original HTML form design, so that the contact form is visually consistent.

#### Acceptance Criteria

1. THE ContactForm SHALL render with space-y-8 or space-y-12 layout
2. THE ContactForm SHALL render field groups with border-b-[4px] border-black p-4
3. WHEN focusing fields, THE ContactForm SHALL apply focus:bg-primary-container transition
4. THE ContactForm SHALL render labels at font-black uppercase text-sm or text-2xl
5. THE ContactForm SHALL render inputs at text-2xl or text-4xl font-black
6. THE ContactForm SHALL render textarea with resize-none and appropriate rows
7. THE ContactForm SHALL render submit button with bg-black text-white py-6 text-2xl font-black uppercase Hard_Shadow small variant
8. WHEN hovering submit button, THE ContactForm SHALL apply hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition

### Requirement 15: Match SkillCard Component

**User Story:** As a developer, I want the SkillCard component to match the original HTML skills grid design, so that the about page skills section is visually consistent.

#### Acceptance Criteria

1. THE SkillCard SHALL render with border-[2px] border-black p-8
2. THE SkillCard SHALL display skill name at font-black text-4xl
3. THE SkillCard SHALL display skill description at text-sm uppercase opacity-60
4. WHEN hovering, THE SkillCard SHALL apply hover:bg-primary-container transition
5. WHEN hovering, THE SkillCard SHALL apply group-hover:scale-110 transition to skill name with origin-left
6. THE SkillCard SHALL support variant with bg-black text-white that inverts on hover

### Requirement 16: Match Responsive Behavior

**User Story:** As a user, I want the responsive behavior to match the original HTML exactly, so that the design adapts correctly across all device sizes.

#### Acceptance Criteria

1. WHEN viewport is mobile, THE Next_App SHALL apply px-6 py-4 spacing
2. WHEN viewport is desktop, THE Next_App SHALL apply px-12 spacing
3. WHEN viewport is mobile, THE Next_App SHALL hide navigation links (hidden md:flex)
4. WHEN viewport is mobile, THE Next_App SHALL render grids at grid-cols-1
5. WHEN viewport is tablet, THE Next_App SHALL render grids at md:grid-cols-2 or md:grid-cols-3
6. WHEN viewport is desktop, THE Next_App SHALL render grids at lg:grid-cols-3 or lg:grid-cols-5
7. WHEN viewport is mobile, THE Next_App SHALL render text at base sizes (text-6xl, text-3xl)
8. WHEN viewport is desktop, THE Next_App SHALL render text at larger sizes (text-9xl, text-8xl, text-5xl)
9. THE Next_App SHALL match all breakpoint behaviors (md:, lg:) from Original_HTML

### Requirement 17: Match Hover and Transition Effects

**User Story:** As a user, I want all hover states and transitions to match the original HTML, so that the interactive feedback is consistent.

#### Acceptance Criteria

1. WHEN hovering navigation links, THE Next_App SHALL apply bg-yellow-400 text-black with transition-colors duration-100
2. WHEN hovering buttons, THE Next_App SHALL apply bg-black text-white or bg-primary-fixed transitions
3. WHEN hovering project cards, THE Next_App SHALL apply translate and shadow transitions with duration-500
4. WHEN hovering images, THE Next_App SHALL apply scale-110 transform with transition-transform duration-500
5. WHEN hovering social links, THE Next_App SHALL apply italic and scale-105 with transition-all
6. WHEN clicking buttons with shadow, THE Next_App SHALL apply active:translate-x-1 active:translate-y-1 active:shadow-none
7. THE Next_App SHALL match all transition durations, easing, and transform values from Original_HTML

### Requirement 18: Preserve Next.js Features

**User Story:** As a developer, I want to preserve all Next.js optimizations and features, so that the refactored app maintains performance and functionality.

#### Acceptance Criteria

1. THE Next_App SHALL continue using next/image for all image optimizations
2. THE Next_App SHALL continue using Next.js App Router for all page routing
3. THE Next_App SHALL continue using TypeScript for all components and pages
4. THE Next_App SHALL continue using React Server Components where appropriate
5. THE Next_App SHALL preserve all existing data fetching patterns
6. THE Next_App SHALL preserve all existing component props and interfaces
7. THE Next_App SHALL maintain all existing accessibility attributes (alt text, ARIA labels)

### Requirement 19: Preserve Existing Functionality

**User Story:** As a developer, I want all existing functionality to continue working, so that the refactoring only affects visual design.

#### Acceptance Criteria

1. THE Next_App SHALL preserve all form submission logic
2. THE Next_App SHALL preserve all navigation routing logic
3. THE Next_App SHALL preserve all filter functionality on cases page
4. THE Next_App SHALL preserve all existing event handlers
5. THE Next_App SHALL preserve all existing state management
6. THE Next_App SHALL pass all existing unit tests
7. THE Next_App SHALL pass all existing integration tests
8. THE Next_App SHALL pass all existing property-based tests

### Requirement 20: Match Material Symbols Icons

**User Story:** As a designer, I want the icon system to match the original HTML, so that the brutalist iconography is consistent.

#### Acceptance Criteria

1. THE Next_App SHALL use Material Symbols Outlined font for all icons
2. THE Next_App SHALL apply font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 by default
3. WHEN rendering filled icons, THE Next_App SHALL apply 'FILL' 1
4. THE Next_App SHALL render icons at text-4xl, text-6xl, or appropriate sizes matching Original_HTML
5. THE Next_App SHALL match all icon names, sizes, and positions from Original_HTML

### Requirement 21: Match Global Styles

**User Story:** As a developer, I want the global styles to match the original HTML, so that base styling is consistent.

#### Acceptance Criteria

1. THE Next_App SHALL apply font-body to body element
2. THE Next_App SHALL apply bg-surface text-on-surface to body element
3. THE Next_App SHALL apply selection:bg-primary-container selection:text-black for text selection
4. THE Next_App SHALL apply overflow-x-hidden to prevent horizontal scroll
5. THE Next_App SHALL define brutal-shadow and brutal-shadow-sm utility classes
6. THE Next_App SHALL define active-link utility class for navigation
7. THE Next_App SHALL match all global CSS custom properties and utility classes from Original_HTML

### Requirement 22: Match Image Treatments

**User Story:** As a designer, I want all image filters and effects to match the original HTML, so that the brutalist image aesthetic is preserved.

#### Acceptance Criteria

1. WHEN rendering project images, THE Next_App SHALL apply grayscale filter by default
2. WHEN hovering project images, THE Next_App SHALL apply group-hover:grayscale-0 transition
3. WHEN rendering portrait images, THE Next_App SHALL apply grayscale contrast-125 brightness-90
4. WHEN rendering specific images, THE Next_App SHALL apply contrast-125 matching Original_HTML
5. THE Next_App SHALL match all image filter values (grayscale, contrast, brightness) from Original_HTML

### Requirement 23: Match Grid and Bento Layouts

**User Story:** As a designer, I want all grid layouts to match the original HTML exactly, so that the brutalist composition is preserved.

#### Acceptance Criteria

1. THE Next_App SHALL render home featured projects at grid-cols-1 md:grid-cols-12 gap-8
2. THE Next_App SHALL render large project card at md:col-span-8
3. THE Next_App SHALL render small project cards at md:col-span-4
4. THE Next_App SHALL render cases grid at grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12
5. THE Next_App SHALL render skills grid at grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0
6. THE Next_App SHALL render manifesto grid at grid-cols-1 md:grid-cols-3 with gap-0
7. THE Next_App SHALL match all grid column spans, gaps, and responsive breakpoints from Original_HTML

### Requirement 24: Match Decorative Elements

**User Story:** As a designer, I want all decorative elements to match the original HTML, so that the brutalist details are preserved.

#### Acceptance Criteria

1. THE Home_Page SHALL render large "24" decorative text at absolute right-[-5%] bottom-[-10%] opacity-10
2. THE Home_Page SHALL render decorative text at font-black text-[30rem] leading-none
3. THE Cases_Page SHALL render decorative grid lines at fixed positions with bg-black/10
4. THE About_Page SHALL render decorative "CREATIVE" text with rotate-12 transform and opacity-10
5. THE Next_App SHALL match all decorative element positions, sizes, opacities, and transforms from Original_HTML

### Requirement 25: Match Button Styles

**User Story:** As a designer, I want all button styles to match the original HTML exactly, so that the brutalist interactive elements are consistent.

#### Acceptance Criteria

1. THE Next_App SHALL render primary buttons with bg-black text-white border-[3px] border-black
2. THE Next_App SHALL render secondary buttons with bg-white text-black border-[3px] border-black
3. THE Next_App SHALL render accent buttons with bg-primary-fixed text-black border-[3px] border-black
4. THE Next_App SHALL apply Hard_Shadow small variant to buttons
5. WHEN hovering buttons, THE Next_App SHALL apply color inversions or shadow increases
6. WHEN clicking buttons, THE Next_App SHALL apply active:translate-x-1 active:translate-y-1 active:shadow-none
7. THE Next_App SHALL render button text at font-black uppercase with appropriate sizing (text-xl, text-2xl, text-4xl)
