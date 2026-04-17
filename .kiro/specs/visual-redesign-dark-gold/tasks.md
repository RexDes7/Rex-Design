# Implementation Plan: Visual Redesign - Dark Theme with Gold Accents

## Overview

This implementation plan breaks down the visual redesign into discrete CSS modification tasks. The redesign transforms the REX DESIGN portfolio from a light brutalist aesthetic to a premium dark theme with gold accents. All changes are CSS-only - no React components, JavaScript logic, or API routes will be modified.

**Key Principles:**
- Modify only CSS files (globals.css and CSS Modules)
- Preserve all existing functionality and component structure
- Maintain responsive behavior and breakpoints
- Ensure WCAG AAA accessibility compliance
- Test incrementally after each phase

## Tasks

- [x] 1. Foundation - CSS Variables and Global Styles
  - [x] 1.1 Create CSS custom properties system in app/globals.css
    - Define color variables for dark theme (background-primary, background-secondary, background-tertiary, background-elevated)
    - Define text color variables (text-primary, text-secondary, text-tertiary, text-muted)
    - Define gold accent variables (gold-primary, gold-hover, gold-active)
    - Define border color variables (border-primary, border-gold)
    - Define shadow variables (shadow-gold-glow, shadow-gold-glow-strong)
    - _Requirements: 1.1, 1.2, 1.3, 2.1_
  
  - [x] 1.2 Update global body and base styles in app/globals.css
    - Apply dark background color to body element
    - Apply white text color to body element
    - Update selection colors to gold theme
    - Ensure base styles preserve existing resets
    - _Requirements: 1.1, 1.4, 1.5_
  
  - [x] 1.3 Create typography variables in app/globals.css
    - Define font size variables for headings (h1-h4) for desktop and mobile
    - Define font size variables for body text (large, regular, small)
    - Define font size variables for UI elements (button, label)
    - Define font weight variables
    - Define letter-spacing variables
    - Define line-height variables
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 2. Checkpoint - Verify foundation
  - Ensure all tests pass, verify CSS variables are defined correctly, check that body has dark background and white text, ask the user if questions arise.

- [x] 3. Navigation Component Styling
  - [x] 3.1 Update Navigation.module.css with dark theme colors
    - Apply dark background to navigation container
    - Apply gold border-bottom to navigation
    - Style logo with white color and gold hover state
    - Style navigation links with tertiary text color
    - Apply gold color to active and hover states of nav links
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 2.3, 2.4_
  
  - [x] 3.2 Style CTA button in Navigation.module.css
    - Apply gold background to CTA button
    - Apply black text color to CTA button
    - Create hover state with inverted colors (black background, gold text)
    - Add smooth transition (0.3s)
    - _Requirements: 7.6, 4.1, 4.3, 4.7, 2.2_
  
  - [x] 3.3 Update mobile menu styling in Navigation.module.css
    - Apply dark background to mobile menu
    - Apply gold accents to mobile menu items
    - Ensure hamburger icon uses appropriate colors
    - Preserve mobile menu functionality
    - _Requirements: 7.7, 13.5, 14.6_

- [x] 4. Footer Component Styling
  - [x] 4.1 Update Footer.module.css with dark theme
    - Apply dark background to footer container
    - Add gold top border (1px solid)
    - Style logo with white color
    - Style social links with tertiary text color
    - Apply gold hover state to social links
    - Style copyright text with muted color
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 5. Checkpoint - Verify navigation and footer
  - Ensure all tests pass, verify navigation and footer display correctly on all pages, test mobile menu functionality, ask the user if questions arise.

- [x] 6. Homepage Sections Styling
  - [x] 6.1 Update hero section in app/page.module.css
    - Apply dark background to hero section
    - Style hero heading with large typography and white color
    - Apply gold color to decorative "24" text
    - Update spacing for hero section (80px-120px vertical on desktop)
    - _Requirements: 1.4, 3.2, 12.1, 10.1, 10.3_
  
  - [x] 6.2 Update manifesto section in app/page.module.css
    - Apply appropriate background color
    - Update section heading styles
    - Adjust spacing between manifesto cards
    - _Requirements: 10.1, 10.3, 10.5_
  
  - [x] 6.3 Update projects section in app/page.module.css
    - Apply dark background
    - Style section heading
    - Adjust grid spacing for project cards
    - _Requirements: 10.1, 10.3, 10.5_
  
  - [x] 6.4 Update contact section in app/page.module.css
    - Apply appropriate background
    - Style section heading
    - Adjust spacing
    - _Requirements: 10.1, 10.3_

