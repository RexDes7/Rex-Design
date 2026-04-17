# Implementation Plan: Visual Parity Refactor

## Overview

This implementation plan refactors the Next.js brutalist portfolio to achieve pixel-perfect visual parity with the original HTML files. The refactoring focuses exclusively on CSS and styling while preserving all existing Next.js functionality, TypeScript types, and component architecture. Each task builds incrementally, validating visual correctness through property-based tests and unit tests.

## Tasks

- [x] 1. Set up global design system foundation
  - Create CSS custom properties for all design tokens (colors, typography, spacing, shadows, borders)
  - Define utility classes for typography, colors, borders, shadows, spacing, layout, transforms, filters, and transitions
  - Set up font imports (Plus Jakarta Sans, Space Grotesk, Material Symbols)
  - Configure global body styles and text selection styling
  - _Requirements: 1.1, 1.2, 2.1-2.6, 3.6, 4.1, 4.2, 20.1, 20.2, 21.1-21.7_

- [ ]* 1.1 Write property tests for design system foundation
  - **Property 1: Typography Font Families** - Validates: Requirements 1.1
  - **Property 2: Body Typography Font Families** - Validates: Requirements 1.2
  - **Property 7: Color System Completeness** - Validates: Requirements 2.6
  - **Property 13: Zero Border Radius** - Validates: Requirements 3.6
  - **Property 40: Global Body Styles** - Validates: Requirements 21.2
  - **Property 41: Text Selection Styling** - Validates: Requirements 21.3

- [x] 2. Refactor Navigation component styles
  - [x] 2.1 Update Navigation.module.css with brutalist styling
    - Implement sticky positioning, borders, shadows, and spacing
    - Style logo with correct typography (text-3xl, font-black, uppercase, tracking-tighter)
    - Style navigation links with correct typography and hover states
    - Style "ЗАКАЗАТЬ" button with yellow background, border, and shadow
    - Implement responsive behavior (hide links on mobile)
    - _Requirements: 6.1-6.9, 16.3, 17.1_
  
  - [ ]* 2.2 Write property tests for Navigation component
    - **Property 5: Navigation Link Typography** - Validates: Requirements 1.5
    - **Property 18: Responsive Navigation Padding** - Validates: Requirements 5.1
    - **Property 24: Navigation Active Link Styling** - Validates: Requirements 6.5
    - **Property 25: Navigation Link Hover State** - Validates: Requirements 6.6
    - **Property 26: Navigation Button Active State** - Validates: Requirements 6.8
    - **Property 27: Navigation Links Responsive Visibility** - Validates: Requirements 6.9

- [x] 3. Refactor Footer component styles
  - [x] 3.1 Update Footer.module.css with brutalist styling
    - Implement background color, borders, and spacing
    - Style logo and social links with correct typography
    - Implement hover effects for social links (italic, scale-105)
    - Implement responsive layout (flex-col on mobile, flex-row on desktop)
    - _Requirements: 7.1-7.7, 17.5_
  
  - [ ]* 3.2 Write property tests for Footer component
    - **Property 28: Social Link Hover Transform** - Validates: Requirements 7.5
    - **Property 29: Footer Responsive Layout** - Validates: Requirements 7.7

- [x] 4. Checkpoint - Verify global styles and layout components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Refactor ProjectCard component styles
  - [x] 5.1 Update ProjectCard.module.css with brutalist styling
    - Implement card background, borders, and hard shadows
    - Style image container with aspect-ratio, background, and grayscale filter
    - Style title, category badge, and description with correct typography
    - Implement hover effects (translate, shadow increase, grayscale removal)
    - Support variants (standard, featured, dark)
    - _Requirements: 12.1-12.7, 17.3, 22.1, 22.2_
  
  - [ ]* 5.2 Write property tests for ProjectCard component
    - **Property 30: ProjectCard Shadow and Border** - Validates: Requirements 12.1
    - **Property 31: ProjectCard Image Grayscale** - Validates: Requirements 12.3
    - **Property 32: ProjectCard Hover Transform** - Validates: Requirements 12.7
    - **Property 42: Image Grayscale Filter** - Validates: Requirements 22.1, 22.2

- [x] 6. Refactor ManifestoCard component styles
  - [x] 6.1 Update ManifestoCard.module.css with brutalist styling
    - Implement card padding, borders, and background
    - Style number with large typography and low opacity
    - Style title and description with correct typography
    - Implement hover effects (background color change, number opacity change)
    - _Requirements: 13.1-13.6_
  
  - [ ]* 6.2 Write property tests for ManifestoCard component
    - **Property 33: ManifestoCard Hover Background** - Validates: Requirements 13.6
    - **Property 34: ManifestoCard Number Hover Opacity** - Validates: Requirements 13.3

