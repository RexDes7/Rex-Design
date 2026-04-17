# Requirements Document: Pixel-Perfect HTML Parity

## Introduction

This document specifies the requirements for achieving exact visual matching between the Next.js implementation and the original HTML files. The system must correct specific CSS values for shadows, borders, typography, padding, and hover effects to ensure pixel-perfect parity with the original brutalist design specifications.

## Glossary

- **Shadow_System**: The CSS custom properties and classes that define box-shadow values for the brutalist design aesthetic
- **Navigation_Component**: The navigation bar component containing links with active state styling
- **Manifesto_Card**: A card component displaying numbered manifesto points with hover effects
- **Project_Card**: A card component displaying project information with borders and hover effects
- **Contact_Form**: The contact form component with input fields and styling
- **Footer_Component**: The footer component containing social links and background styling
- **CSS_Module**: A CSS file scoped to a specific component using CSS Modules
- **Design_Token**: A CSS custom property defined in globals.css for consistent styling
- **Hover_Effect**: Visual changes that occur when a user hovers over an interactive element
- **Viewport**: The visible area of the web page, categorized as mobile (< 768px) or desktop (>= 768px)

## Requirements

### Requirement 1: Shadow System Implementation

**User Story:** As a developer, I want consistent shadow values across all components, so that the visual design matches the original HTML specifications.

#### Acceptance Criteria

1. THE Shadow_System SHALL define a small shadow as 4px 4px 0px 0px #000000
2. THE Shadow_System SHALL define a default shadow as 8px 8px 0px 0px #000000
3. THE Shadow_System SHALL define a hover shadow as 12px 12px 0px 0px #000000
4. WHEN a component uses shadow styling, THE Shadow_System SHALL apply values from CSS custom properties
5. THE Shadow_System SHALL maintain consistent shadow values across all components

### Requirement 2: Navigation Active Link Styling

**User Story:** As a user, I want to see clear visual indication of the active page, so that I know where I am in the site navigation.

#### Acceptance Criteria

1. WHEN a navigation link is active, THE Navigation_Component SHALL apply an underline with 8px offset
2. WHEN a navigation link is active, THE Navigation_Component SHALL apply an underline with 4px thickness
3. WHEN a navigation link is active, THE Navigation_Component SHALL use black color (#000000)
4. THE Navigation_Component SHALL maintain consistent active styling across all viewport sizes

### Requirement 3: Hero Section Typography and Spacing

**User Story:** As a user, I want the hero section to have proper visual hierarchy, so that the main message is clear and impactful.

#### Acceptance Criteria

1. THE Hero_Section SHALL apply 5rem (80px) vertical padding
2. WHEN viewport is mobile, THE Hero_Section SHALL use 6rem (96px) title font size
3. WHEN viewport is desktop, THE Hero_Section SHALL use 8rem (128px) title font size
4. WHEN viewport is mobile, THE Hero_Section SHALL use 1.25rem (20px) subtitle font size
5. WHEN viewport is desktop, THE Hero_Section SHALL use 1.5rem (24px) subtitle font size

### Requirement 4: Manifesto Card Styling

**User Story:** As a user, I want manifesto cards to have clear visual structure with engaging hover effects, so that the content is easy to read and interact with.

#### Acceptance Criteria

1. THE Manifesto_Card SHALL apply 3rem (48px) padding on all sides
2. THE Manifesto_Card SHALL display the number at 6rem (96px) font size
3. THE Manifesto_Card SHALL display the number at 0.1 opacity in default state
4. WHEN a user hovers over a Manifesto_Card, THE Manifesto_Card SHALL change number opacity to 1.0
5. THE Manifesto_Card SHALL maintain consistent padding across all viewport sizes

### Requirement 5: Project Card Border and Shadow Effects

**User Story:** As a user, I want project cards to have distinctive borders and engaging hover effects, so that interactive elements are clear and visually appealing.

#### Acceptance Criteria

1. THE Project_Card SHALL apply a 4px solid black border
2. THE Project_Card SHALL apply an 8px 8px 0px 0px #000000 shadow in default state
3. WHEN a user hovers over a Project_Card, THE Project_Card SHALL apply a 12px 12px 0px 0px #000000 shadow
4. WHEN a user hovers over a Project_Card, THE Project_Card SHALL apply a translate(-4px, -4px) transform
5. THE Project_Card SHALL maintain 4px border width during hover state

### Requirement 6: Contact Form Input Styling

**User Story:** As a user, I want contact form inputs to be clearly visible and appropriately sized, so that I can easily enter my information.

#### Acceptance Criteria

1. THE Contact_Form SHALL apply a 4px border width to all input fields
2. WHEN viewport is mobile, THE Contact_Form SHALL use 2.25rem (36px) font size for inputs
3. WHEN viewport is desktop, THE Contact_Form SHALL use 3rem (48px) font size for inputs
4. THE Contact_Form SHALL maintain consistent border styling across all input fields
5. THE Contact_Form SHALL apply black (#000000) border color to all input fields

### Requirement 7: Footer Background and Link Hover Effects

**User Story:** As a user, I want the footer to have a distinct background and engaging link hover effects, so that social links are easy to identify and interact with.

#### Acceptance Criteria

1. THE Footer_Component SHALL apply #f5f5f4 (stone-100) background color
2. WHEN a user hovers over a footer social link, THE Footer_Component SHALL apply italic font style
3. WHEN a user hovers over a footer social link, THE Footer_Component SHALL apply scale(1.05) transform
4. THE Footer_Component SHALL maintain consistent background color across all viewport sizes
5. THE Footer_Component SHALL apply hover effects to all social links

### Requirement 8: CSS Custom Properties System

**User Story:** As a developer, I want centralized design tokens, so that styling is consistent and maintainable across all components.

#### Acceptance Criteria

1. THE CSS_Module system SHALL define shadow values as CSS custom properties in globals.css
2. WHEN a component needs shadow styling, THE CSS_Module system SHALL reference CSS custom properties
3. THE CSS_Module system SHALL maintain a single source of truth for design tokens
4. THE CSS_Module system SHALL allow components to override values when necessary
5. THE CSS_Module system SHALL ensure all components use consistent design tokens

### Requirement 9: Responsive Typography Scaling

**User Story:** As a user, I want text to be appropriately sized for my device, so that content is readable and visually balanced.

#### Acceptance Criteria

1. WHEN viewport width is less than 768px, THE system SHALL apply mobile typography sizes
2. WHEN viewport width is 768px or greater, THE system SHALL apply desktop typography sizes
3. THE system SHALL maintain consistent typography scaling across all components
4. THE system SHALL ensure smooth transitions between mobile and desktop sizes
5. THE system SHALL preserve text readability at all viewport sizes

### Requirement 10: Hover Effect Consistency

**User Story:** As a user, I want consistent hover effects across all interactive elements, so that the interface feels cohesive and predictable.

#### Acceptance Criteria

1. WHEN a user hovers over an interactive element, THE system SHALL apply hover effects within 200ms
2. THE system SHALL use hardware-accelerated transforms for hover effects
3. THE system SHALL maintain consistent shadow progression (8px → 12px) for hover states
4. THE system SHALL apply consistent transform values for hover states
5. THE system SHALL ensure hover effects work across all supported browsers