- [x] 7. ManifestoCard Component Styling
  - [x] 7.1 Update ManifestoCard.module.css with dark theme
    - Apply tertiary background color to cards
    - Apply primary border color or gold accent border
    - Style card title with white color
    - Style card description with secondary text color
    - Apply gold color to icons
    - Create hover state with gold border glow
    - Add smooth transitions (0.3s)
    - _Requirements: 1.5, 5.1, 5.2, 5.5, 5.6, 12.2, 12.4, 11.3_

- [x] 8. Checkpoint - Verify homepage sections
  - Ensure all tests pass, verify all homepage sections display correctly with dark theme, test responsive behavior on mobile and tablet, ask the user if questions arise.

- [x] 9. ProjectCard Component Styling
  - [x] 9.1 Update ProjectCard.module.css with dark theme
    - Apply tertiary background color to cards
    - Apply thin gold border (1px solid)
    - Style project title with white color
    - Style project description with secondary text color
    - _Requirements: 5.1, 5.2, 5.5, 5.6_
  
  - [x] 9.2 Create hover effects for ProjectCard.module.css
    - Increase image brightness by 10-20% on hover
    - Apply gold glow box-shadow on hover
    - Add smooth transitions (0.3s)
    - _Requirements: 5.3, 5.4, 11.3, 12.4_
  
  - [x] 9.3 Style project badges in ProjectCard.module.css
    - Apply gold background to badge elements
    - Apply black text color to badges
    - _Requirements: 5.7, 2.2_

- [x] 10. Cases Page Styling
  - [x] 10.1 Update app/cases/page.module.css
    - Apply dark background to cases page
    - Style page heading
    - Adjust grid layout spacing
    - Ensure project cards display correctly
    - _Requirements: 1.4, 10.1, 10.3, 10.5, 13.3_

- [x] 11. ProjectModal Component Styling
  - [x] 11.1 Update ProjectModal.module.css with dark theme
    - Apply tertiary background to modal container
    - Apply 2px solid gold border to modal
    - Apply semi-transparent black overlay (rgba(0,0,0,0.8))
    - Style modal title with white color
    - Style modal body text with secondary text color
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 11.2 Style modal close button in ProjectModal.module.css
    - Apply gold color to close button
    - Create hover state with brighter gold
    - Add smooth transition
    - _Requirements: 9.6, 9.7, 11.4_
  
  - [x] 11.3 Style modal metadata badges
    - Apply gold background to metadata badges
    - Apply black text color
    - _Requirements: 2.2_

- [x] 12. Checkpoint - Verify project components
  - Ensure all tests pass, verify project cards and modals display correctly, test hover interactions, test modal open/close functionality, ask the user if questions arise.

- [x] 13. ContactForm Component Styling
  - [x] 13.1 Update input and textarea styles in ContactForm.module.css
    - Apply tertiary background to input and textarea elements
    - Apply light gray border (border-primary)
    - Apply white text color
    - Apply muted color to placeholder text
    - Set padding to 12px-16px
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6_
  
  - [x] 13.2 Create focus states for form inputs in ContactForm.module.css
    - Apply gold border on focus
    - Add gold glow box-shadow on focus
    - Remove default outline
    - Add smooth transition
    - _Requirements: 6.3, 11.3_
  
  - [x] 13.3 Style form labels in ContactForm.module.css
    - Apply secondary text color to labels
    - Apply uppercase transformation
    - Set letter-spacing to 0.1em
    - Set font-size to 12px
    - Set font-weight to 700
    - _Requirements: 3.6, 3.7_
  
  - [x] 13.4 Style submit button in ContactForm.module.css
    - Apply gold background
    - Apply black text color
    - Set padding to 16px 48px
    - Apply uppercase transformation
    - Set letter-spacing to 0.1em
    - Set font-weight to 700
    - Create hover state with brighter gold and glow
    - Add smooth transition (0.3s)
    - _Requirements: 6.7, 4.1, 4.3, 4.7, 11.3_
  
  - [x] 13.5 Style error states in ContactForm.module.css
    - Preserve existing error state logic
    - Apply appropriate error color (red accent)
    - Ensure error messages are visible on dark background
    - _Requirements: 14.5_

- [x] 14. SkillCard Component Styling
  - [x] 14.1 Update SkillCard.module.css with dark theme
    - Apply tertiary background color
    - Apply border (primary or gold accent)
    - Style title with white color
    - Style description with secondary text color
    - Apply gold color to icons
    - Create hover state with gold border glow
    - Add smooth transitions
    - _Requirements: 1.5, 5.1, 5.2, 5.5, 5.6, 12.2, 12.4, 11.3_

- [x] 15. CustomCursor Component Styling
  - [x] 15.1 Update CustomCursor.module.css with gold theme
    - Apply gold color to cursor dot
    - Apply gold border to cursor ring
    - Create hover state with larger gold ring and glow
    - Add smooth transitions
    - Preserve cursor functionality
    - _Requirements: 2.4, 12.4, 14.8_

