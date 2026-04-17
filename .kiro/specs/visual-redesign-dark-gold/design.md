# Design Document: Visual Redesign - Dark Theme with Gold Accents

## Overview

This design document outlines the technical approach for implementing a visual redesign of the REX DESIGN portfolio website. The redesign transforms the current light brutalist aesthetic into a premium dark theme with gold accents while preserving all existing functionality, component structure, and responsive behavior.

### Design Goals

- **Premium Dark Aesthetic**: Implement a sophisticated dark color scheme with black backgrounds and gold accents
- **Modern Typography**: Establish a bold, modern typographic system with large headings and clear hierarchy
- **Zero Functional Changes**: Modify only CSS/styling layer - no changes to JavaScript logic, React components, or API routes
- **Maintain Accessibility**: Ensure WCAG AAA compliance with proper contrast ratios
- **Preserve Responsiveness**: Keep all existing breakpoints and adaptive behaviors intact

### Scope

**In Scope:**
- CSS color scheme modifications (globals.css and all CSS Modules)
- Typography system updates (font sizes, weights, letter-spacing)
- UI element styling (buttons, forms, cards, navigation, footer)
- Hover states and visual transitions
- Admin panel styling
- Spacing adjustments for visual balance

**Out of Scope:**
- React component structure or JSX markup changes
- JavaScript/TypeScript logic modifications
- API routes or backend functionality
- Framer Motion animation logic (timing/easing may be adjusted)
- Component props or interfaces
- File/folder structure changes
- New features or functionality

## Architecture

### File Modification Strategy

The redesign follows a systematic approach to CSS modifications:

1. **Global Foundation** (`app/globals.css`)
   - Define CSS custom properties for the new color system
   - Update body background and text colors
   - Maintain existing resets and base styles

2. **Page-Level Styles** (CSS Modules in `app/` directory)
   - `app/page.module.css` - Homepage sections
   - `app/cases/page.module.css` - Portfolio cases page
   - `app/contact/page.module.css` - Contact page
   - Admin page modules in `app/admin/`

3. **Component Styles** (CSS Modules in `styles/` directory)
   - `styles/Navigation.module.css`
   - `styles/Footer.module.css`
   - `styles/ProjectCard.module.css`
   - `styles/ContactForm.module.css`
   - `styles/ProjectModal.module.css`
   - `styles/CustomCursor.module.css`
   - `styles/ManifestoCard.module.css`
   - `styles/SkillCard.module.css`
   - Admin component styles in `styles/admin/`

### CSS Variables System

Implement a centralized color system using CSS custom properties in `globals.css`:

```css
:root {
  /* Primary Colors - Dark Theme */
  --color-background-primary: #000000;
  --color-background-secondary: #0a0a0a;
  --color-background-tertiary: #1a1a1a;
  --color-background-elevated: #2a2a2a;
  
  /* Text Colors */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #E0E0E0;
  --color-text-tertiary: #B0B0B0;
  --color-text-muted: #808080;
  
  /* Gold Accent Colors */
  --color-gold-primary: #D4AF37;
  --color-gold-hover: #E5C158;
  --color-gold-active: #C5A572;
  
  /* Border Colors */
  --color-border-primary: #3a3a3a;
  --color-border-gold: #D4AF37;
  
  /* Overlay */
  --color-overlay: rgba(0, 0, 0, 0.8);
  
  /* Shadows */
  --shadow-gold-glow: 0 0 20px rgba(212, 175, 55, 0.3);
  --shadow-gold-glow-strong: 0 0 30px rgba(212, 175, 55, 0.5);
}
```

### Typography System

#### Font Families
- **Headings**: Continue using existing `var(--font-headline)` (likely Inter or similar sans-serif)
- **Body Text**: Continue using existing `var(--font-body)`
- No new font imports required

#### Type Scale