- [x] 7. Refactor ContactForm component styles
  - [x] 7.1 Update ContactForm.module.css with brutalist styling
    - Implement field group borders and spacing
    - Style labels with correct typography (font-black, uppercase, text-2xl)
    - Style inputs with large typography (text-4xl md:text-5xl, font-black, uppercase)
    - Style textarea with correct sizing and resize-none
    - Style submit button with black background, yellow text, thick border, and shadow
    - Implement focus states (background color change to yellow)
    - Implement hover effects for submit button
    - _Requirements: 14.1-14.8, 17.6_
  
  - [ ]* 7.2 Write property tests for ContactForm component
    - **Property 35: ContactForm Field Focus State** - Validates: Requirements 14.3
    - **Property 36: ContactForm Submit Button Hover** - Validates: Requirements 14.8

- [x] 8. Refactor SkillCard component styles
  - [x] 8.1 Update SkillCard.module.css with brutalist styling
    - Implement card borders and padding
    - Style skill name with large typography (text-4xl, font-black)
    - Style description with small typography (text-sm, uppercase, opacity-60)
    - Implement hover effects (background color change, name scale transform)
    - Support variant with inverted colors (bg-black text-white)
    - _Requirements: 15.1-15.6_
  
  - [ ]* 8.2 Write property tests for SkillCard component
    - **Property 37: SkillCard Hover Background** - Validates: Requirements 15.4
    - **Property 38: SkillCard Name Hover Scale** - Validates: Requirements 15.5

- [x] 9. Checkpoint - Verify all card components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Refactor Home page styles
  - [x] 10.1 Update Home page styles (page.module.css and Home.module.css)
    - Implement hero section with yellow background, border, and spacing
    - Style hero title with massive typography (text-6xl md:text-8xl, font-black, uppercase, tracking-tighter, leading-[0.9])
    - Implement manifesto grid layout (grid-cols-1 md:grid-cols-3, gap-0)
    - Implement featured projects bento grid (grid-cols-1 md:grid-cols-12, gap-8)
    - Style large project card (md:col-span-8) and small cards (md:col-span-4)
    - Implement contact section 2-column layout
    - Implement FAB button (fixed bottom-8 right-8, yellow background, border, shadow)
    - Add decorative "24" text element (absolute positioning, opacity-10)
    - _Requirements: 8.1-8.8, 16.1, 16.2, 16.4, 16.7, 16.8, 23.1-23.3, 24.1, 24.2_
  
  - [ ]* 10.2 Write property tests for Home page
    - **Property 3: Page Title Typography** - Validates: Requirements 1.3
    - **Property 4: Responsive Hero Typography** - Validates: Requirements 1.4
    - **Property 19: Responsive Hero Padding** - Validates: Requirements 5.2
    - **Property 21: Grid Gap Spacing** - Validates: Requirements 5.4

- [x] 11. Refactor Cases page styles
  - [x] 11.1 Update Cases page styles (page.module.css)
    - Implement hero section with white background, border, and spacing
    - Style title with massive typography (text-6xl md:text-9xl, font-black, uppercase, tracking-tighter, leading-[0.85])
    - Implement filter bar with black background, white text, and spacing
    - Style filter options with correct typography and active state (underline, yellow color)
    - Implement project grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-12)
    - Style featured wide card (md:col-span-2) with internal grid layout
    - Implement CTA section with yellow background and borders
    - Add decorative grid lines (fixed positioning, opacity-10)
    - _Requirements: 9.1-9.10, 16.4-16.6, 16.8, 23.4, 24.3_
  
  - [ ]* 11.2 Write property tests for Cases page
    - **Property 8: Background Color Application** - Validates: Requirements 2.7
    - **Property 9: Text Color Application** - Validates: Requirements 2.8
    - **Property 20: Responsive Content Section Padding** - Validates: Requirements 5.3

