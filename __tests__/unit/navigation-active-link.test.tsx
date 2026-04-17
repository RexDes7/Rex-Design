/**
 * Unit Test: Navigation Active Link Styling
 * Task 2: Update Navigation component active link styling
 * 
 * This test verifies:
 * - Active link has correct CSS class applied
 * - Active link styling is defined in CSS module
 * - Styling is consistent across viewport sizes
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 * 
 * Note: The actual CSS values (8px offset, 4px thickness, #000000 color)
 * are verified through manual inspection and visual testing, as jsdom
 * doesn't fully support CSS Modules computed styles.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '@/components/Navigation';
import fs from 'fs';
import path from 'path';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/cases'),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

describe('Navigation Active Link Styling - Task 2', () => {
  describe('Active Link Class Application', () => {
    it('should apply active class to the current page link', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/cases');
      
      render(<Navigation />);
      
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      expect(portfolioLink).toHaveClass('active');
    });

    it('should apply active class to about page when on about route', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/about');
      
      render(<Navigation />);
      
      const aboutLink = screen.getByRole('link', { name: /about me/i });
      expect(aboutLink).toHaveClass('active');
    });

    it('should apply active class to contact page when on contact route', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/contact');
      
      render(<Navigation />);
      
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toHaveClass('active');
    });
  });

  describe('CSS Module Verification - Requirements 2.1, 2.2, 2.3', () => {
    it('should have active link styles defined in Navigation.module.css', () => {
      // Read the CSS module file
      const cssPath = path.join(process.cwd(), 'styles', 'Navigation.module.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Verify active link styles are defined (Requirement 2.1, 2.2, 2.3)
      expect(cssContent).toContain('.navLink.active');
      expect(cssContent).toContain('text-underline-offset: 8px');
      expect(cssContent).toContain('text-decoration-thickness: 4px');
      expect(cssContent).toContain('color: #000000');
      expect(cssContent).toContain('text-decoration: underline');
    });

    it('should have active link styles preserved in mobile view (Requirement 2.4)', () => {
      // Read the CSS module file
      const cssPath = path.join(process.cwd(), 'styles', 'Navigation.module.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Find the mobile media query section
      const mobileSection = cssContent.substring(
        cssContent.indexOf('@media (max-width: 640px)')
      );
      
      // Verify active link styles are explicitly defined in mobile section
      expect(mobileSection).toContain('.navLink.active');
      expect(mobileSection).toContain('text-underline-offset: 8px');
      expect(mobileSection).toContain('text-decoration-thickness: 4px');
    });
  });

  describe('Viewport Consistency - Requirement 2.4', () => {
    it('should maintain active class at mobile viewport (320px)', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/cases');
      
      // Set mobile viewport
      global.innerWidth = 320;
      global.dispatchEvent(new Event('resize'));
      
      render(<Navigation />);
      
      const portfolioLink = screen.getByRole('link', { name: /portfolio/i });
      expect(portfolioLink).toHaveClass('active');
    });

    it('should maintain active class at tablet viewport (768px)', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/about');
      
      // Set tablet viewport
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));
      
      render(<Navigation />);
      
      const aboutLink = screen.getByRole('link', { name: /about me/i });
      expect(aboutLink).toHaveClass('active');
    });

    it('should maintain active class at desktop viewport (1280px)', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/contact');
      
      // Set desktop viewport
      global.innerWidth = 1280;
      global.dispatchEvent(new Event('resize'));
      
      render(<Navigation />);
      
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toHaveClass('active');
    });
  });

  describe('Non-Active Links', () => {
    it('should not apply active styling to non-active links', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/cases');
      
      render(<Navigation />);
      
      const aboutLink = screen.getByRole('link', { name: /about me/i });
      expect(aboutLink).not.toHaveClass('active');
      
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).not.toHaveClass('active');
    });
  });
});
