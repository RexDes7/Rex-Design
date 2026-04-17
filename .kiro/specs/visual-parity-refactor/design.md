# Design Document: Visual Parity Refactor

## Overview

This design document details the technical approach for refactoring the Next.js brutalist portfolio to achieve pixel-perfect visual parity with the original HTML files. The refactoring focuses exclusively on visual design while preserving all existing Next.js functionality, TypeScript types, and component architecture.

### Design Goals

1. Achieve pixel-perfect visual matching with original HTML files
2. Maintain all existing Next.js optimizations (Image, routing, SSR)
3. Preserve all existing functionality and tests
4. Use CSS Modules to replicate Tailwind utility classes
5. Ensure responsive behavior matches exactly across all breakpoints

### Scope

This refactoring affects:
- All CSS Module files (styles/*.module.css, app/**/*.module.css)
- Global styles (styles/globals.css)
- No changes to component logic, props, or TypeScript interfaces
- No changes to routing, data fetching, or business logic

## Architecture

### High-Level Design

The refactoring follows a systematic CSS translation approach:

```
Original HTML (Tailwind) → CSS Modules (Custom Properties + Classes)
```

**Key Architectural Decisions:**

1. **CSS Custom Properties for Design Tokens**: Define all colors, spacing, typography, and shadows as CSS custom properties in globals.css
2. **Utility-First CSS Modules**: Create utility classes in CSS Modules that mirror Tailwind's naming conventions
3. **Component-Scoped Styles**: Each component maintains its own CSS Module with scoped styles
4. **Zero Border Radius**: All elements use border-radius: 0px (brutalist aesthetic)
5. **Hard Shadows**: Implement brutalist shadows using box-shadow with 0px blur

### Design System Foundation

The design is built on these core systems:

1. **Typography System**: Plus Jakarta Sans (headlines) + Space Grotesk (body/labels)
2. **Color System**: 50+ semantic colors from Tailwind config
3. **Border System**: Consistent 2px, 3px, 4px, 6px borders
4. **Shadow System**: Hard shadows (4px, 8px, 16px offsets with 0px blur)
5. **Spacing System**: Tailwind-compatible spacing scale
6. **Grid System**: CSS Grid with responsive breakpoints

## Components and Interfaces

### Component Hierarchy

```
App Layout
├── Navigation (Header)
├── Page Components
│   ├── Home Page
│   │   ├── Hero Section
│   │   ├── Manifesto Grid (ManifestoCard × 3)
│   │   ├── Featured Projects (ProjectCard × multiple)
│   │   └── Contact Section (ContactForm)
│   ├── Cases Page
│   │   ├── Hero Section
│   │   ├── Filter Bar
│   │   └── Project Grid (ProjectCard × multiple)
│   ├── About Page
│   │   ├── Hero Section with Portrait
│   │   ├── Skills Grid (SkillCard × multiple)
│   │   └── CTA Section
│   └── Contact Page
│       ├── Hero Section
│       ├── Contact Form (ContactForm)
│       └── Info Sidebar
└── Footer
```

### Component Design Specifications

#### Navigation Component

**File**: `components/Navigation.tsx` + `styles/Navigation.module.css`

**Visual Specifications**:
- Position: sticky, top: 0, z-index: 50
- Background: white
- Border: border-bottom 4px solid black
- Padding: 24px 48px (desktop), 24px 24px (mobile)
- Logo: font-size 30px, font-weight 900, letter-spacing -0.05em
- Links: font-size 20px, font-weight 900, uppercase, letter-spacing -0.05em
- Active link: underline 4px, offset 8px
- Button: bg #ffd709, border 3px solid black, shadow 4px 4px 0px 0px black

**Hover States**:
- Links: background #ffd709, color black, transition 100ms
- Button: background black, color white, transition 200ms
- Button active: translate(1px, 1px), shadow none

**Responsive Behavior**:
- Mobile: Hide navigation links (display: none)
- Desktop (≥768px): Show navigation links (display: flex)

#### Footer Component

**File**: `components/Footer.tsx` + `styles/Footer.module.css`

**Visual Specifications**:
- Background: #f5f5f4 (stone-100)
- Border: border-top 4px solid black
- Padding: 48px 48px (desktop), 48px 24px (mobile)
- Logo: font-size 36px, font-weight 900
- Social links: font-size 14px, font-weight 700, uppercase, letter-spacing 0.1em
- Copyright: font-size 14px, font-weight 700, opacity 0.6

**Hover States**:
- Social links: font-style italic, scale 1.05, transition 200ms

**Responsive Behavior**:
- Mobile: flex-direction column, gap 32px
- Desktop: flex-direction row, justify-content space-between

#### ProjectCard Component

**File**: `components/ProjectCard.tsx` + `styles/ProjectCard.module.css`

**Visual Specifications**:
- Background: white
- Border: 4px solid black
- Shadow: 8px 8px 0px 0px black
- Image container: aspect-ratio 1/1, background #e1e3e3, border-bottom 4px solid black
- Image filter: grayscale(100%)
- Title: font-size 30px, font-weight 900, uppercase, letter-spacing -0.05em
- Category badge: background black, color white, padding 4px 8px, font-size 12px
- Description: font-size 14px, font-weight 700, uppercase, opacity 0.7

**Hover States**:
- Card: translate(-8px, -8px), shadow 16px 16px 0px 0px black, transition 500ms
- Image: grayscale(0%), transition 500ms

**Variants**:
- Standard: white background
- Featured: #ffd709 background
- Dark: black background, white text

#### ManifestoCard Component

**File**: `components/ManifestoCard.tsx` + `styles/ManifestoCard.module.css`

**Visual Specifications**:
- Padding: 48px
- Border: 4px solid black
- Background: white
- Number: font-size 96px, font-weight 900, color rgba(0,0,0,0.1)
- Title: font-size 30px, font-weight 900, uppercase
- Description: font-size 18px, line-height 1.4

**Hover States**:
- Card: background #ffd709, transition 200ms
- Number: color black, transition 200ms

#### ContactForm Component

**File**: `components/ContactForm.tsx` + `styles/ContactForm.module.css`

**Visual Specifications**:
- Field groups: border-bottom 4px solid black, padding 8px
- Labels: font-size 24px, font-weight 900, uppercase
- Inputs: font-size 48px (desktop), 36px (mobile), font-weight 900, uppercase
- Textarea: font-size 36px, font-weight 900, resize none
- Submit button: background black, color #ffd709, padding 32px 48px, font-size 48px, border 6px solid black

**Focus States**:
- Field groups: background #ffd709, transition 200ms

**Hover States**:
- Submit button: shadow 8px 8px 0px 0px black, transition 200ms

#### SkillCard Component

**File**: `components/SkillCard.tsx` + `styles/SkillCard.module.css`

**Visual Specifications**:
- Border: 2px solid black
- Padding: 32px
- Skill name: font-size 36px, font-weight 900
- Description: font-size 14px, uppercase, opacity 0.6

**Hover States**:
- Card: background #ffd709, transition 200ms
- Skill name: scale 1.1, transform-origin left, transition 200ms

