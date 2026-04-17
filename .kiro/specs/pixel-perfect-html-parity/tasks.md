# Implementation Plan: Pixel-Perfect HTML Parity

## Overview

This implementation plan focuses on correcting specific CSS values to achieve exact visual matching between the Next.js implementation and the original HTML files. The approach involves updating CSS modules and globals.css with precise shadow, border, typography, padding, and hover effect values.

## Tasks

- [x] 1. Update shadow system in globals.css
  - Update CSS custom properties for shadow values
  - Define --shadow-brutal-sm as 4px 4px 0px 0px #000000
  - Define --shadow-brutal as 8px 8px 0px 0px #000000
  - Define --shadow-brutal-hover as 12px 12px 0px 0px #000000
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 1.1 Write property test for shadow value consistency
  - **Property 1: Shadow Value Consistency**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.5**

- [x] 2. Update Navigation component active link styling
  - Update Navigation.module.css with correct underline offset (8px)
  - Update underline thickness to 4px
  - Ensure black color (#000000) for active links
  - Verify styling consistency across viewport sizes
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2.1 Write property tests for navigation active link styling
  - **Property 2: Navigation Active Link Styling**
  - **Validates: Requirements 2.1, 2.2, 2.3**
  - **Property 3: Navigation Styling Viewport Consistency**
  - **Validates: Requirement 2.4**

- [x] 3. Update Hero section typography and spacing
  - Update Home.module.css with 5rem (80px) vertical padding
  - Set mobile title font size to 6rem (96px)
  - Set desktop title font size to 8rem (128px)
  - Set mobile subtitle to 1.25rem (20px)
  - Set desktop subtitle to 1.5rem (24px)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Update Manifesto card styling
  - Update ManifestoCard.module.css with 3rem (48px) padding
  - Set number font size to 6rem (96px)
  - Set default number opacity to 0.1
  - Set hover number opacity to 1.0
  - Ensure padding consistency across viewport sizes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 4.1 Write property tests for manifesto card styling
  - **Property 4: Manifesto Card Hover Opacity**
  - **Validates: Requirement 4.4**
  - **Property 5: Manifesto Card Padding Consistency**
  - **Validates: Requirement 4.5**

- [x] 5. Update Project card border and shadow effects
  - Update ProjectCard.module.css with 4px solid black border
  - Set default shadow to 8px 8px 0px 0px #000000
  - Set hover shadow to 12px 12px 0px 0px #000000
  - Set hover transform to translate(-4px, -4px)
  - Ensure border width remains 4px during hover
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.1 Write property tests for project card effects
  - **Property 6: Project Card Hover Effects**
  - **Validates: Requirements 5.3, 5.4**
  - **Property 7: Project Card Border Invariant**
  - **Validates: Requirement 5.5**

- [x] 6. Update Contact form input styling
  - Update ContactForm.module.css with 4px border width
  - Set mobile input font size to 2.25rem (36px)
  - Set desktop input font size to 3rem (48px)
  - Ensure consistent border styling across all inputs
  - Apply black (#000000) border color
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 6.1 Write property test for contact form border consistency
  - **Property 8: Contact Form Border Consistency**
  - **Validates: Requirements 6.1, 6.4, 6.5**

- [x] 7. Update Footer background and link hover effects
  - Update Footer.module.css with #f5f5f4 (stone-100) background
  - Apply italic font style on social link hover
  - Apply scale(1.05) transform on social link hover
  - Ensure background consistency across viewport sizes
  - Apply hover effects to all social links
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7.1 Write property tests for footer styling
  - **Property 9: Footer Background Viewport Consistency**
  - **Validates: Requirement 7.4**
  - **Property 10: Footer Social Link Hover Effects**
  - **Validates: Requirements 7.2, 7.3**
  - **Property 11: Footer Social Links Have Hover Styles**
  - **Validates: Requirement 7.5**

- [x] 8. Checkpoint - Verify all CSS corrections
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement responsive typography scaling system
  - Verify mobile typography applies below 768px viewport
  - Verify desktop typography applies at 768px and above
  - Ensure consistent scaling across all components
  - Test smooth transitions between breakpoints
  - Verify text readability at all viewport sizes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 9.1 Write property test for responsive typography scaling
  - **Property 12: Responsive Typography Scaling**
  - **Validates: Requirements 9.1, 9.2, 9.3**

- [x] 10. Verify hover effect consistency across components
  - Ensure hover effects apply within 200ms
  - Verify hardware-accelerated transforms are used
  - Check shadow progression (8px → 12px) consistency
  - Verify transform value consistency
  - Test hover effects across supported browsers
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 10.1 Write property tests for hover effect consistency
  - **Property 13: Hardware-Accelerated Hover Transforms**
  - **Validates: Requirement 10.2**
  - **Property 14: Hover Shadow Progression Consistency**
  - **Validates: Requirement 10.3**
  - **Property 15: Hover Transform Consistency**
  - **Validates: Requirement 10.4**

- [x] 11. Final checkpoint - Visual comparison with original HTML
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Focus on CSS-only corrections without JavaScript changes
- All shadow values must match original HTML specifications (4px, 8px, 12px)
- Border widths must be consistently 4px across all components
- Hover effects must use hardware-accelerated transforms for performance