**Desktop:**
```css
/* Headings */
--font-size-h1: 48px;        /* Hero titles, main headings */
--font-size-h2: 36px;        /* Section titles */
--font-size-h3: 28px;        /* Subsection titles */
--font-size-h4: 24px;        /* Card titles */

/* Body */
--font-size-body-large: 18px;
--font-size-body: 16px;
--font-size-body-small: 14px;

/* UI Elements */
--font-size-button: 14px;
--font-size-label: 12px;
```

**Mobile:**
```css
--font-size-h1-mobile: 32px;
--font-size-h2-mobile: 28px;
--font-size-h3-mobile: 24px;
--font-size-h4-mobile: 20px;
```

#### Font Weights
- **Headings**: 700-900 (bold to black)
- **Body**: 400-500 (regular to medium)
- **Buttons/Labels**: 700 (bold)

#### Letter Spacing
- **Uppercase text**: 0.05em - 0.1em
- **Headings**: -0.02em (tight)
- **Body**: 0 (normal)

#### Line Heights
- **Headings**: 1.1 - 1.2
- **Body**: 1.6 - 1.8

## Components and Interfaces

### Navigation Component

**File**: `styles/Navigation.module.css`

**Changes:**
- Background: `var(--color-background-primary)` or `var(--color-background-secondary)`
- Logo color: `var(--color-text-primary)`
- Inactive links: `var(--color-text-tertiary)`
- Active links: `var(--color-gold-primary)`
- Hover states: `var(--color-gold-primary)`
- CTA button: Gold background with black text, inverts on hover
- Border: Replace black borders with gold or remove for cleaner look
- Mobile menu: Dark background with gold accents

**Specific Selectors:**
```css
.navigation {
  background-color: var(--color-background-primary);
  border-bottom: 1px solid var(--color-border-gold);
}

.logo {
  color: var(--color-text-primary);
}

.logo:hover {
  color: var(--color-gold-primary);
}

.navLink {
  color: var(--color-text-tertiary);
}

.navLink:hover,
.navLink.active {
  color: var(--color-gold-primary);
}

.ctaButton {
  background-color: var(--color-gold-primary);
  color: var(--color-background-primary);
  border: 2px solid var(--color-gold-primary);
}

.ctaButton:hover {
  background-color: var(--color-background-primary);
  color: var(--color-gold-primary);
}
```

### Footer Component

**File**: `styles/Footer.module.css`

**Changes:**
- Background: `var(--color-background-primary)`
- Logo: `var(--color-text-primary)`
- Social links: `var(--color-text-tertiary)`, hover to `var(--color-gold-primary)`
- Copyright text: `var(--color-text-muted)`
- Top border: 1px solid `var(--color-border-gold)`

### ProjectCard Component

**File**: `styles/ProjectCard.module.css`

**Changes:**
- Card background: `var(--color-background-tertiary)`
- Border: 1px solid `var(--color-border-primary)`
- Title: `var(--color-text-primary)`
- Description: `var(--color-text-secondary)`
- Badges: Gold background with black text
- Hover state: Gold border glow, image brightness increase
- Image overlay: Subtle dark gradient for text readability

**Specific Selectors:**
```css
.projectCard {
  background-color: var(--color-background-tertiary);
  border: 1px solid var(--color-border-primary);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.projectCard:hover {
  border-color: var(--color-border-gold);
  box-shadow: var(--shadow-gold-glow);
}

.projectCard:hover .projectImage {
  filter: brightness(1.15);
}

.title {
  color: var(--color-text-primary);
}

.description {
  color: var(--color-text-secondary);
}

.badge {
  background-color: var(--color-gold-primary);
  color: var(--color-background-primary);
}
```

### ContactForm Component

**File**: `styles/ContactForm.module.css`