**Variants**:
- Light: white background
- Dark: black background, white text (inverts on hover)

## Data Models

No data model changes are required for this refactoring. All existing TypeScript interfaces and props remain unchanged:

```typescript
// Existing interfaces remain the same
interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
  variant?: 'standard' | 'featured' | 'dark';
}

interface ManifestoCardProps {
  number: string;
  title: string;
  description: string;
}

interface SkillCardProps {
  name: string;
  description: string;
  variant?: 'light' | 'dark';
}
```


## CSS Class Mapping from Tailwind to CSS Modules

### Typography Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `font-headline` | `.fontHeadline` | `font-family: 'Plus Jakarta Sans', sans-serif` |
| `font-body` | `.fontBody` | `font-family: 'Space Grotesk', sans-serif` |
| `font-label` | `.fontLabel` | `font-family: 'Space Grotesk', sans-serif` |
| `font-black` | `.fontBlack` | `font-weight: 900` |
| `font-bold` | `.fontBold` | `font-weight: 700` |
| `font-medium` | `.fontMedium` | `font-weight: 500` |
| `text-6xl` | `.text6xl` | `font-size: 3.75rem; line-height: 1` |
| `text-8xl` | `.text8xl` | `font-size: 6rem; line-height: 1` |
| `text-9xl` | `.text9xl` | `font-size: 8rem; line-height: 1` |
| `text-5xl` | `.text5xl` | `font-size: 3rem; line-height: 1` |
| `text-4xl` | `.text4xl` | `font-size: 2.25rem; line-height: 2.5rem` |
| `text-3xl` | `.text3xl` | `font-size: 1.875rem; line-height: 2.25rem` |
| `text-2xl` | `.text2xl` | `font-size: 1.5rem; line-height: 2rem` |
| `text-xl` | `.textXl` | `font-size: 1.25rem; line-height: 1.75rem` |
| `text-lg` | `.textLg` | `font-size: 1.125rem; line-height: 1.75rem` |
| `text-sm` | `.textSm` | `font-size: 0.875rem; line-height: 1.25rem` |
| `text-xs` | `.textXs` | `font-size: 0.75rem; line-height: 1rem` |
| `uppercase` | `.uppercase` | `text-transform: uppercase` |
| `tracking-tighter` | `.trackingTighter` | `letter-spacing: -0.05em` |
| `tracking-widest` | `.trackingWidest` | `letter-spacing: 0.1em` |
| `leading-none` | `.leadingNone` | `line-height: 1` |
| `leading-tight` | `.leadingTight` | `line-height: 1.25` |
| `leading-snug` | `.leadingSnug` | `line-height: 1.375` |
| `leading-[0.85]` | `.leadingCustom85` | `line-height: 0.85` |
| `leading-[0.9]` | `.leadingCustom9` | `line-height: 0.9` |

### Color Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `bg-primary-fixed` | `.bgPrimaryFixed` | `background-color: var(--primary-fixed)` |
| `bg-primary-container` | `.bgPrimaryContainer` | `background-color: var(--primary-container)` |
| `bg-surface` | `.bgSurface` | `background-color: var(--surface)` |
| `bg-surface-container-low` | `.bgSurfaceContainerLow` | `background-color: var(--surface-container-low)` |
| `bg-surface-container-high` | `.bgSurfaceContainerHigh` | `background-color: var(--surface-container-high)` |
| `bg-surface-container-highest` | `.bgSurfaceContainerHighest` | `background-color: var(--surface-container-highest)` |
| `bg-white` | `.bgWhite` | `background-color: #ffffff` |
| `bg-black` | `.bgBlack` | `background-color: #000000` |
| `bg-stone-100` | `.bgStone100` | `background-color: #f5f5f4` |
| `text-black` | `.textBlack` | `color: #000000` |
| `text-white` | `.textWhite` | `color: #ffffff` |
| `text-black/60` | `.textBlackOpacity60` | `color: rgba(0, 0, 0, 0.6)` |
| `text-white/60` | `.textWhiteOpacity60` | `color: rgba(255, 255, 255, 0.6)` |
| `text-on-surface` | `.textOnSurface` | `color: var(--on-surface)` |
| `text-primary-container` | `.textPrimaryContainer` | `color: var(--primary-container)` |

### Border Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `border-[2px]` | `.border2` | `border-width: 2px; border-style: solid` |
| `border-[3px]` | `.border3` | `border-width: 3px; border-style: solid` |
| `border-[4px]` | `.border4` | `border-width: 4px; border-style: solid` |
| `border-[6px]` | `.border6` | `border-width: 6px; border-style: solid` |
| `border-black` | `.borderBlack` | `border-color: #000000` |
| `border-t-[4px]` | `.borderTop4` | `border-top-width: 4px; border-top-style: solid` |
| `border-b-[4px]` | `.borderBottom4` | `border-bottom-width: 4px; border-bottom-style: solid` |
| `border-r-[4px]` | `.borderRight4` | `border-right-width: 4px; border-right-style: solid` |
| `border-l-[4px]` | `.borderLeft4` | `border-left-width: 4px; border-left-style: solid` |

### Shadow Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `brutal-shadow` | `.brutalShadow` | `box-shadow: 8px 8px 0px 0px #000000` |
| `brutal-shadow-sm` | `.brutalShadowSm` | `box-shadow: 4px 4px 0px 0px #000000` |
| `hard-shadow` | `.hardShadow` | `box-shadow: 8px 8px 0px 0px #000000` |
| `hard-shadow-sm` | `.hardShadowSm` | `box-shadow: 4px 4px 0px 0px #000000` |
| `shadow-[16px_16px_0px_0px_#000000]` | `.shadowLarge` | `box-shadow: 16px 16px 0px 0px #000000` |

### Spacing Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `p-2` | `.p2` | `padding: 0.5rem` |
| `p-4` | `.p4` | `padding: 1rem` |
| `p-6` | `.p6` | `padding: 1.5rem` |
| `p-8` | `.p8` | `padding: 2rem` |
| `p-12` | `.p12` | `padding: 3rem` |
| `px-6` | `.px6` | `padding-left: 1.5rem; padding-right: 1.5rem` |
| `px-12` | `.px12` | `padding-left: 3rem; padding-right: 3rem` |
| `py-4` | `.py4` | `padding-top: 1rem; padding-bottom: 1rem` |
| `py-6` | `.py6` | `padding-top: 1.5rem; padding-bottom: 1.5rem` |
| `py-8` | `.py8` | `padding-top: 2rem; padding-bottom: 2rem` |
| `py-16` | `.py16` | `padding-top: 4rem; padding-bottom: 4rem` |
| `py-20` | `.py20` | `padding-top: 5rem; padding-bottom: 5rem` |
| `py-24` | `.py24` | `padding-top: 6rem; padding-bottom: 6rem` |
| `gap-4` | `.gap4` | `gap: 1rem` |
| `gap-8` | `.gap8` | `gap: 2rem` |
| `gap-12` | `.gap12` | `gap: 3rem` |
| `space-y-8` | `.spaceY8` | `> * + * { margin-top: 2rem }` |
| `space-y-12` | `.spaceY12` | `> * + * { margin-top: 3rem }` |

