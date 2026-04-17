# Brutalist Portfolio - Next.js

A modern Next.js 14+ application implementing the "Цифровой Манифест" (Digital Manifesto) brutalist design aesthetic.

## Project Structure

```
brutalist-portfolio-nextjs/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── cases/             # Portfolio page
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
├── styles/                # CSS modules and global styles
│   └── tokens.css         # Design system tokens
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions and data
├── public/                # Static assets
│   └── images/            # Image files
└── package.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **CSS Modules** - Scoped styling
- **React 18** - UI library

## Design System

The project implements a brutalist design system with:
- Zero border radius
- Hard shadows (4px and 8px variants)
- Bold typography (Plus Jakarta Sans, Space Grotesk)
- High contrast colors
- Primary accent: #ffd709 (bold yellow)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Requirements

- Node.js 18+ 
- npm or yarn
