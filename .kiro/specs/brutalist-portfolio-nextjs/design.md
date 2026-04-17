# Design Document: Brutalist Portfolio Next.js Conversion

## Overview

This design document outlines the technical architecture for converting an existing HTML brutalist portfolio website into a modern Next.js 14+ application. The project transforms four HTML pages into a component-based React application while preserving the radical "Цифровой Манифест" (Digital Manifesto) brutalist design aesthetic.

### Design Goals

1. **Architectural Modernization**: Migrate from static HTML to Next.js App Router with TypeScript
2. **CSS Independence**: Replace Tailwind CSS with custom CSS Modules implementing the brutalist design system
3. **Performance Optimization**: Leverage Next.js features (Image optimization, font loading, static generation)
4. **Component Reusability**: Extract shared UI patterns into reusable React components
5. **Responsive Design**: Implement mobile-first responsive layouts while maintaining brutalist aesthetics
6. **Accessibility**: Ensure semantic HTML and WCAG AA compliance

### Key Technical Decisions

- **Next.js 14+ App Router**: Chosen for modern React Server Components, improved routing, and built-in optimizations
- **CSS Modules**: Provides scoped styling without runtime overhead, ideal for implementing the design system
- **TypeScript**: Ensures type safety and better developer experience
- **No UI Framework**: Custom CSS implementation maintains design system purity and reduces bundle size
- **Static Generation**: Portfolio content is static, enabling optimal performance through SSG

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   App Router │  │  Components  │  │  CSS Modules │      │
│  │              │  │              │  │              │      │
│  │  /app        │  │  Navigation  │  │  globals.css │      │
│  │  ├─ page.tsx │  │  Footer      │  │  tokens.css  │      │
│  │  ├─ /cases   │  │  ProjectCard │  │  *.module.css│      │
│  │  ├─ /about   │  │  SkillCard   │  │              │      │
│  │  └─ /contact │  │  ContactForm │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Fonts      │  │   Public     │  │   Types      │      │
│  │              │  │              │  │              │      │
│  │  Plus Jakarta│  │  /images     │  │  project.ts  │      │
│  │  Space Grotesk│  │  /icons     │  │  skill.ts    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
brutalist-portfolio-nextjs/
├── app/
│   ├── layout.tsx              # Root layout with fonts and metadata
│   ├── page.tsx                # Home page (Head_code.html)
│   ├── cases/
│   │   └── page.tsx            # Portfolio page (Cases_code.html)
│   ├── about/
│   │   └── page.tsx            # About page (Me_code.html)
│   └── contact/
│       └── page.tsx            # Contact page (Form_code.html)
├── components/
│   ├── Navigation.tsx          # Shared navigation component
│   ├── Footer.tsx              # Shared footer component
│   ├── ProjectCard.tsx         # Portfolio project card
│   ├── SkillCard.tsx           # Skill display card
│   ├── ManifestoCard.tsx       # Home page manifesto card
│   └── ContactForm.tsx         # Contact form component
├── styles/
│   ├── globals.css             # Global styles and resets
│   ├── tokens.css              # Design system tokens
│   ├── Navigation.module.css
│   ├── Footer.module.css
│   ├── Home.module.css
│   ├── Cases.module.css
│   ├── About.module.css
│   └── Contact.module.css
├── public/
│   ├── images/
│   │   ├── projects/
│   │   └── portrait.jpg
│   └── icons/
├── types/
│   ├── project.ts
│   └── skill.ts
├── lib/
│   └── data.ts                 # Static data (projects, skills)
└── package.json
```

### Routing Architecture

The application uses Next.js App Router with the following route structure:

- `/` - Home page with hero, manifesto, featured projects, and contact form
- `/cases` - Portfolio grid with project filtering
- `/about` - About page with biography and skills
- `/contact` - Contact form with sidebar information

All routes share the root layout which includes:
- Font loading configuration
- Global metadata
- Navigation component
- Footer component

## Components and Interfaces

### Core Components

#### 1. Navigation Component

**Purpose**: Provides consistent navigation across all pages with active state indication.

**Props Interface**:
```typescript
interface NavigationProps {
  currentPath: string;
}
```

**Key Features**:
- Sticky positioning with z-index 50
- Active page indication with 4px underline
- Responsive mobile menu
- "ЗАКАЗАТЬ" CTA button with primary color
- 4px solid black bottom border

**State Management**: Uses Next.js `usePathname()` hook for active route detection.

#### 2. Footer Component

**Purpose**: Displays branding, social links, and copyright information.

**Props Interface**:
```typescript
interface FooterProps {
  // No props - static content
}
```

**Key Features**:
- Social media links (Telegram, Behance, Dribbble, Email)
- Hover states with italic and scale transforms
- 4px solid black top border
- Responsive flex layout

#### 3. ProjectCard Component

**Purpose**: Displays individual portfolio projects with hover effects.

**Props Interface**:
```typescript
interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    year: string;
    image: string;
    wide?: boolean;
  };
}
```

**Key Features**:
- Grayscale to color image transition on hover
- Hard shadow and translate transforms
- Responsive grid spanning (wide variant)
- Category and year badges

#### 4. SkillCard Component

**Purpose**: Displays individual skills on the about page.

**Props Interface**:
```typescript
interface SkillCardProps {
  skill: {
    name: string;
    icon?: string;
  };
}
```

**Key Features**:
- Primary color background on hover
- 3px solid black border
- Uppercase text styling

#### 5. ManifestoCard Component

**Purpose**: Displays design principles on the home page.

**Props Interface**:
```typescript
interface ManifestoCardProps {
  principle: {
    title: string;
    description: string;
    icon: string;
  };
}
```

**Key Features**:
- Primary color background transition on hover
- Material Symbols icons
- Hard shadow effects

#### 6. ContactForm Component

**Purpose**: Handles contact form submission with validation.

**Props Interface**:
```typescript
interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  contact: string;
  budget: string;
  description: string;
}
```

**Key Features**:
- Focus states with primary color background
- 4px bottom borders on inputs
- Budget dropdown selection
- Form validation
- Large submit button with black background

### Component Hierarchy

```
RootLayout
├── Navigation
├── Page Content
│   ├── Home
│   │   ├── Hero Section
│   │   ├── ManifestoCard (×3)
│   │   ├── ProjectCard (×6)
│   │   └── ContactForm
│   ├── Cases
│   │   ├── Filter Bar
│   │   └── ProjectCard (×N)
│   ├── About
│   │   ├── Portrait Section
│   │   ├── Biography
│   │   └── SkillCard (×N)
│   └── Contact
│       ├── ContactForm
│       └── Sidebar
└── Footer
```

## Data Models

### Project Type

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX';
  year: string;
  image: string;
  imageAlt: string;
  wide?: boolean; // For 2-column spanning cards
}
```

