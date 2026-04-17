/**
 * Task 19 Checkpoint - Verify All Pages
 * 
 * This test suite verifies that all pages in the brutalist portfolio
 * application are working correctly:
 * - Home page (app/page.tsx)
 * - Cases/Portfolio page (app/cases/page.tsx)
 * - About page (app/about/page.tsx)
 * - Contact page (app/contact/page.tsx)
 */

import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import Cases from '@/app/cases/page';
import About from '@/app/about/page';
import Contact from '@/app/contact/page';

describe('Task 19 Checkpoint - All Pages Verification', () => {
  describe('Home Page', () => {
    it('should render the home page without errors', () => {
      render(<Home />);
      expect(screen.getByText(/АРХИВ-2024/i)).toBeInTheDocument();
    });

    it('should display the manifesto section', () => {
      render(<Home />);
      expect(screen.getByText(/ЦИФРОВОЙ МАНИФЕСТ/i)).toBeInTheDocument();
    });

    it('should display manifesto cards', () => {
      render(<Home />);
      expect(screen.getByRole('heading', { name: /БРУТАЛЬНОСТЬ/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /ЧЕСТНОСТЬ/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /СИГНАЛ/i })).toBeInTheDocument();
    });

    it('should display featured projects section', () => {
      render(<Home />);
      expect(screen.getByText(/ИЗБРАННЫЕ ПРОЕКТЫ/i)).toBeInTheDocument();
    });

    it('should display contact form', () => {
      render(<Home />);
      expect(screen.getByLabelText(/ИМЯ/i)).toBeInTheDocument();
      // Contact form uses "EMAIL / TELEGRAM" label
      expect(screen.getByLabelText(/EMAIL \/ TELEGRAM/i)).toBeInTheDocument();
    });
  });

  describe('Cases/Portfolio Page', () => {
    it('should render the cases page without errors', () => {
      render(<Cases />);
      // Check for the h1 heading specifically
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should display filter bar with categories', () => {
      render(<Cases />);
      // Check for filter buttons specifically
      const filterButtons = screen.getAllByRole('button');
      expect(filterButtons.length).toBeGreaterThanOrEqual(5);
      expect(screen.getByRole('button', { name: /ВСЕ ПРОЕКТЫ/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ВЕБ-ДИЗАЙН/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /БРЕНДИНГ/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ТИПОГРАФИКА/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /UI\/UX/i })).toBeInTheDocument();
    });

    it('should display project cards', () => {
      render(<Cases />);
      // Check for at least one project card
      const projectCards = screen.getAllByRole('article');
      expect(projectCards.length).toBeGreaterThan(0);
    });

    it('should display CTA section', () => {
      render(<Cases />);
      // CTA section exists - checking for the button instead
      const ctaButtons = screen.getAllByRole('link');
      expect(ctaButtons.length).toBeGreaterThan(0);
    });
  });

  describe('About Page', () => {
    it('should render the about page without errors', () => {
      const { container } = render(<About />);
      // The title is split across multiple elements with a span
      expect(container.textContent).toMatch(/ДИЗАЙН/i);
      expect(container.textContent).toMatch(/КАК ОРУЖИЕ/i);
      expect(container.textContent).toMatch(/МЫСЛИ/i);
    });

    it('should display biographical text', () => {
      render(<About />);
      expect(screen.getByText(/МУЛЬТИДИСЦИПЛИНАРНЫЙ ДИЗАЙНЕР/i)).toBeInTheDocument();
    });

    it('should display skills section', () => {
      render(<About />);
      expect(screen.getByText(/FIGMA/i)).toBeInTheDocument();
      expect(screen.getByText(/MOTION/i)).toBeInTheDocument();
      expect(screen.getByText(/RESEARCH/i)).toBeInTheDocument();
    });

    it('should display statistics card', () => {
      render(<About />);
      expect(screen.getByText(/50\+/i)).toBeInTheDocument();
      expect(screen.getByText(/ПРОЕКТОВ/i)).toBeInTheDocument();
    });

    it('should display CTA section', () => {
      render(<About />);
      expect(screen.getByText(/ЕСТЬ ИДЕЯ/i)).toBeInTheDocument();
    });
  });

  describe('Contact Page', () => {
    it('should render the contact page without errors', () => {
      render(<Contact />);
      expect(screen.getByText(/ДАВАЙТЕ/i)).toBeInTheDocument();
      expect(screen.getByText(/РАБОТАТЬ/i)).toBeInTheDocument();
    });

    it('should display contact form', () => {
      render(<Contact />);
      expect(screen.getByLabelText(/ИМЯ/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/EMAIL \/ TELEGRAM/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/БЮДЖЕТ/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ОПИСАНИЕ ПРОЕКТА/i)).toBeInTheDocument();
    });

    it('should display submit button', () => {
      render(<Contact />);
      expect(screen.getByRole('button', { name: /ОТПРАВИТЬ/i })).toBeInTheDocument();
    });

    it('should display sidebar with contact information', () => {
      render(<Contact />);
      expect(screen.getByText(/КОНТАКТЫ/i)).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render all pages with consistent structure', () => {
      const pages = [
        { component: Home, name: 'Home' },
        { component: Cases, name: 'Cases' },
        { component: About, name: 'About' },
        { component: Contact, name: 'Contact' },
      ];

      pages.forEach(({ component: PageComponent, name }) => {
        const { container } = render(<PageComponent />);
        // Each page should have a main element
        const main = container.querySelector('main');
        expect(main).toBeInTheDocument();
      });
    });
  });
});