- [x] 12. Refactor About page styles
  - [x] 12.1 Update About page styles (About.module.css)
    - Implement hero grid layout (grid-cols-1 lg:grid-cols-12, gap-12)
    - Style title with massive typography (text-6xl md:text-8xl lg:text-9xl, font-black, uppercase, tracking-tighter, leading-[0.85])
    - Style bio section (lg:col-span-7) with correct typography
    - Implement portrait section (lg:col-span-5) with aspect-[4/5], border, and shadow offset
    - Apply portrait image filters (grayscale, contrast-125, brightness-90)
    - Implement portrait hover effect (grayscale removal)
    - Implement skills grid layout (grid-cols-2 md:grid-cols-3 lg:grid-cols-5, gap-0, border-[2px])
    - Implement CTA section with elevated card styling
    - Add decorative "CREATIVE" text (rotate-12, opacity-10)
    - _Requirements: 10.1-10.10, 16.5, 16.6, 16.8, 22.3, 22.4, 23.5, 24.4_
  
  - [ ]* 12.2 Write property tests for About page
    - **Property 6: Body Text Typography** - Validates: Requirements 1.6
    - **Property 22: Card Padding** - Validates: Requirements 5.5
    - **Property 43: Portrait Image Filters** - Validates: Requirements 22.3

- [x] 13. Refactor Contact page styles
  - [x] 13.1 Update Contact page styles (Contact.module.css)
    - Implement hero section with correct spacing
    - Style title with massive typography (text-6xl md:text-9xl, font-black, uppercase, tracking-tighter, leading-none)
    - Implement form layout (lg:col-span-8) with space-y-12
    - Implement sidebar layout (lg:col-span-4) with contact info card
    - Style sidebar card with black background, white text, padding, and shadow
    - Style sidebar image with aspect-square, border, and filters (grayscale, contrast-125)
    - _Requirements: 11.1-11.10, 16.7, 16.8_
  
  - [ ]* 13.2 Write property tests for Contact page
    - **Property 10: Section Border Styling** - Validates: Requirements 3.1, 3.3, 3.4
    - **Property 11: Interactive Element Borders** - Validates: Requirements 3.2
    - **Property 12: Grid Cell Borders** - Validates: Requirements 3.5

- [x] 14. Checkpoint - Verify all page layouts
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Implement responsive typography utilities
  - [x] 15.1 Add responsive typography classes to globals.css
    - Create utility classes for responsive font sizes (text-6xl mobile → text-8xl/text-9xl desktop)
    - Create utility classes for responsive line heights
    - Create utility classes for responsive letter spacing
    - Ensure all typography scales correctly across breakpoints
    - _Requirements: 1.4, 16.7, 16.8_
  
  - [ ]* 15.2 Write property tests for responsive typography
    - **Property 4: Responsive Hero Typography** - Validates: Requirements 1.4

- [x] 16. Implement responsive spacing utilities
  - [x] 16.1 Add responsive spacing classes to globals.css
    - Create utility classes for responsive padding (px-6 mobile → px-12 desktop)
    - Create utility classes for responsive section padding (py-16 mobile → py-24 desktop)
    - Create utility classes for responsive gaps
    - Ensure all spacing scales correctly across breakpoints
    - _Requirements: 5.1-5.3, 16.1, 16.2_
  
  - [ ]* 16.2 Write property tests for responsive spacing
    - **Property 18: Responsive Navigation Padding** - Validates: Requirements 5.1
    - **Property 19: Responsive Hero Padding** - Validates: Requirements 5.2
    - **Property 20: Responsive Content Section Padding** - Validates: Requirements 5.3

- [x] 17. Implement responsive grid utilities
  - [x] 17.1 Add responsive grid classes to globals.css
    - Create utility classes for responsive grid columns (grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3)
    - Create utility classes for responsive column spans
    - Create utility classes for responsive flex direction
    - Ensure all grids adapt correctly across breakpoints
    - _Requirements: 16.4-16.6, 23.1-23.7_
  
  - [ ]* 17.2 Write property tests for responsive grids
    - **Property 21: Grid Gap Spacing** - Validates: Requirements 5.4
    - **Property 23: Container Max Width** - Validates: Requirements 5.6

- [x] 18. Implement hover and transition effects
  - [x] 18.1 Add transition utilities to globals.css
    - Create transition utility classes (duration-100, duration-200, duration-500)
    - Create transform utility classes (translate, scale, rotate)
    - Ensure all hover effects have correct timing and easing
    - _Requirements: 17.1-17.7_
  
  - [ ]* 18.2 Write property tests for transitions
    - **Property 14: Project Card Shadow** - Validates: Requirements 4.3
    - **Property 15: Button Shadow** - Validates: Requirements 4.4
    - **Property 16: Card Hover Shadow Transform** - Validates: Requirements 4.5
    - **Property 17: Button Active State Transform** - Validates: Requirements 4.6