### Skill Type

```typescript
interface Skill {
  name: string;
  icon?: string; // Material Symbols icon name
}
```

### Manifesto Principle Type

```typescript
interface ManifestoPrinciple {
  title: string;
  description: string;
  icon: string; // Material Symbols icon name
}
```

### Form Data Type

```typescript
interface ContactFormData {
  name: string;
  contact: string; // Email or Telegram
  budget: '100К-300К' | '300К-700К' | '700К+';
  description: string;
}
```

### CSS Design Tokens

The design system tokens are defined in `tokens.css`:

```css
:root {
  /* Colors */
  --color-primary: #ffd709;
  --color-primary-dark: #6c5a00;
  --color-surface: #f6f6f6;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f0f0f0;
  --color-surface-container: #ebebeb;
  --color-surface-container-high: #e5e5e5;
  --color-surface-container-highest: #e0e0e0;
  --color-surface-dim: #d6d6d6;
  --color-on-surface: #2d2f2f;
  --color-on-background: #000000;
  --color-error: #b02500;
  --color-outline-variant: rgba(0, 0, 0, 0.15);

  /* Typography */
  --font-headline: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Space Grotesk', monospace;

  /* Font Sizes */
  --font-size-display-large: 3.5rem;
  --font-size-display-medium: 2.875rem;
  --font-size-headline-large: 2rem;
  --font-size-headline-medium: 1.5rem;
  --font-size-body-large: 1rem;
  --font-size-body-medium: 0.875rem;
  --font-size-label-large: 0.875rem;
  --font-size-label-medium: 0.75rem;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* Borders */
  --border-width-thin: 3px;
  --border-width-thick: 4px;
  --border-radius: 0px;

  /* Shadows */
  --shadow-hard-small: 4px 4px 0px #000000;
  --shadow-hard-large: 8px 8px 0px #000000;

  /* Transitions */
  --transition-fast: 200ms ease;
  --transition-medium: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### Font Loading Configuration

Fonts are loaded in the root layout using Next.js `next/font`:

```typescript
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['700', '800', '900'],
  variable: '--font-headline',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});