### Layout Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `grid` | `.grid` | `display: grid` |
| `grid-cols-1` | `.gridCols1` | `grid-template-columns: repeat(1, minmax(0, 1fr))` |
| `grid-cols-2` | `.gridCols2` | `grid-template-columns: repeat(2, minmax(0, 1fr))` |
| `grid-cols-3` | `.gridCols3` | `grid-template-columns: repeat(3, minmax(0, 1fr))` |
| `grid-cols-5` | `.gridCols5` | `grid-template-columns: repeat(5, minmax(0, 1fr))` |
| `grid-cols-12` | `.gridCols12` | `grid-template-columns: repeat(12, minmax(0, 1fr))` |
| `col-span-2` | `.colSpan2` | `grid-column: span 2 / span 2` |
| `col-span-4` | `.colSpan4` | `grid-column: span 4 / span 4` |
| `col-span-5` | `.colSpan5` | `grid-column: span 5 / span 5` |
| `col-span-7` | `.colSpan7` | `grid-column: span 7 / span 7` |
| `col-span-8` | `.colSpan8` | `grid-column: span 8 / span 8` |
| `flex` | `.flex` | `display: flex` |
| `flex-col` | `.flexCol` | `flex-direction: column` |
| `flex-row` | `.flexRow` | `flex-direction: row` |
| `items-center` | `.itemsCenter` | `align-items: center` |
| `items-start` | `.itemsStart` | `align-items: flex-start` |
| `items-end` | `.itemsEnd` | `align-items: flex-end` |
| `justify-between` | `.justifyBetween` | `justify-content: space-between` |
| `justify-center` | `.justifyCenter` | `justify-content: center` |
| `max-w-7xl` | `.maxW7xl` | `max-width: 80rem` |
| `mx-auto` | `.mxAuto` | `margin-left: auto; margin-right: auto` |

### Position Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `sticky` | `.sticky` | `position: sticky` |
| `fixed` | `.fixed` | `position: fixed` |
| `absolute` | `.absolute` | `position: absolute` |
| `relative` | `.relative` | `position: relative` |
| `top-0` | `.top0` | `top: 0` |
| `bottom-8` | `.bottom8` | `bottom: 2rem` |
| `right-8` | `.right8` | `right: 2rem` |
| `z-50` | `.z50` | `z-index: 50` |
| `z-[100]` | `.z100` | `z-index: 100` |

### Transform Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `translate-x-1` | `.translateX1` | `transform: translateX(0.25rem)` |
| `translate-y-1` | `.translateY1` | `transform: translateY(0.25rem)` |
| `-translate-x-2` | `.translateXNeg2` | `transform: translateX(-0.5rem)` |
| `-translate-y-2` | `.translateYNeg2` | `transform: translateY(-0.5rem)` |
| `scale-105` | `.scale105` | `transform: scale(1.05)` |
| `scale-110` | `.scale110` | `transform: scale(1.1)` |
| `rotate-12` | `.rotate12` | `transform: rotate(12deg)` |
| `rotate-[-1deg]` | `.rotateNeg1` | `transform: rotate(-1deg)` |

### Filter Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `grayscale` | `.grayscale` | `filter: grayscale(100%)` |
| `grayscale-0` | `.grayscale0` | `filter: grayscale(0%)` |
| `contrast-125` | `.contrast125` | `filter: contrast(1.25)` |
| `brightness-90` | `.brightness90` | `filter: brightness(0.9)` |

### Transition Classes

| Tailwind Class | CSS Module Equivalent | CSS Properties |
|----------------|----------------------|----------------|
| `transition-colors` | `.transitionColors` | `transition-property: color, background-color, border-color` |
| `transition-all` | `.transitionAll` | `transition-property: all` |
| `transition-transform` | `.transitionTransform` | `transition-property: transform` |
| `duration-100` | `.duration100` | `transition-duration: 100ms` |
| `duration-200` | `.duration200` | `transition-duration: 200ms` |
| `duration-500` | `.duration500` | `transition-duration: 500ms` |

### Responsive Breakpoint Classes

| Tailwind Class | CSS Module Equivalent | Media Query |
|----------------|----------------------|-------------|
| `md:*` | `@media (min-width: 768px)` | Tablet and up |
| `lg:*` | `@media (min-width: 1024px)` | Desktop and up |
| `hidden md:flex` | `.hiddenMdFlex` | `display: none; @media (min-width: 768px) { display: flex }` |

## Layout and Grid System Specifications

### Responsive Breakpoints

```css
/* Mobile: 0-767px (default) */
/* Tablet: 768px-1023px (md:) */
/* Desktop: 1024px+ (lg:) */

:root {
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
}
```

### Grid Layouts by Page

#### Home Page Grid

**Manifesto Grid**:
```css
.manifestoGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-bottom: 4px solid black;
}

@media (min-width: 768px) {
  .manifestoGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Featured Projects Bento Grid**:
```css
.bentoGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .bentoGrid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.largeCard {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .largeCard {
    grid-column: span 8;
  }
}

.smallCard {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .smallCard {
    grid-column: span 4;
  }
}
```

#### Cases Page Grid

```css
.casesGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 768px) {
  .casesGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .casesGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.featuredWideCard {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .featuredWideCard {
    grid-column: span 2;
  }
}
```

#### About Page Grid

**Skills Grid**:
```css
.skillsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  border: 2px solid black;
}