- [x] 16. Checkpoint - Verify forms and remaining components
  - Ensure all tests pass, verify contact form styling and functionality, test form validation and submission, verify skill cards and custom cursor, ask the user if questions arise.

- [x] 17. Admin Panel Layout Styling
  - [x] 17.1 Update admin layout styles
    - Apply primary background to main layout
    - Apply secondary background to sidebar
    - Apply secondary background to header
    - Ensure proper spacing and layout structure
    - _Requirements: 16.1, 1.4_
  
  - [x] 17.2 Style admin sidebar navigation
    - Apply tertiary text color to inactive sidebar items
    - Apply gold color to active sidebar items
    - Create hover states with gold color
    - Add smooth transitions
    - _Requirements: 16.2, 2.3, 2.4, 11.3_
  
  - [x] 17.3 Style admin header
    - Apply white color to header text
    - Apply gold accents to header actions
    - Ensure proper contrast
    - _Requirements: 16.6_

- [x] 18. Admin Panel Component Styling
  - [x] 18.1 Update admin table styles
    - Apply tertiary background to tables
    - Apply gold color to table headers
    - Apply white color to table text
    - Apply border colors appropriately
    - _Requirements: 16.3, 16.6_
  
  - [x] 18.2 Update admin form styles
    - Apply same styling as public ContactForm
    - Ensure inputs have tertiary background
    - Ensure focus states use gold border
    - Style submit buttons with gold background
    - _Requirements: 16.3, 6.1, 6.2, 6.3, 6.7_
  
  - [x] 18.3 Update admin button styles
    - Apply gold background to primary buttons
    - Apply dark background with border to secondary buttons
    - Create appropriate hover states
    - Add smooth transitions
    - _Requirements: 16.4, 4.1, 4.2, 4.3, 4.4, 4.7_
  
  - [x] 18.4 Style admin cards and stats
    - Apply tertiary background to cards
    - Apply gold accents to important metrics
    - Apply white color to card text
    - _Requirements: 16.3, 16.6_
  
  - [x] 18.5 Verify admin component functionality
    - Ensure ContentEditor works correctly
    - Ensure ProjectForm works correctly
    - Ensure ImageUploader works correctly
    - Ensure all admin components preserve functionality
    - _Requirements: 16.5, 14.7_

- [x] 19. Checkpoint - Verify admin panel
  - Ensure all tests pass, verify admin panel displays correctly with dark theme, test all admin functionality (login, content editing, project management), ask the user if questions arise.

- [x] 20. Decorative Elements and Polish
  - [x] 20.1 Update decorative elements across all pages
    - Apply gold color to Material Symbols icons
    - Apply gold color to section dividers (1px lines)
    - Ensure decorative positioning is preserved
    - _Requirements: 12.2, 12.3, 12.5_
  
  - [x] 20.2 Fine-tune spacing and alignment
    - Review vertical spacing between sections (80px-120px desktop, 60px-80px mobile)
    - Review section padding (40px-60px desktop, 24px-32px mobile)
    - Review card spacing (24px-32px gaps)
    - Adjust any spacing inconsistencies
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 20.3 Refine hover transitions and animations
    - Verify all hover transitions are smooth (0.3s ease-in-out)
    - Verify color transitions are quick (0.2s)
    - Ensure gold color transitions are consistent
    - Preserve Framer Motion animation logic
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [x] 20.4 Review and adjust animation styles
    - Verify fadeIn animations work with dark theme
    - Verify slideUp animations work with dark theme
    - Verify stagger delays are appropriate
    - Ensure animation timing feels smooth
    - _Requirements: 11.1, 11.6, 14.4_