```

### Responsive Breakpoints

```css
/* Mobile First Breakpoints */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
```

### Data Flow

The application follows a simple data flow pattern:

1. **Static Data**: Projects, skills, and manifesto principles are defined in `lib/data.ts`
2. **Server Components**: Pages fetch data during build time (SSG)
3. **Client Components**: Interactive components (forms, filters) use React state
4. **No External API**: All content is static and bundled with the application

Example data structure in `lib/data.ts`:

```typescript
export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'ПРОЕКТ НАЗВАНИЕ',
    description: 'Краткое описание проекта',
    category: 'Веб-Дизайн',
    year: '2024',
    image: '/images/projects/project-1.jpg',
    imageAlt: 'Описание изображения',
    wide: false,
  },
  // ... more projects
];

export const skills: Skill[] = [
  { name: 'FIGMA', icon: 'design_services' },
  { name: 'MOTION', icon: 'animation' },
  // ... more skills
];
```



## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Hover state properties**: Multiple requirements specify hover effects for different element types (buttons, cards, links, images). These can be consolidated into element-type-specific properties rather than page-specific ones.

2. **Image properties**: Requirements 2.10, 7.7, and 12.5 all relate to grayscale-to-color transitions on images. These can be combined into a single comprehensive property.

3. **Heading hierarchy**: Requirements 13.2 and 14.4 both specify proper heading structure. These are the same property.

4. **Interactive element properties**: Multiple requirements (12.1, 13.5) specify that all interactive elements should have certain states. These can be consolidated.

5. **Form input properties**: Requirements 9.4 and 13.7 relate to form inputs and can be tested together.

The following properties represent the unique, testable behaviors after eliminating redundancy:

### Property 1: Button Hover Shadow Application

*For any* button element in the application, when hovered, the element should apply a hard shadow effect (4px 4px 0px #000000 or 8px 8px 0px #000000).

**Validates: Requirements 2.9**

### Property 2: Image Grayscale Transition

*For any* image element with a grayscale filter, hovering should transition the filter from grayscale(100%) to grayscale(0%) with a 500ms duration.

**Validates: Requirements 2.10, 7.7, 12.5**

### Property 3: Active Page Navigation Highlight

*For any* page route in the application, the corresponding navigation link should display a 4px underline decoration when that page is active.

**Validates: Requirements 4.3**

### Property 4: Navigation Link Hover Background

*For any* navigation link element, hovering should apply the primary color (#ffd709) as the background color.

**Validates: Requirements 4.7**

### Property 5: Social Link Hover Transform

*For any* social media link in the footer, hovering should apply both italic font-style and scale(1.05) transform.

**Validates: Requirements 5.6**

### Property 6: Manifesto Card Hover Background

*For any* manifesto card on the home page, hovering should change the background color to the primary color (#ffd709).

**Validates: Requirements 6.6**

### Property 7: Project Card Hover Transform

*For any* project card element, hovering should apply both scale transform and hard shadow effect.

**Validates: Requirements 6.7, 7.6**

### Property 8: Skill Card Hover Background

*For any* skill card on the about page, hovering should apply the primary color (#ffd709) as the background color.

**Validates: Requirements 8.6**

### Property 9: Input Focus Background

*For any* form input field, when focused, the element should apply the primary color (#ffd709) as the background color.

**Validates: Requirements 9.4**

### Property 10: Mobile Touch Target Size

*For any* interactive element (button, link, input) on mobile viewports (< 640px), the minimum touch target size should be at least 44px in both width and height.

**Validates: Requirements 10.7**

### Property 11: Image Alt Text Presence

*For any* image element in the application, it must have a non-empty alt attribute for accessibility.

**Validates: Requirements 11.3**

### Property 12: Interactive Element Hover States

*For any* interactive element (button, link, card), the CSS must define a :hover pseudo-class with visual feedback.

**Validates: Requirements 12.1**

### Property 13: Hard Shadow Transition Duration

*For any* element with hard shadow transitions, the transition duration should be between 200ms and 300ms.

**Validates: Requirements 12.2**

### Property 14: Active State Transform

*For any* interactive element with an :active state, the transform should translate the element by 1px in both x and y directions.

**Validates: Requirements 12.3**

### Property 15: Background Color Transition Smoothness

*For any* element with background color changes on interaction, the CSS must include a transition property for smooth color changes.

**Validates: Requirements 12.6**

### Property 16: Button Active Shadow Removal

*For any* button element with a shadow in its default state, the :active state should remove or significantly reduce the shadow to simulate depth.

**Validates: Requirements 12.7**

### Property 17: Heading Hierarchy Validity

*For any* page in the application, there must be exactly one h1 element, and heading levels must not skip (e.g., h1 -> h3 without h2).

**Validates: Requirements 13.2, 14.4**

### Property 18: Icon Button Aria Labels

*For any* button element that contains only an icon (no visible text), it must have an aria-label attribute providing a text description.

**Validates: Requirements 13.3**

### Property 19: Color Contrast Compliance

*For any* text element in the application, the contrast ratio between the text color and its background must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 13.4**

### Property 20: Keyboard Focus Visibility

*For any* interactive element, the CSS must define a :focus-visible pseudo-class with visible styling for keyboard navigation.

**Validates: Requirements 13.5**

### Property 21: Form Label Association

*For any* form input element, it must have an associated label element (either wrapping the input or connected via htmlFor/id).

**Validates: Requirements 13.7**

## Error Handling

### CSS Fallbacks

The application implements defensive CSS with fallback values:

```css
/* Font fallbacks */
font-family: var(--font-headline), 'Arial Black', sans-serif;
font-family: var(--font-body), 'Courier New', monospace;