@media (min-width: 768px) {
  .skillsGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .skillsGrid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

**Hero Grid**:
```css
.heroGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .heroGrid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.bioSection {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .bioSection {
    grid-column: span 7;
  }
}

.portraitSection {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .portraitSection {
    grid-column: span 5;
  }
}
```

#### Contact Page Grid

```css
.contactGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .contactGrid {
    grid-template-columns: repeat(12, 1fr);
  }
}

.formSection {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .formSection {
    grid-column: span 8;
  }
}

.sidebarSection {
  grid-column: span 1;
}

@media (min-width: 1024px) {
  .sidebarSection {
    grid-column: span 4;
  }
}
```

## Typography System Implementation

### Font Loading

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Grotesk:wght@400;500;700&display=swap');
```

### Font Family Variables

```css
:root {
  --font-headline: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
  --font-label: 'Space Grotesk', sans-serif;
}
```

### Typography Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  --text-8xl: 6rem;        /* 96px */
  --text-9xl: 8rem;        /* 128px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
  
  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0em;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  --leading-custom-85: 0.85;
  --leading-custom-9: 0.9;
}
```

### Typography Utility Classes

```css
/* Font Families */
.fontHeadline { font-family: var(--font-headline); }
.fontBody { font-family: var(--font-body); }
.fontLabel { font-family: var(--font-label); }

/* Font Weights */
.fontNormal { font-weight: var(--font-normal); }
.fontMedium { font-weight: var(--font-medium); }
.fontBold { font-weight: var(--font-bold); }
.fontExtrabold { font-weight: var(--font-extrabold); }
.fontBlack { font-weight: var(--font-black); }

/* Font Sizes */
.textXs { font-size: var(--text-xs); line-height: 1rem; }
.textSm { font-size: var(--text-sm); line-height: 1.25rem; }
.textBase { font-size: var(--text-base); line-height: 1.5rem; }
.textLg { font-size: var(--text-lg); line-height: 1.75rem; }
.textXl { font-size: var(--text-xl); line-height: 1.75rem; }
.text2xl { font-size: var(--text-2xl); line-height: 2rem; }
.text3xl { font-size: var(--text-3xl); line-height: 2.25rem; }
.text4xl { font-size: var(--text-4xl); line-height: 2.5rem; }
.text5xl { font-size: var(--text-5xl); line-height: 1; }
.text6xl { font-size: var(--text-6xl); line-height: 1; }
.text7xl { font-size: var(--text-7xl); line-height: 1; }
.text8xl { font-size: var(--text-8xl); line-height: 1; }
.text9xl { font-size: var(--text-9xl); line-height: 1; }

/* Text Transform */
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

/* Letter Spacing */
.trackingTighter { letter-spacing: var(--tracking-tighter); }
.trackingTight { letter-spacing: var(--tracking-tight); }
.trackingNormal { letter-spacing: var(--tracking-normal); }
.trackingWide { letter-spacing: var(--tracking-wide); }
.trackingWider { letter-spacing: var(--tracking-wider); }
.trackingWidest { letter-spacing: var(--tracking-widest); }

/* Line Heights */
.leadingNone { line-height: var(--leading-none); }
.leadingTight { line-height: var(--leading-tight); }
.leadingSnug { line-height: var(--leading-snug); }
.leadingNormal { line-height: var(--leading-normal); }
.leadingRelaxed { line-height: var(--leading-relaxed); }
.leadingLoose { line-height: var(--leading-loose); }
.leadingCustom85 { line-height: var(--leading-custom-85); }
.leadingCustom9 { line-height: var(--leading-custom-9); }
```

### Typography Combinations

**Page Titles**:
```css
.pageTitle {
  font-family: var(--font-headline);
  font-weight: var(--font-black);
  font-size: var(--text-6xl);
  line-height: var(--leading-custom-85);
  text-transform: uppercase;
  letter-spacing: var(--tracking-tighter);
}

@media (min-width: 768px) {
  .pageTitle {
    font-size: var(--text-9xl);
  }
}
```

**Hero Headings**:
```css
.heroHeading {
  font-family: var(--font-headline);
  font-weight: var(--font-black);
  font-size: var(--text-6xl);
  line-height: var(--leading-custom-9);
  text-transform: uppercase;
  letter-spacing: var(--tracking-tighter);
}

@media (min-width: 768px) {
  .heroHeading {
    font-size: var(--text-8xl);
  }
}
```

**Navigation Links**:
```css
.navLink {
  font-family: var(--font-headline);
  font-weight: var(--font-black);
  font-size: var(--text-xl);
  text-transform: uppercase;
  letter-spacing: var(--tracking-tighter);
}
```

**Body Text**:
```css
.bodyText {
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  font-size: var(--text-lg);
  line-height: var(--leading-normal);
}

@media (min-width: 768px) {
  .bodyText {
    font-size: var(--text-xl);
  }
}
```


## Color System Implementation

### Color Palette Variables

```css
:root {
  /* Primary Colors */
  --primary-fixed: #ffd709;
  --primary-container: #ffd709;
  --primary: #6c5a00;
  --primary-dim: #5e4e00;
  --primary-fixed-dim: #efc900;
  --on-primary: #fff2cd;
  --on-primary-fixed: #453900;
  --on-primary-container: #5b4b00;
  --on-primary-fixed-variant: #665500;
  --inverse-primary: #ffd709;
  
  /* Surface Colors */
  --surface: #f6f6f6;
  --surface-dim: #d2d5d5;
  --surface-bright: #f6f6f6;
  --surface-container-lowest: #ffffff;
  --surface-container-low: #f0f1f1;
  --surface-container: #e7e8e8;
  --surface-container-high: #e1e3e3;
  --surface-container-highest: #dbdddd;
  --surface-variant: #dbdddd;
  --on-surface: #2d2f2f;
  --on-surface-variant: #5a5c5c;
  --inverse-surface: #0c0f0f;
  --inverse-on-surface: #9c9d9d;
  
  /* Secondary Colors */
  --secondary: #5b5b5b;
  --secondary-dim: #4f4f4f;
  --secondary-container: #e2e2e2;
  --secondary-fixed: #e2e2e2;
  --secondary-fixed-dim: #d4d4d4;
  --on-secondary: #f3f3f3;
  --on-secondary-container: #525252;
  --on-secondary-fixed: #3f3f3f;
  --on-secondary-fixed-variant: #5b5b5b;
  
  /* Tertiary Colors */
  --tertiary: #5a5c5c;
  --tertiary-dim: #4e5050;
  --tertiary-container: #ffffff;
  --tertiary-fixed: #ffffff;
  --tertiary-fixed-dim: #f0f1f1;
  --on-tertiary: #f2f3f3;
  --on-tertiary-container: #616263;
  --on-tertiary-fixed: #4f5051;
  --on-tertiary-fixed-variant: #6c6d6e;
  
  /* Error Colors */
  --error: #b02500;
  --error-dim: #b92902;
  --error-container: #f95630;
  --on-error: #ffefec;
  --on-error-container: #520c00;
  
  /* Background Colors */
  --background: #f6f6f6;
  --on-background: #2d2f2f;
  
  /* Outline Colors */
  --outline: #757777;
  --outline-variant: #acadad;
  
  /* Surface Tint */
  --surface-tint: #6c5a00;
}
```

### Color Utility Classes

```css
/* Background Colors */
.bgPrimaryFixed { background-color: var(--primary-fixed); }
.bgPrimaryContainer { background-color: var(--primary-container); }
.bgSurface { background-color: var(--surface); }
.bgSurfaceContainerLow { background-color: var(--surface-container-low); }
.bgSurfaceContainerHigh { background-color: var(--surface-container-high); }
.bgSurfaceContainerHighest { background-color: var(--surface-container-highest); }
.bgWhite { background-color: #ffffff; }
.bgBlack { background-color: #000000; }
.bgStone100 { background-color: #f5f5f4; }
.bgStone900 { background-color: #1c1917; }

/* Text Colors */
.textBlack { color: #000000; }
.textWhite { color: #ffffff; }
.textBlackOpacity60 { color: rgba(0, 0, 0, 0.6); }
.textBlackOpacity50 { color: rgba(0, 0, 0, 0.5); }
.textBlackOpacity10 { color: rgba(0, 0, 0, 0.1); }
.textWhiteOpacity60 { color: rgba(255, 255, 255, 0.6); }
.textWhiteOpacity50 { color: rgba(255, 255, 255, 0.5); }
.textOnSurface { color: var(--on-surface); }
.textPrimaryContainer { color: var(--primary-container); }
.textPrimaryFixed { color: var(--primary-fixed); }
.textPrimaryDim { color: var(--primary-dim); }

/* Border Colors */
.borderBlack { border-color: #000000; }
.borderYellow400 { border-color: #ffd709; }
```

### Color Usage Guidelines

**Primary Yellow (#ffd709)**:
- Hero sections backgrounds
- Accent buttons
- Hover states
- Focus states
- Active elements
- Decorative highlights

**Black (#000000)**:
- All borders
- All shadows
- Primary text
- Dark backgrounds
- Navigation active states

**White (#ffffff)**:
- Card backgrounds
- Light section backgrounds
- Text on dark backgrounds
- Button backgrounds

**Surface Grays**:
- `surface-container-low` (#f0f1f1): Light section backgrounds
- `surface-container-high` (#e1e3e3): Image placeholder backgrounds
- `surface-container-highest` (#dbdddd): Elevated card backgrounds

## Shadow and Border System Implementation

### Shadow System

```css
:root {
  /* Brutalist Hard Shadows */
  --shadow-brutal-sm: 4px 4px 0px 0px #000000;
  --shadow-brutal: 8px 8px 0px 0px #000000;
  --shadow-brutal-lg: 16px 16px 0px 0px #000000;
  --shadow-brutal-yellow: 8px 8px 0px 0px #ffd709;
}
```

### Shadow Utility Classes

```css
.brutalShadowSm {
  box-shadow: var(--shadow-brutal-sm);
}

.brutalShadow {
  box-shadow: var(--shadow-brutal);
}

.shadowLarge {
  box-shadow: var(--shadow-brutal-lg);
}

.shadowYellow {
  box-shadow: var(--shadow-brutal-yellow);
}

.shadowNone {
  box-shadow: none;
}
```

### Border System

```css
:root {
  /* Border Widths */
  --border-width-thin: 2px;
  --border-width-medium: 3px;
  --border-width-thick: 4px;
  --border-width-extra-thick: 6px;
  
  /* Border Radius (Brutalist = 0) */
  --border-radius: 0px;
}
```

### Border Utility Classes

```css
/* Border Widths - All Sides */
.border2 {
  border-width: var(--border-width-thin);
  border-style: solid;
}

.border3 {
  border-width: var(--border-width-medium);
  border-style: solid;
}

.border4 {
  border-width: var(--border-width-thick);
  border-style: solid;
}

.border6 {
  border-width: var(--border-width-extra-thick);
  border-style: solid;
}

/* Border Widths - Individual Sides */
.borderTop2 {
  border-top-width: var(--border-width-thin);
  border-top-style: solid;
}

.borderTop4 {
  border-top-width: var(--border-width-thick);
  border-top-style: solid;
}

.borderBottom2 {
  border-bottom-width: var(--border-width-thin);
  border-bottom-style: solid;
}

.borderBottom4 {
  border-bottom-width: var(--border-width-thick);
  border-bottom-style: solid;
}

.borderLeft4 {
  border-left-width: var(--border-width-thick);
  border-left-style: solid;
}

.borderRight4 {
  border-right-width: var(--border-width-thick);
  border-right-style: solid;
}

/* Border Colors */
.borderBlack {
  border-color: #000000;
}

.borderYellow {
  border-color: var(--primary-fixed);
}

/* Border Radius (Always 0 for brutalist) */
* {
  border-radius: var(--border-radius);
}
```

### Shadow and Border Combinations

**Standard Card**:
```css
.standardCard {
  background-color: #ffffff;
  border: 4px solid #000000;
  box-shadow: var(--shadow-brutal);
}
```

**Button with Shadow**:
```css
.buttonWithShadow {
  background-color: var(--primary-fixed);
  border: 3px solid #000000;
  box-shadow: var(--shadow-brutal-sm);
}

.buttonWithShadow:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}
```

**Hover Card Effect**:
```css
.hoverCard {
  background-color: #ffffff;
  border: 4px solid #000000;
  box-shadow: var(--shadow-brutal);
  transition: all 500ms ease;
}

.hoverCard:hover {
  transform: translate(-8px, -8px);
  box-shadow: var(--shadow-brutal-lg);
}
```

## Hover and Transition Specifications

### Transition System

```css
:root {
  /* Transition Durations */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 500ms;
  
  /* Transition Easing */
  --ease-default: ease;
  --ease-in: ease-in;
  --ease-out: ease-out;
  --ease-in-out: ease-in-out;
}
```

### Transition Utility Classes

```css
.transitionColors {
  transition-property: color, background-color, border-color;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-default);
}

.transitionAll {
  transition-property: all;
  transition-duration: var(--duration-normal);
  transition-timing-function: var(--ease-default);
}

.transitionTransform {
  transition-property: transform;
  transition-duration: var(--duration-slow);
  transition-timing-function: var(--ease-default);
}

.transitionShadow {
  transition-property: box-shadow, transform;
  transition-duration: var(--duration-slow);
  transition-timing-function: var(--ease-default);
}

.duration100 {
  transition-duration: var(--duration-fast);
}

.duration200 {
  transition-duration: var(--duration-normal);
}

.duration500 {
  transition-duration: var(--duration-slow);
}
```

### Hover State Specifications

#### Navigation Links

```css
.navLink {
  color: rgba(0, 0, 0, 0.6);
  transition: color 100ms ease, background-color 100ms ease;
}

.navLink:hover {
  background-color: var(--primary-fixed);
  color: #000000;
}

.navLink.active {
  color: #000000;
  text-decoration: underline;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
}
```

#### Buttons

**Primary Button**:
```css
.primaryButton {
  background-color: #000000;
  color: #ffffff;
  border: 3px solid #000000;
  box-shadow: var(--shadow-brutal-sm);
  transition: all 200ms ease;
}

.primaryButton:hover {
  background-color: #ffffff;
  color: #000000;
}

.primaryButton:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}
```

**Accent Button**:
```css
.accentButton {
  background-color: var(--primary-fixed);
  color: #000000;
  border: 3px solid #000000;
  box-shadow: var(--shadow-brutal-sm);
  transition: all 200ms ease;
}

.accentButton:hover {
  background-color: #000000;
  color: var(--primary-fixed);
}

.accentButton:active {
  transform: translate(1px, 1px);
  box-shadow: none;
}
```

#### Project Cards

```css
.projectCard {
  background-color: #ffffff;
  border: 4px solid #000000;
  box-shadow: var(--shadow-brutal);
  transition: all 500ms ease;
}

.projectCard:hover {
  transform: translate(-8px, -8px);
  box-shadow: var(--shadow-brutal-lg);
}

.projectCard img {
  filter: grayscale(100%);
  transition: filter 500ms ease, transform 500ms ease;
}

.projectCard:hover img {
  filter: grayscale(0%);
  transform: scale(1.1);
}
```

#### Manifesto Cards

```css
.manifestoCard {
  background-color: #ffffff;
  border: 4px solid #000000;
  padding: 3rem;
  transition: background-color 200ms ease;
}

.manifestoCard:hover {
  background-color: var(--primary-fixed);
}

.manifestoCard .number {
  color: rgba(0, 0, 0, 0.1);
  transition: color 200ms ease;
}

.manifestoCard:hover .number {
  color: #000000;
}
```

#### Skill Cards

```css
.skillCard {
  border: 2px solid #000000;
  padding: 2rem;
  transition: background-color 200ms ease;
}

.skillCard:hover {
  background-color: var(--primary-fixed);
}

.skillCard .skillName {
  font-size: 2.25rem;
  font-weight: 900;
  transition: transform 200ms ease;
  transform-origin: left;
}

.skillCard:hover .skillName {
  transform: scale(1.1);
}
```

#### Social Links

```css
.socialLink {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  transition: all 200ms ease;
}

.socialLink:hover {
  font-style: italic;
  transform: scale(1.05);
}
```

#### Form Fields

```css
.formField {
  border-bottom: 4px solid #000000;
  padding: 0.5rem;
  transition: background-color 200ms ease;
}

.formField:focus-within {
  background-color: var(--primary-fixed);
}
```

#### Images

```css
.projectImage {
  filter: grayscale(100%);
  transition: filter 500ms ease, transform 500ms ease;
  overflow: hidden;
}

.projectCard:hover .projectImage {
  filter: grayscale(0%);
  transform: scale(1.1);
}

.portraitImage {
  filter: grayscale(100%) contrast(1.25) brightness(0.9);
  transition: filter 500ms ease;
}

.portraitContainer:hover .portraitImage {
  filter: grayscale(0%) contrast(1.25) brightness(0.9);
}
```

## Responsive Breakpoint Specifications

### Breakpoint System

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Mobile-First Approach

All styles are written mobile-first, with desktop styles added via media queries:

```css
/* Mobile (default): 0-767px */
.element {
  /* Mobile styles */
}

/* Tablet: 768px-1023px */
@media (min-width: 768px) {
  .element {
    /* Tablet styles */
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .element {
    /* Desktop styles */
  }
}
```

### Responsive Typography

```css
/* Page Titles */
.pageTitle {
  font-size: 3.75rem; /* text-6xl mobile */
  line-height: 0.85;
}

@media (min-width: 768px) {
  .pageTitle {
    font-size: 6rem; /* text-8xl tablet */
  }
}

@media (min-width: 1024px) {
  .pageTitle {
    font-size: 8rem; /* text-9xl desktop */
  }
}

/* Hero Headings */
.heroHeading {
  font-size: 3.75rem; /* text-6xl mobile */
  line-height: 0.9;
}

@media (min-width: 768px) {
  .heroHeading {
    font-size: 6rem; /* text-8xl desktop */
  }
}

/* Body Text */
.bodyText {
  font-size: 1.125rem; /* text-lg mobile */
}

@media (min-width: 768px) {
  .bodyText {
    font-size: 1.5rem; /* text-2xl desktop */
  }
}

/* Form Inputs */
.formInput {
  font-size: 2.25rem; /* text-4xl mobile */
}

@media (min-width: 768px) {
  .formInput {
    font-size: 3rem; /* text-5xl desktop */
  }
}
```

### Responsive Spacing

```css
/* Container Padding */
.container {
  padding-left: 1.5rem; /* px-6 mobile */
  padding-right: 1.5rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 3rem; /* px-12 desktop */
    padding-right: 3rem;
  }
}

/* Section Padding */
.section {
  padding-top: 4rem; /* py-16 mobile */
  padding-bottom: 4rem;
}

@media (min-width: 768px) {
  .section {
    padding-top: 6rem; /* py-24 desktop */
    padding-bottom: 6rem;
  }
}

/* Hero Padding */
.hero {
  padding-top: 5rem; /* py-20 mobile */
  padding-bottom: 5rem;
}

@media (min-width: 768px) {
  .hero {
    padding-top: 5rem; /* py-20 desktop (same) */
    padding-bottom: 5rem;
  }
}
```

### Responsive Layout

```css
/* Navigation */
.navLinks {
  display: none; /* hidden on mobile */
}

@media (min-width: 768px) {
  .navLinks {
    display: flex; /* md:flex on desktop */
    gap: 3rem;
  }
}

/* Grid Layouts */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* grid-cols-1 mobile */
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* lg:grid-cols-3 */
  }
}

/* Flex Direction */
.flexContainer {
  display: flex;
  flex-direction: column; /* flex-col mobile */
  gap: 2rem;
}

@media (min-width: 768px) {
  .flexContainer {
    flex-direction: row; /* md:flex-row desktop */
  }
}
```

### Responsive Visibility

```css
/* Hide on Mobile, Show on Desktop */
.hiddenMobile {
  display: none;
}

@media (min-width: 768px) {
  .hiddenMobile {
    display: block;
  }
}

/* Show on Mobile, Hide on Desktop */
.hiddenDesktop {
  display: block;
}

@media (min-width: 768px) {
  .hiddenDesktop {
    display: none;
  }
}
```

### Responsive Component Behavior

**FAB Button**:
```css
.fab {
  display: none; /* Hidden on mobile */
}

@media (min-width: 768px) {
  .fab {
    display: flex; /* md:flex on desktop */
    position: fixed;
    bottom: 2rem;
    right: 2rem;
  }
}
```

**Featured Project Card**:
```css
.featuredCard {
  grid-column: span 1; /* Full width on mobile */
}

@media (min-width: 768px) {
  .featuredCard {
    grid-column: span 2; /* md:col-span-2 on tablet */
  }
}
```

**Portrait Section**:
```css
.portraitSection {
  order: 1; /* Show first on mobile */
}

@media (min-width: 1024px) {
  .portraitSection {
    order: 2; /* lg:order-2 on desktop */
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:

**Redundant Properties Eliminated**:
- Requirements 1.7, 3.7, 4.7, 5.7: These are comprehensive "match all" statements that are covered by their specific sub-requirements
- Requirements 16.1-16.9: Responsive behavior is already covered by specific component requirements (5.1-5.3, 6.9, 7.7)
- Requirements 17.1-17.7: Hover and transition effects are already covered by component-specific requirements (6.6, 6.8, 7.5, 12.7, 13.6, 14.8, 15.5)
- Requirements 18.1-18.7, 19.1-19.8: These are functional preservation requirements, not visual parity tests
- Requirements 23.1-23.7: Grid layouts are already covered by page-specific requirements (8.3, 8.5, 9.6, 10.7)
- Requirements 25.1-25.7: Button styles are already covered by component-specific requirements (6.7, 6.8, 14.7, 14.8)

**Properties Combined**:
- Color definition requirements (2.1-2.5) combined into a single example-based test
- Border requirements (3.3, 3.4) combined with general border property (3.1, 3.2)
- Shadow definition requirements (4.1, 4.2) combined into a single example-based test
- Page-specific layout requirements (8.1-8.8, 9.1-9.10, 10.1-10.10, 11.1-11.10) grouped by page

### Property 1: Typography Font Families

*For any* headline element (h1, h2, h3, or elements with headline class), the computed font-family should be "Plus Jakarta Sans" with font-weight of 700, 800, or 900.

**Validates: Requirements 1.1**

### Property 2: Body Typography Font Families

*For any* body text or label element, the computed font-family should be "Space Grotesk" with font-weight of 400, 500, or 700.

**Validates: Requirements 1.2**

### Property 3: Page Title Typography

*For any* page title element, the computed styles should include font-weight 900, text-transform uppercase, and letter-spacing -0.05em.

**Validates: Requirements 1.3**

### Property 4: Responsive Hero Typography

*For any* hero heading element, the computed font-size should be 3.75rem (60px) on mobile viewports (<768px) and 6rem (96px) or 8rem (128px) on desktop viewports (≥768px), with line-height 0.85.

**Validates: Requirements 1.4**

### Property 5: Navigation Link Typography

*For any* navigation link element, the computed styles should include font-weight 900, text-transform uppercase, letter-spacing -0.05em, and font-size 1.25rem (20px).

**Validates: Requirements 1.5**

### Property 6: Body Text Typography

*For any* body text element, the computed font-weight should be 500 or 700, and font-size should be 1.125rem (18px), 1.25rem (20px), or 1.5rem (24px).

**Validates: Requirements 1.6**

### Property 7: Color System Completeness

*For all* 50+ semantic color variables defined in the original Tailwind config, corresponding CSS custom properties should exist in globals.css with matching hex values.

**Validates: Requirements 2.6**

### Property 8: Background Color Application

*For any* section or component with a background color, the applied color should match one of the defined system colors (white, black, primary-fixed, or surface variants) from the original HTML.

**Validates: Requirements 2.7**

### Property 9: Text Color Application

*For any* text element, the applied color should match one of the defined text colors (black, white, black with 60% opacity, white with 60% opacity, or on-surface) from the original HTML.

**Validates: Requirements 2.8**

### Property 10: Section Border Styling

*For any* major section divider (navigation, footer, hero sections), the border should be 4px solid black.

**Validates: Requirements 3.1, 3.3, 3.4**

### Property 11: Interactive Element Borders

*For any* interactive element (button, card, input), the border should be 2px, 3px, or 4px solid black matching the original HTML specification for that element type.

**Validates: Requirements 3.2**

### Property 12: Grid Cell Borders

*For any* grid layout cell (manifesto grid, skills grid), the border should be 2px or 4px solid black matching the original HTML.

**Validates: Requirements 3.5**

### Property 13: Zero Border Radius

*For all* elements in the application, the computed border-radius should be 0px (brutalist aesthetic requirement).

**Validates: Requirements 3.6**

### Property 14: Project Card Shadow

*For any* project card element, the default box-shadow should be "8px 8px 0px 0px #000000".

**Validates: Requirements 4.3**

### Property 15: Button Shadow

*For any* button element with shadow styling, the box-shadow should be "4px 4px 0px 0px #000000".

**Validates: Requirements 4.4**

### Property 16: Card Hover Shadow Transform

*For any* card element on hover, the box-shadow should increase to "16px 16px 0px 0px #000000" and the transform should be translate(-8px, -8px).

**Validates: Requirements 4.5**

### Property 17: Button Active State Transform

*For any* button with shadow on active state, the box-shadow should be removed (none) and the transform should be translate(1px, 1px).

**Validates: Requirements 4.6**

### Property 18: Responsive Navigation Padding

*For any* navigation element, the padding should be 1.5rem (24px) horizontal and 1rem (16px) vertical on mobile (<768px), and 3rem (48px) horizontal on desktop (≥768px).

**Validates: Requirements 5.1**

### Property 19: Responsive Hero Padding

*For any* hero section, the padding should be 1.5rem (24px) horizontal on mobile and 3rem (48px) horizontal on desktop, with 5rem (80px) or 4rem (64px) vertical padding.

**Validates: Requirements 5.2**

### Property 20: Responsive Content Section Padding

*For any* content section, the padding should be 1.5rem (24px) horizontal on mobile and 3rem (48px) horizontal on desktop, with 6rem (96px) vertical padding.

**Validates: Requirements 5.3**

### Property 21: Grid Gap Spacing

*For any* grid layout, the gap should be 2rem (32px) or 3rem (48px) matching the original HTML specification for that grid type.

**Validates: Requirements 5.4**

### Property 22: Card Padding

*For any* card component, the padding should be 1.5rem (24px), 2rem (32px), or 3rem (48px) matching the original HTML specification for that card type.

**Validates: Requirements 5.5**

### Property 23: Container Max Width

*For any* max-width container, the max-width should be 80rem (1280px) with margin-left and margin-right set to auto for centering.

**Validates: Requirements 5.6**

### Property 24: Navigation Active Link Styling

*For any* active navigation link, the text-decoration should be underline with thickness 4px and offset 8px.

**Validates: Requirements 6.5**

### Property 25: Navigation Link Hover State

*For any* inactive navigation link on hover, the background-color should change to #ffd709 (yellow-400) and color should change to black with transition duration 100ms.

**Validates: Requirements 6.6**

### Property 26: Navigation Button Active State

*For any* navigation button on active state, the transform should be translate(1px, 1px) and box-shadow should be none.

**Validates: Requirements 6.8**

### Property 27: Navigation Links Responsive Visibility

*For any* navigation links container, the display should be none on mobile (<768px) and flex on desktop (≥768px).

**Validates: Requirements 6.9**

### Property 28: Social Link Hover Transform

*For any* social link in the footer on hover, the font-style should be italic and transform should be scale(1.05) with transition duration 200ms.

**Validates: Requirements 7.5**

### Property 29: Footer Responsive Layout

*For any* footer container, the flex-direction should be column on mobile (<768px) and row on desktop (≥768px) with gap 2rem (32px).

**Validates: Requirements 7.7**

### Property 30: ProjectCard Shadow and Border

*For any* ProjectCard component, the background should be white, border should be 4px solid black, and box-shadow should be "8px 8px 0px 0px #000000".

**Validates: Requirements 12.1**

### Property 31: ProjectCard Image Grayscale

*For any* ProjectCard image, the default filter should be grayscale(100%) and on hover should transition to grayscale(0%) over 500ms.

**Validates: Requirements 12.3**

### Property 32: ProjectCard Hover Transform

*For any* ProjectCard on hover, the transform should be translate(-8px, -8px) and box-shadow should be "16px 16px 0px 0px #000000" with transition duration 500ms.

**Validates: Requirements 12.7**

### Property 33: ManifestoCard Hover Background

*For any* ManifestoCard on hover, the background-color should transition to #ffd709 (primary-fixed) over 200ms.

**Validates: Requirements 13.6**

### Property 34: ManifestoCard Number Hover Opacity

*For any* ManifestoCard number element, the default color should be rgba(0,0,0,0.1) and on card hover should transition to rgba(0,0,0,1) over 200ms.

**Validates: Requirements 13.3**

### Property 35: ContactForm Field Focus State

*For any* ContactForm field group on focus-within, the background-color should transition to #ffd709 (primary-fixed) over 200ms.

**Validates: Requirements 14.3**

### Property 36: ContactForm Submit Button Hover

*For any* ContactForm submit button on hover, the box-shadow should be "4px 4px 0px 0px #000000" with transition duration 200ms.

**Validates: Requirements 14.8**

### Property 37: SkillCard Hover Background

*For any* SkillCard on hover, the background-color should transition to #ffd709 (primary-fixed) over 200ms.

**Validates: Requirements 15.4**

### Property 38: SkillCard Name Hover Scale

*For any* SkillCard skill name element on card hover, the transform should be scale(1.1) with transform-origin left and transition duration 200ms.

**Validates: Requirements 15.5**

### Property 39: Material Symbols Icon Configuration

*For all* Material Symbols icon elements, the font-variation-settings should be 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24 by default.

**Validates: Requirements 20.2**

### Property 40: Global Body Styles

*For the* body element, the font-family should be Space Grotesk, background-color should be #f6f6f6 (surface), and color should be #2d2f2f (on-surface).

**Validates: Requirements 21.2**

### Property 41: Text Selection Styling

*For any* selected text, the background-color should be #ffd709 (primary-container) and color should be black.

**Validates: Requirements 21.3**

### Property 42: Image Grayscale Filter

*For any* project or portfolio image, the default filter should include grayscale(100%) and on hover should transition to grayscale(0%).

**Validates: Requirements 22.1, 22.2**

### Property 43: Portrait Image Filters

*For any* portrait image, the filter should be grayscale(100%) contrast(1.25) brightness(0.9) by default, and on hover should transition to grayscale(0%) contrast(1.25) brightness(0.9).

**Validates: Requirements 22.3**

### Property 44: Decorative Element Positioning

*For any* decorative text element, the position should be absolute with appropriate right/bottom/top/left values, opacity should be 0.1, and pointer-events should be none.

**Validates: Requirements 24.1, 24.2, 24.3, 24.4, 24.5**

## Error Handling

### CSS Fallbacks

All CSS custom properties should include fallback values:

```css
.element {
  color: var(--on-surface, #2d2f2f);
  background-color: var(--surface, #f6f6f6);
}
```

### Font Loading Errors

If custom fonts fail to load, the system should fall back to system fonts:

```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Image Loading Errors

All images should have:
1. Alt text for accessibility
2. Background color matching the design system
3. Aspect ratio containers to prevent layout shift

```tsx
<Image
  src={imageSrc}
  alt="Descriptive alt text"
  fill
  className={styles.image}
  style={{ objectFit: 'cover' }}
/>
```

### Responsive Breakpoint Handling

Media queries should use min-width for mobile-first approach:

```css
/* Mobile default */
.element { /* mobile styles */ }

/* Tablet and up */
@media (min-width: 768px) {
  .element { /* tablet styles */ }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { /* desktop styles */ }
}
```

### Browser Compatibility

All CSS should be compatible with:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

Vendor prefixes should be added where necessary:

```css
.element {
  -webkit-transform: translate(-8px, -8px);
  -moz-transform: translate(-8px, -8px);
  -ms-transform: translate(-8px, -8px);
  transform: translate(-8px, -8px);
}
```

## Testing Strategy

### Dual Testing Approach

This refactoring requires both unit tests and property-based tests to ensure visual parity:

**Unit Tests**: Verify specific examples, edge cases, and component rendering
- Test that specific components render with correct CSS classes
- Test that color variables are defined correctly
- Test that responsive breakpoints trigger correct styles
- Test that hover states apply correct transformations
- Test that page-specific layouts match specifications

**Property-Based Tests**: Verify universal properties across all inputs
- Test that all headline elements use Plus Jakarta Sans font
- Test that all borders have 0px border-radius
- Test that all shadows follow the brutalist pattern (no blur)
- Test that all responsive padding follows the mobile-first pattern
- Test that all hover transitions have correct durations

### Property-Based Testing Configuration

**Library**: Use `@fast-check/vitest` for property-based testing in the Next.js/TypeScript environment

**Test Configuration**:
```typescript
import { test } from 'vitest';
import * as fc from 'fast-check';

test('Property: All headline elements use Plus Jakarta Sans', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('h1', 'h2', 'h3', '.headline'),
      (selector) => {
        // Test implementation
      }
    ),
    { numRuns: 100 } // Minimum 100 iterations
  );
});
```

**Test Tagging**:
Each property test must include a comment referencing the design property:

```typescript
/**
 * Feature: visual-parity-refactor, Property 1: Typography Font Families
 * For any headline element, the computed font-family should be "Plus Jakarta Sans"
 */
test('Property 1: Typography Font Families', () => {
  // Test implementation
});
```

### Unit Testing Strategy

**Component Tests**:
- Render each component and verify CSS classes are applied
- Test responsive behavior by mocking viewport sizes
- Test hover states using user event simulation
- Test that images have correct filters applied

**Visual Regression Tests**:
- Capture screenshots of each page at mobile, tablet, and desktop sizes
- Compare against reference screenshots from original HTML
- Flag any pixel differences for manual review

**CSS Module Tests**:
- Verify that all required CSS classes are defined
- Verify that CSS custom properties have correct values
- Verify that media queries have correct breakpoints

### Test Coverage Goals

- 100% of correctness properties implemented as property-based tests
- 100% of components covered by unit tests
- 100% of pages covered by visual regression tests
- All hover states and transitions tested
- All responsive breakpoints tested

### Testing Tools

- **Vitest**: Test runner for unit and property-based tests
- **@fast-check/vitest**: Property-based testing library
- **@testing-library/react**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **Playwright**: Visual regression testing and E2E tests

### Example Test Structure

```typescript
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { ProjectCard } from '@/components/ProjectCard';

describe('ProjectCard Component', () => {
  /**
   * Feature: visual-parity-refactor, Property 30: ProjectCard Shadow and Border
   */
  test('Property 30: ProjectCard has correct shadow and border', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string(),
          category: fc.string(),
          description: fc.string(),
          image: fc.webUrl(),
        }),
        (props) => {
          const { container } = render(<ProjectCard {...props} />);
          const card = container.firstChild as HTMLElement;
          
          const styles = window.getComputedStyle(card);
          expect(styles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
          expect(styles.borderWidth).toBe('4px');
          expect(styles.borderColor).toBe('rgb(0, 0, 0)'); // black
          expect(styles.boxShadow).toBe('8px 8px 0px 0px rgb(0, 0, 0)');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: visual-parity-refactor, Property 32: ProjectCard Hover Transform
   */
  test('Property 32: ProjectCard hover applies correct transform', async () => {
    const { container } = render(
      <ProjectCard
        title="Test Project"
        category="Test"
        description="Test description"
        image="/test.jpg"
      />
    );
    
    const card = container.firstChild as HTMLElement;
    
    // Simulate hover
    await userEvent.hover(card);
    
    const styles = window.getComputedStyle(card);
    expect(styles.transform).toContain('translate(-8px, -8px)');
    expect(styles.boxShadow).toBe('16px 16px 0px 0px rgb(0, 0, 0)');
  });
});
```

### Continuous Integration

All tests should run on:
- Every pull request
- Every commit to main branch
- Nightly builds for visual regression tests

CI should fail if:
- Any property-based test fails
- Any unit test fails
- Visual regression differences exceed 0.1% pixel difference
- Test coverage drops below 90%