- [x] 19. Implement shadow system
  - [x] 19.1 Add shadow utilities to globals.css
    - Create brutalist shadow utility classes (brutal-shadow-sm, brutal-shadow, shadow-large)
    - Ensure all shadows use hard edges (0px blur)
    - Ensure all shadow offsets match specifications (4px, 8px, 16px)
    - _Requirements: 4.1-4.7_
  
  - [ ]* 19.2 Write property tests for shadows
    - **Property 14: Project Card Shadow** - Validates: Requirements 4.3
    - **Property 15: Button Shadow** - Validates: Requirements 4.4
    - **Property 16: Card Hover Shadow Transform** - Validates: Requirements 4.5
    - **Property 17: Button Active State Transform** - Validates: Requirements 4.6

- [x] 20. Checkpoint - Verify all utility systems
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Implement border system
  - [x] 21.1 Add border utilities to globals.css
    - Create border width utility classes (border-2, border-3, border-4, border-6)
    - Create directional border utility classes (border-top-4, border-bottom-4, etc.)
    - Ensure all borders use solid style and black color
    - Ensure border-radius is 0px globally
    - _Requirements: 3.1-3.6_
  
  - [ ]* 21.2 Write property tests for borders
    - **Property 10: Section Border Styling** - Validates: Requirements 3.1, 3.3, 3.4
    - **Property 11: Interactive Element Borders** - Validates: Requirements 3.2
    - **Property 12: Grid Cell Borders** - Validates: Requirements 3.5
    - **Property 13: Zero Border Radius** - Validates: Requirements 3.6

- [x] 22. Implement color system
  - [x] 22.1 Add color utilities to globals.css
    - Create background color utility classes (bgPrimaryFixed, bgSurface, bgWhite, bgBlack, etc.)
    - Create text color utility classes (textBlack, textWhite, textBlackOpacity60, etc.)
    - Create border color utility classes (borderBlack, borderYellow)
    - Ensure all colors match the design system specifications
    - _Requirements: 2.1-2.8_
  
  - [ ]* 22.2 Write property tests for colors
    - **Property 7: Color System Completeness** - Validates: Requirements 2.6
    - **Property 8: Background Color Application** - Validates: Requirements 2.7
    - **Property 9: Text Color Application** - Validates: Requirements 2.8

- [x] 23. Implement image filter system
  - [x] 23.1 Add filter utilities to globals.css
    - Create grayscale filter utility classes
    - Create contrast and brightness filter utility classes
    - Ensure all image filters match specifications
    - Implement hover transitions for filter removal
    - _Requirements: 22.1-22.5_
  
  - [ ]* 23.2 Write property tests for image filters
    - **Property 42: Image Grayscale Filter** - Validates: Requirements 22.1, 22.2
    - **Property 43: Portrait Image Filters** - Validates: Requirements 22.3

- [x] 24. Implement decorative elements
  - [x] 24.1 Add decorative element styles to page modules
    - Implement large "24" decorative text on Home page
    - Implement decorative grid lines on Cases page
    - Implement "CREATIVE" decorative text on About page
    - Ensure all decorative elements use absolute positioning and low opacity
    - Ensure pointer-events: none for all decorative elements
    - _Requirements: 24.1-24.5_
  
  - [ ]* 24.2 Write property tests for decorative elements
    - **Property 44: Decorative Element Positioning** - Validates: Requirements 24.1-24.5

- [x] 25. Implement Material Symbols icon system
  - [x] 25.1 Add Material Symbols configuration to globals.css
    - Import Material Symbols Outlined font
    - Configure font-variation-settings for default icon appearance
    - Create utility classes for filled icons
    - Create utility classes for icon sizing
    - _Requirements: 20.1-20.5_
  
  - [ ]* 25.2 Write property tests for icon system
    - **Property 39: Material Symbols Icon Configuration** - Validates: Requirements 20.2

- [x] 26. Final checkpoint - Comprehensive visual verification
  - Run all property-based tests and unit tests
  - Perform visual regression testing across all pages
  - Verify responsive behavior at mobile (375px), tablet (768px), and desktop (1024px+) breakpoints
  - Verify all hover states and transitions
  - Verify all interactive elements (buttons, links, forms)
  - Compare against original HTML files for pixel-perfect matching
  - Ensure all existing Next.js functionality is preserved
  - Ensure all existing tests pass
  - Ask the user if questions arise or if any visual discrepancies are found

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- All styling changes are CSS-only; no component logic or TypeScript interfaces are modified
- All existing Next.js features (Image optimization, routing, SSR) are preserved
- All existing functionality and tests continue to work without modification