/* Color fallbacks */
background-color: #ffd709; /* Fallback if CSS variable fails */
background-color: var(--color-primary);
```

### Image Loading Errors

Next.js Image components should include error handling:

```typescript
<Image
  src={project.image}
  alt={project.imageAlt}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  onError={(e) => {
    e.currentTarget.src = '/images/placeholder.jpg';
  }}
/>
```

### Form Validation

The ContactForm component implements client-side validation:

1. **Required Fields**: Name, contact, and description are required
2. **Email Validation**: Contact field validates email format if not a Telegram handle
3. **Length Limits**: Description has a maximum length of 1000 characters
4. **Budget Selection**: Budget dropdown requires selection before submission

Error states are displayed with:
- Red border (--color-error) on invalid fields
- Error message text below the field
- Prevention of form submission until validation passes

### Responsive Layout Breakage

CSS Grid and Flexbox layouts include fallback behavior:

```css
/* Grid with fallback */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

/* Ensures content doesn't break on very small screens */
@media (max-width: 320px) {
  grid-template-columns: 1fr;
  padding: var(--spacing-4);
}
```

### Font Loading Failures

If custom fonts fail to load, the system falls back to system fonts:

```typescript
// Font loading with fallback
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['700', '800', '900'],
  variable: '--font-headline',
  display: 'swap', // Shows fallback font immediately
  fallback: ['Arial Black', 'sans-serif'],
});
```

### Missing Data Handling

Components handle missing or incomplete data gracefully:

```typescript
// ProjectCard with safe defaults
const ProjectCard = ({ project }: ProjectCardProps) => {
  const {
    title = 'Untitled Project',
    description = '',
    image = '/images/placeholder.jpg',
    imageAlt = 'Project image',
    category = 'Uncategorized',
    year = new Date().getFullYear().toString(),
  } = project;
  
  // Component rendering...
};
```

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property Tests**: Verify universal properties across all inputs through randomization

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Testing Framework Selection

**Unit Testing**:
- Framework: Jest + React Testing Library
- Component testing with user interaction simulation
- Snapshot testing for component structure
- CSS module testing for style application

**Property-Based Testing**:
- Framework: fast-check (JavaScript/TypeScript property-based testing library)
- Minimum 100 iterations per property test
- Each test tagged with reference to design document property

### Property Test Configuration

Each property-based test must:

1. Run a minimum of 100 iterations to ensure statistical coverage
2. Include a comment tag referencing the design document property
3. Use appropriate generators for test data (colors, dimensions, strings, etc.)

Tag format:
```typescript
// Feature: brutalist-portfolio-nextjs, Property 1: Button Hover Shadow Application
```

### Unit Test Coverage Areas

**Component Tests**:
- Navigation component renders all required links
- Footer component displays social media links
- ProjectCard component displays all project information
- ContactForm component validates input fields
- SkillCard component renders skill name and icon

**Integration Tests**:
- Navigation highlights active page correctly
- Form submission triggers validation
- Responsive layout changes at breakpoints
- Image lazy loading behavior

**Edge Cases**:
- Empty project list handling
- Missing image fallback
- Form validation with invalid inputs
- Very long text content overflow handling

### Property Test Coverage Areas

**CSS Properties** (Properties 1-16):
- Hover states apply correct styles to all interactive elements
- Transition durations fall within specified ranges
- Transform values match specifications
- Color values match design tokens

**Accessibility Properties** (Properties 17-21):
- All pages have valid heading hierarchy
- All images have alt text
- All icon buttons have aria-labels
- All form inputs have associated labels
- Color contrast meets WCAG AA standards

**Responsive Properties** (Property 10):
- Touch targets meet minimum size requirements on mobile
- Layout adapts correctly at all breakpoints

### Example Property Test

```typescript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { ProjectCard } from '@/components/ProjectCard';