- [x] 21. Accessibility Compliance Testing
  - [x] 21.1 Run automated accessibility audit
    - Run Chrome DevTools Lighthouse accessibility audit
    - Run WAVE browser extension scan
    - Document any issues found
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [x] 21.2 Verify contrast ratios
    - Test white text on black background (should be 21:1)
    - Test gold (#D4AF37) on black background (should be ~5.5:1)
    - Test all text/background combinations
    - Use WebAIM Contrast Checker tool
    - Ensure all combinations meet WCAG AAA standards
    - _Requirements: 1.3, 17.1, 17.2, 17.3_
  
  - [x] 21.3 Test keyboard navigation
    - Test tab order through all interactive elements
    - Verify focus states are visible (gold outline)
    - Test modal keyboard trapping
    - Test form navigation
    - Ensure all interactive elements are keyboard accessible
    - _Requirements: 17.6, 14.3_
  
  - [x] 21.4 Verify ARIA attributes preservation
    - Confirm all aria-label attributes are unchanged
    - Confirm all aria-hidden attributes are unchanged
    - Verify screen reader compatibility
    - _Requirements: 17.4, 17.5_

- [x] 22. Cross-Browser Testing
  - [x] 22.1 Test in Chrome (latest 2 versions)
    - Verify color rendering
    - Verify CSS custom properties work
    - Verify transitions and animations
    - Verify responsive behavior
    - _Requirements: 19.1_
  
  - [x] 22.2 Test in Firefox (latest 2 versions)
    - Verify color rendering
    - Verify CSS custom properties work
    - Verify transitions and animations
    - Verify responsive behavior
    - _Requirements: 19.2_
  
  - [x] 22.3 Test in Safari (latest 2 versions)
    - Verify color rendering
    - Verify CSS custom properties work
    - Verify transitions and animations
    - Verify responsive behavior
    - _Requirements: 19.3_
  
  - [x] 22.4 Test in Edge (latest 2 versions)
    - Verify color rendering
    - Verify CSS custom properties work
    - Verify transitions and animations
    - Verify responsive behavior
    - _Requirements: 19.4_
  
  - [x] 22.5 Verify CSS fallbacks
    - Ensure fallback hex colors are provided for CSS variables
    - Test in browsers with limited CSS support
    - _Requirements: 19.5_

- [x] 23. Responsive Design Testing
  - [x] 23.1 Test mobile layout (< 768px)
    - Verify dark theme applies correctly
    - Verify typography scales appropriately
    - Verify mobile menu works
    - Verify touch targets are adequate (min 44x44px)
    - Verify spacing is appropriate (60px-80px sections, 24px-32px padding)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 10.2, 10.4_
  
  - [x] 23.2 Test tablet layout (768px - 1024px)
    - Verify dark theme applies correctly
    - Verify typography scales appropriately
    - Verify grid layouts work (2-column)
    - Verify navigation transitions smoothly
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [x] 23.3 Test desktop layout (> 1024px)
    - Verify dark theme applies correctly
    - Verify typography is large and readable
    - Verify hover states are prominent
    - Verify multi-column layouts work
    - Verify spacing is generous (80px-120px sections, 40px-60px padding)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 10.1, 10.3_
  
  - [x] 23.4 Verify breakpoint transitions
    - Test smooth transitions between breakpoints
    - Verify no layout shifts or jumps
    - Verify grid restructuring works correctly
    - _Requirements: 10.7, 13.2_

- [x] 24. Performance Testing
  - [x] 24.1 Measure CSS file size increase
    - Compare original CSS file sizes to new sizes
    - Ensure increase is less than 20%
    - Document file size changes
    - _Requirements: 18.1_
  
  - [x] 24.2 Run Lighthouse performance audit
    - Measure First Contentful Paint (FCP)
    - Measure Largest Contentful Paint (LCP)
    - Measure Cumulative Layout Shift (CLS)
    - Ensure no performance regression
    - _Requirements: 18.1_
  
  - [x] 24.3 Optimize CSS if needed
    - Review CSS for redundant declarations
    - Optimize selector specificity
    - Group related styles
    - Use shorthand properties where appropriate
    - _Requirements: 18.2, 18.4_
  
  - [x] 24.4 Verify CSS variables usage
    - Confirm CSS custom properties are used consistently
    - Verify color system is centralized
    - Ensure easy maintainability
    - _Requirements: 18.2_

- [x] 25. Final Checkpoint - Comprehensive Testing
  - Ensure all tests pass, verify all pages display correctly with dark theme, test all interactive elements and functionality, verify accessibility compliance, verify cross-browser compatibility, verify responsive behavior on all devices, ask the user if questions arise.

- [x] 26. Documentation
  - [x] 26.1 Create VISUAL_REDESIGN.md file
    - Document complete color palette with hex codes
    - Document typography system (fonts, sizes, weights, spacing)
    - List all modified CSS files
    - Provide before/after comparison notes
    - _Requirements: 20.1, 20.2, 20.3, 20.4_
  
  - [x] 26.2 Add customization instructions to documentation
    - Explain how to modify CSS variables for future changes
    - Provide guidance on maintaining color contrast
    - Document the CSS variable system structure
    - Include troubleshooting tips
    - _Requirements: 20.5_

## Notes

- All tasks focus exclusively on CSS modifications - no React, JavaScript, or API changes
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and catch issues early
- Testing tasks verify that visual changes don't break functionality
- The implementation preserves all existing features while transforming the visual aesthetic
- CSS custom properties provide a maintainable, centralized color system
- Accessibility and performance are validated throughout the process
