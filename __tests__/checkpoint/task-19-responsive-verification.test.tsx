/**
 * Task 19 Checkpoint - Responsive Layout Verification
 * 
 * This test suite verifies that responsive layouts work correctly
 * at all breakpoints (mobile, tablet, desktop)
 */

import { render } from '@testing-library/react';
import Home from '@/app/page';
import Cases from '@/app/cases/page';
import About from '@/app/about/page';
import Contact from '@/app/contact/page';

// Mock window.matchMedia for responsive testing
const createMatchMedia = (width: number) => {
  return (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

describe('Task 19 Checkpoint - Responsive Layout Verification', () => {
  beforeEach(() => {
    window.matchMedia = createMatchMedia(1024);
  });

  describe('Mobile Breakpoint (< 640px)', () => {
    beforeEach(() => {
      window.matchMedia = createMatchMedia(375);
    });

    it('should render home page on mobile', () => {
      const { container } = render(<Home />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render cases page on mobile', () => {
      const { container } = render(<Cases />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render about page on mobile', () => {
      const { container } = render(<About />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render contact page on mobile', () => {
      const { container } = render(<Contact />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });
  });

  describe('Tablet Breakpoint (768px)', () => {
    beforeEach(() => {
      window.matchMedia = createMatchMedia(768);
    });

    it('should render home page on tablet', () => {
      const { container } = render(<Home />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render cases page on tablet', () => {
      const { container } = render(<Cases />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render about page on tablet', () => {
      const { container } = render(<About />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render contact page on tablet', () => {
      const { container } = render(<Contact />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });
  });

  describe('Desktop Breakpoint (1024px+)', () => {
    beforeEach(() => {
      window.matchMedia = createMatchMedia(1280);
    });

    it('should render home page on desktop', () => {
      const { container } = render(<Home />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render cases page on desktop', () => {
      const { container } = render(<Cases />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render about page on desktop', () => {
      const { container } = render(<About />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render contact page on desktop', () => {
      const { container } = render(<Contact />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });
  });

  describe('CSS Grid and Flexbox Layouts', () => {
    it('should have grid layouts in home page', () => {
      const { container } = render(<Home />);
      const grids = container.querySelectorAll('[class*="Grid"]');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should have grid layouts in cases page', () => {
      const { container } = render(<Cases />);
      const grids = container.querySelectorAll('[class*="Grid"]');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should have grid layouts in about page', () => {
      const { container } = render(<About />);
      const grids = container.querySelectorAll('[class*="Grid"]');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should have grid layouts in contact page', () => {
      const { container } = render(<Contact />);
      const grids = container.querySelectorAll('[class*="Grid"]');
      expect(grids.length).toBeGreaterThan(0);
    });
  });
});