// Feature: brutalist-portfolio-nextjs, Property 2: Image Grayscale Transition
describe('Image Grayscale Transition Property', () => {
  it('should transition from grayscale to color on hover for all images', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string(),
          title: fc.string(),
          description: fc.string(),
          category: fc.constantFrom('Веб-Дизайн', 'Брендинг', 'Типографика', 'UI/UX'),
          year: fc.integer({ min: 2020, max: 2024 }).map(String),
          image: fc.constant('/images/test.jpg'),
          imageAlt: fc.string(),
        }),
        (project) => {
          const { container } = render(<ProjectCard project={project} />);
          const img = container.querySelector('img');
          const styles = window.getComputedStyle(img!);
          
          // Check grayscale filter is applied
          expect(styles.filter).toContain('grayscale');
          
          // Check transition duration is 500ms
          expect(styles.transitionDuration).toBe('500ms');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Example Unit Test

```typescript
import { render, screen } from '@testing-library/react';
import { Navigation } from '@/components/Navigation';

describe('Navigation Component', () => {
  it('should display the АРХИВ-24 logo text', () => {
    render(<Navigation currentPath="/" />);
    expect(screen.getByText('АРХИВ-24')).toBeInTheDocument();
  });

  it('should include links to Portfolio, About Me, and Contact pages', () => {
    render(<Navigation currentPath="/" />);
    expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('should include ЗАКАЗАТЬ button with primary color background', () => {
    render(<Navigation currentPath="/" />);
    const button = screen.getByRole('button', { name: /заказать/i });
    expect(button).toHaveStyle({ backgroundColor: '#ffd709' });
  });
});
```

### CSS Testing Strategy

CSS properties are tested through:

1. **Computed Style Verification**: Check that elements have correct computed styles
2. **CSS Module Snapshot Testing**: Ensure CSS modules generate expected class names
3. **Visual Regression Testing**: Optional Playwright screenshots for visual changes

### Accessibility Testing

Accessibility is verified through:

1. **Automated Testing**: jest-axe for automated accessibility checks
2. **Property Tests**: Verify WCAG compliance properties (contrast, labels, hierarchy)
3. **Manual Testing**: Keyboard navigation and screen reader testing

### Performance Testing

While not part of automated testing, performance is monitored through:

1. **Lighthouse CI**: Run on each build to track performance metrics
2. **Bundle Analysis**: Monitor CSS and JavaScript bundle sizes
3. **Core Web Vitals**: Track LCP, FID, and CLS metrics

### Test Execution

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- --testPathPattern=unit

# Run property tests only
npm test -- --testPathPattern=property

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Continuous Integration

Tests run automatically on:
- Every pull request
- Every commit to main branch
- Nightly builds for comprehensive property test runs (1000+ iterations)

Minimum requirements for merge:
- All unit tests pass
- All property tests pass (100 iterations)
- Code coverage > 80%
- No accessibility violations
- Lighthouse performance score > 90