**Changes:**
- Input/textarea background: `var(--color-background-tertiary)`
- Input border: `var(--color-border-primary)`
- Focus border: `var(--color-border-gold)`
- Text color: `var(--color-text-primary)`
- Placeholder: `var(--color-text-muted)`
- Label: `var(--color-text-secondary)`, uppercase
- Submit button: Gold background, black text
- Error states: Red accent (keep existing or use #FF6B6B)

**Specific Selectors:**
```css
.input,
.textarea,
.select {
  background-color: var(--color-background-tertiary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-primary);
  padding: 12px 16px;
}

.input:focus,
.textarea:focus,
.select:focus {
  border-color: var(--color-border-gold);
  outline: none;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

.input::placeholder,
.textarea::placeholder {
  color: var(--color-text-muted);
}

.label {
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 12px;
  font-weight: 700;
}

.submitButton {
  background-color: var(--color-gold-primary);
  color: var(--color-background-primary);
  border: none;
  padding: 16px 48px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.submitButton:hover {
  background-color: var(--color-gold-hover);
  box-shadow: var(--shadow-gold-glow);
}
```

### ProjectModal Component

**File**: `styles/ProjectModal.module.css`

**Changes:**
- Modal background: `var(--color-background-tertiary)`
- Modal border: 2px solid `var(--color-border-gold)`
- Overlay: `var(--color-overlay)`
- Title: `var(--color-text-primary)`
- Body text: `var(--color-text-secondary)`
- Close button: Gold color, hover to brighter gold
- Metadata badges: Gold background

### ManifestoCard & SkillCard Components

**Files**: `styles/ManifestoCard.module.css`, `styles/SkillCard.module.css`

**Changes:**
- Card background: `var(--color-background-tertiary)`
- Border: `var(--color-border-primary)` or gold accent
- Title: `var(--color-text-primary)`
- Description: `var(--color-text-secondary)`
- Icons: Gold color
- Hover: Gold border glow

### CustomCursor Component

**File**: `styles/CustomCursor.module.css`

**Changes:**
- Cursor dot: Gold color
- Cursor ring: Gold border
- Hover state: Larger gold ring with glow

### Admin Panel Components

**Files**: `styles/admin/Admin.module.css` and related admin styles

**Changes:**
- Layout background: `var(--color-background-primary)`
- Sidebar background: `var(--color-background-secondary)`
- Active sidebar item: Gold accent
- Header background: `var(--color-background-secondary)`
- Content area: `var(--color-background-primary)`
- Tables: Dark background with gold headers
- Forms: Same styling as public ContactForm
- Buttons: Gold primary, dark secondary
- Text: White/light gray throughout

## Data Models

No data model changes required. This redesign affects only the visual presentation layer.

## Error Handling

### CSS Fallbacks

Provide fallback values for CSS custom properties:

```css
.element {
  background-color: #000000; /* Fallback */
  background-color: var(--color-background-primary);
}
```

### Browser Compatibility

- Use standard CSS properties with broad support
- Avoid experimental features without fallbacks
- Test in Chrome, Firefox, Safari, Edge (last 2 versions)

### Contrast Validation

Ensure all text/background combinations meet WCAG AAA standards:
- Normal text (< 18px): 7:1 contrast ratio
- Large text (≥ 18px): 4.5:1 contrast ratio
- Gold on black: Verify with contrast checker tools

## Testing Strategy

### Visual Regression Testing

**Approach**: Manual visual inspection and screenshot comparison

**Test Cases:**
1. **Homepage**
   - Hero section with dark background and gold accents
   - Manifesto cards with new styling
   - Project grid with hover states
   - Contact section with form styling

2. **Cases Page**
   - Project cards grid layout
   - Hover interactions
   - Modal opening and styling

3. **Contact Page**
   - Form styling and validation states
   - Focus states on inputs

4. **Admin Panel**
   - Sidebar navigation with active states
   - Dashboard cards and stats
   - Project management forms
   - Tables and data displays

5. **Responsive Behavior**
   - Mobile navigation menu
   - Tablet breakpoint layouts
   - Desktop full-width layouts

### Accessibility Testing

**Tools:**
- Chrome DevTools Lighthouse (Accessibility audit)
- WAVE browser extension
- Manual keyboard navigation testing
- Screen reader testing (optional but recommended)

**Checklist:**
- [ ] All text meets contrast requirements
- [ ] Focus states are visible (gold outline)
- [ ] Keyboard navigation works correctly
- [ ] ARIA labels preserved
- [ ] Color is not the only means of conveying information

### Cross-Browser Testing

**Browsers to Test:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Test Points:**
- CSS custom properties support
- Flexbox and Grid layouts
- Transitions and animations
- Form styling

### Performance Testing

**Metrics to Monitor:**
- CSS file size increase (should be < 20%)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

**Tools:**
- Chrome DevTools Performance tab
- Lighthouse performance audit
- WebPageTest

## Implementation Plan

### Phase 1: Foundation (Priority: High)

**Objective**: Establish the core color system and typography

**Tasks:**
1. Update `app/globals.css` with CSS custom properties
2. Update body background and text colors
3. Test color system in browser
4. Update typography variables and base styles

**Estimated Effort**: 2-3 hours

**Validation**: Homepage displays with dark background and white text

### Phase 2: Navigation & Footer (Priority: High)

**Objective**: Update primary navigation components

**Tasks:**
1. Update `styles/Navigation.module.css`
   - Background, logo, links, CTA button
   - Hover states and active states
   - Mobile menu styling
2. Update `styles/Footer.module.css`
   - Background, logo, social links
   - Copyright text styling

**Estimated Effort**: 2-3 hours

**Validation**: Navigation and footer display correctly on all pages

### Phase 3: Homepage Sections (Priority: High)

**Objective**: Style all homepage sections

**Tasks:**
1. Update `app/page.module.css`
   - Hero section
   - Manifesto section
   - Projects section
   - Contact section
2. Update `styles/ManifestoCard.module.css`
3. Update contact layout styling

**Estimated Effort**: 3-4 hours

**Validation**: Homepage sections display with proper dark theme styling

### Phase 4: Project Components (Priority: High)

**Objective**: Style project-related components

**Tasks:**
1. Update `styles/ProjectCard.module.css`
   - Card background, borders, text
   - Hover states and transitions
   - Badge styling
2. Update `styles/ProjectModal.module.css`
   - Modal background and border
   - Overlay styling
   - Close button
3. Update `app/cases/page.module.css`

**Estimated Effort**: 2-3 hours

**Validation**: Project cards and modals display correctly with hover effects

### Phase 5: Forms (Priority: High)

**Objective**: Style all form elements

**Tasks:**
1. Update `styles/ContactForm.module.css`
   - Input, textarea, select styling
   - Focus states
   - Labels and placeholders
   - Submit button
   - Error states
2. Test form validation and submission

**Estimated Effort**: 2-3 hours

**Validation**: Forms are usable and accessible with proper styling

### Phase 6: Admin Panel (Priority: Medium)

**Objective**: Apply dark theme to admin interface

**Tasks:**
1. Update `styles/admin/Admin.module.css`
   - Layout and sidebar
   - Header and navigation
   - Content area
2. Update admin component styles
   - Tables
   - Forms
   - Buttons
   - Cards and stats

**Estimated Effort**: 3-4 hours

**Validation**: Admin panel is fully functional with dark theme

### Phase 7: Remaining Components (Priority: Medium)

**Objective**: Style remaining UI components

**Tasks:**
1. Update `styles/CustomCursor.module.css`
2. Update `styles/SkillCard.module.css`
3. Update any remaining CSS modules
4. Review and adjust spacing throughout

**Estimated Effort**: 2-3 hours

**Validation**: All components styled consistently

### Phase 8: Polish & Testing (Priority: High)

**Objective**: Refine details and ensure quality

**Tasks:**
1. Adjust spacing and alignment
2. Fine-tune hover transitions
3. Test all interactive elements
4. Run accessibility audit
5. Test on multiple browsers
6. Test responsive behavior on all breakpoints
7. Performance testing

**Estimated Effort**: 3-4 hours

**Validation**: All tests pass, no visual or functional issues

### Phase 9: Documentation (Priority: Medium)

**Objective**: Document changes for future reference

**Tasks:**
1. Create `VISUAL_REDESIGN.md` file
2. Document color palette
3. Document typography system
4. List all modified files
5. Provide customization instructions

**Estimated Effort**: 1-2 hours

**Validation**: Documentation is complete and accurate

## Dependencies and Constraints

### Dependencies

**Internal:**
- Existing CSS Modules structure
- CSS custom properties support in target browsers
- Current component JSX structure (must remain unchanged)

**External:**
- No external dependencies required
- No new npm packages needed

### Constraints

**Technical:**
- Cannot modify React component structure or props
- Cannot change JavaScript/TypeScript logic
- Must maintain existing breakpoints
- Must preserve all Framer Motion animations
- CSS file size increase limited to 20%

**Design:**
- Must maintain WCAG AAA accessibility standards
- Must preserve responsive behavior
- Must keep all existing functionality
- Gold color must have sufficient contrast on black

**Timeline:**
- Estimated total effort: 20-28 hours
- Recommended timeline: 1-2 weeks for implementation and testing

## Responsive Design Strategy

### Breakpoints (Preserved)

```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

### Mobile Considerations

- Reduce heading sizes appropriately
- Maintain touch target sizes (min 44x44px)
- Ensure mobile menu works with new colors
- Test form usability on small screens
- Verify gold accents are visible on mobile

### Tablet Considerations

- Adjust grid layouts for medium screens
- Ensure navigation transitions smoothly
- Test card layouts in 2-column grids

### Desktop Considerations

- Utilize full width for large screens
- Ensure hover states are prominent
- Test multi-column layouts

## Animation and Transitions

### Transition Timing

**Standard Transitions:**
```css
transition: all 0.3s ease-in-out;
```

**Quick Transitions (color changes):**
```css
transition: color 0.2s ease-in-out;
```

**Hover Effects:**
```css
transition: transform 0.3s ease, box-shadow 0.3s ease;
```

### Easing Functions

- **Standard**: `ease-in-out`
- **Hover enter**: `ease-out`
- **Hover exit**: `ease-in`

### Preserved Animations

- Framer Motion fadeIn animations
- Framer Motion slideUp animations
- Stagger delays for lists
- Page transition animations

**Note**: Only visual properties (timing, easing) may be adjusted. Animation logic remains unchanged.

## Accessibility Considerations

### Color Contrast

**Required Ratios:**
- Normal text on background: 7:1 (WCAG AAA)
- Large text on background: 4.5:1 (WCAG AAA)
- Gold (#D4AF37) on black (#000000): ~5.5:1 (meets AA, close to AAA)

**Validation:**
- Use WebAIM Contrast Checker
- Test all text/background combinations
- Ensure gold accents are readable

### Focus States

**Implementation:**
```css
.interactive-element:focus-visible {
  outline: 2px solid var(--color-gold-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.2);
}
```

### Keyboard Navigation

- Preserve all existing tab order
- Ensure focus states are visible
- Test keyboard-only navigation
- Verify modal trapping works

### Screen Reader Compatibility

- Preserve all ARIA labels
- Preserve all ARIA attributes
- Do not rely on color alone for information
- Ensure semantic HTML is maintained

## Performance Optimization

### CSS Optimization

**Strategies:**
1. Use CSS custom properties for reusability
2. Minimize selector specificity
3. Avoid redundant declarations
4. Group related styles
5. Use shorthand properties where appropriate

### File Size Management

**Targets:**
- CSS file size increase: < 20%
- Total CSS bundle: Monitor with build tools
- Minimize unused styles

### Loading Performance

**Considerations:**
- CSS is render-blocking: Keep files lean
- No additional font loading required
- No new image assets needed
- Leverage existing optimization

## Browser Compatibility

### Target Browsers

- Chrome 120+ (latest 2 versions)
- Firefox 120+ (latest 2 versions)
- Safari 17+ (latest 2 versions)
- Edge 120+ (latest 2 versions)

### CSS Features Used

**Fully Supported:**
- CSS Custom Properties (CSS Variables)
- Flexbox
- CSS Grid
- Transitions
- Transform
- Box-shadow
- RGBA colors

**Fallbacks Required:**
- Provide hex color fallbacks for CSS variables
- Test gradient support

### Testing Strategy

1. Test in Chrome DevTools device emulation
2. Test in actual browsers on different OS
3. Use BrowserStack for comprehensive testing (optional)
4. Validate with caniuse.com for feature support

## Risk Mitigation

### Potential Risks

1. **Contrast Issues**
   - Risk: Gold on black may not meet AAA standards
   - Mitigation: Test with contrast checker, adjust gold shade if needed

2. **Visual Regression**
   - Risk: Unintended styling changes
   - Mitigation: Systematic testing, screenshot comparison

3. **Performance Degradation**
   - Risk: CSS file size increase affects load time
   - Mitigation: Monitor bundle size, optimize selectors

4. **Browser Inconsistencies**
   - Risk: Styling differs across browsers
   - Mitigation: Cross-browser testing, use standard properties

5. **Accessibility Violations**
   - Risk: New colors fail accessibility standards
   - Mitigation: Automated and manual accessibility testing

### Rollback Plan

If critical issues arise:
1. Revert CSS changes via version control
2. Restore previous CSS files
3. Clear browser caches
4. Verify functionality restored

## Success Criteria

### Visual Quality

- [ ] Dark theme applied consistently across all pages
- [ ] Gold accents used appropriately for interactive elements
- [ ] Typography is clear and readable
- [ ] Spacing feels balanced and modern
- [ ] Hover states are smooth and noticeable

### Functionality

- [ ] All existing features work without changes
- [ ] Forms submit correctly
- [ ] Navigation works on all devices
- [ ] Modals open and close properly
- [ ] Admin panel fully functional

### Accessibility

- [ ] WCAG AAA contrast ratios met
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Screen reader compatible
- [ ] Lighthouse accessibility score ≥ 95

### Performance

- [ ] CSS file size increase < 20%
- [ ] No performance regression
- [ ] Page load times maintained
- [ ] Lighthouse performance score maintained

### Cross-Browser

- [ ] Works in Chrome (latest 2 versions)
- [ ] Works in Firefox (latest 2 versions)
- [ ] Works in Safari (latest 2 versions)
- [ ] Works in Edge (latest 2 versions)

### Responsive

- [ ] Mobile layout works correctly
- [ ] Tablet layout works correctly
- [ ] Desktop layout works correctly
- [ ] All breakpoints transition smoothly

## Maintenance and Future Considerations

### CSS Variable System Benefits

The centralized color system using CSS custom properties provides:
- Easy theme customization
- Consistent color usage
- Simple future color adjustments
- Potential for theme switching (light/dark toggle)

### Customization Guide

To adjust colors in the future:
1. Modify CSS variables in `app/globals.css`
2. Test contrast ratios
3. Verify across all components
4. Update documentation

### Potential Enhancements

Future improvements that could build on this redesign:
- Theme switcher (light/dark mode toggle)
- Additional color themes
- Animated gradient backgrounds
- Parallax effects
- Advanced micro-interactions

### Documentation

Create `VISUAL_REDESIGN.md` with:
- Complete color palette (hex codes)
- Typography system details
- List of all modified files
- Before/after screenshots
- Customization instructions
- Troubleshooting guide

## Conclusion

This design provides a comprehensive roadmap for transforming the REX DESIGN portfolio into a premium dark-themed experience with gold accents. By focusing exclusively on the visual layer and preserving all functionality, the redesign minimizes risk while delivering significant aesthetic improvements.

The systematic approach, starting with foundational elements and progressing through components, ensures a smooth implementation process. The emphasis on accessibility, performance, and cross-browser compatibility guarantees a high-quality result that serves all users effectively.

With proper testing and validation at each phase, this redesign will elevate the visual appeal of the portfolio while maintaining the robust functionality and user experience of the existing site.
