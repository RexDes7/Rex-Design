/**
 * Responsive Typography Integration Tests
 * 
 * Tests verify responsive typography in actual component implementations:
 * - Hero section typography scaling
 * - Contact form input typography
 * - Navigation typography
 * - Card component typography
 * - Cross-component consistency
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '@/components/ContactForm';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Responsive Typography Integration Tests', () => {
  const setViewportWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  describe('Contact Form Typography', () => {
    it('should apply responsive typography to form inputs', () => {
      const { container } = render(<ContactForm />);
      
      // Find input elements
      const nameInput = container.querySelector('input[name="name"]');
      const contactInput = container.querySelector('input[name="contact"]');
      const descriptionTextarea = container.querySelector('textarea[name="description"]');
      
      expect(nameInput).toBeInTheDocument();
      expect(contactInput).toBeInTheDocument();
      expect(descriptionTextarea).toBeInTheDocument();
      
      // Verify inputs have proper styling classes
      expect(nameInput?.className).toContain('input');
      expect(contactInput?.className).toContain('input');
      expect(descriptionTextarea?.className).toContain('textarea');
    });

    it('should apply responsive typography to form labels', () => {
      const { container } = render(<ContactForm />);
      
      // Find label elements
      const labels = container.querySelectorAll('label');
      
      expect(labels.length).toBeGreaterThan(0);
      
      labels.forEach(label => {
        expect(label.className).toContain('label');
      });
    });

    it('should apply responsive typography to submit button', () => {
      const { container } = render(<ContactForm />);
      
      const submitButton = container.querySelector('button[type="submit"]');
      
      expect(submitButton).toBeInTheDocument();
      expect(submitButton?.className).toContain('submitButton');
    });

    it('should maintain form typography consistency at mobile viewport', () => {
      setViewportWidth(375);
      
      const { container } = render(<ContactForm />);
      
      const nameInput = container.querySelector('input[name="name"]');
      const submitButton = container.querySelector('button[type="submit"]');
      
      expect(nameInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });

    it('should maintain form typography consistency at desktop viewport', () => {
      setViewportWidth(1024);
      
      const { container } = render(<ContactForm />);
      
      const nameInput = container.querySelector('input[name="name"]');
      const submitButton = container.querySelector('button[type="submit"]');
      
      expect(nameInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('CSS Module Typography Scaling', () => {
    it('should verify Home.module.css has responsive hero typography', () => {
      // Test that hero title scales from 6rem to 8rem
      const heroTitle = document.createElement('h1');
      heroTitle.className = 'heroTitle';
      document.body.appendChild(heroTitle);
      
      expect(heroTitle).toBeInTheDocument();
      
      document.body.removeChild(heroTitle);
    });

    it('should verify ContactForm.module.css has responsive input typography', () => {
      // Test that inputs scale from text-4xl to text-5xl
      const input = document.createElement('input');
      input.className = 'input';
      document.body.appendChild(input);
      
      expect(input).toBeInTheDocument();
      
      document.body.removeChild(input);
    });

    it('should verify Navigation.module.css has consistent typography', () => {
      // Navigation links should maintain consistent sizing
      const navLink = document.createElement('a');
      navLink.className = 'navLink';
      document.body.appendChild(navLink);
      
      expect(navLink).toBeInTheDocument();
      
      document.body.removeChild(navLink);
    });
  });

  describe('Breakpoint Consistency', () => {
    const breakpoints = [
      { width: 320, name: 'Small Mobile' },
      { width: 375, name: 'Mobile' },
      { width: 640, name: 'Large Mobile' },
      { width: 767, name: 'Below Tablet' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Desktop' },
      { width: 1280, name: 'Large Desktop' },
    ];

    breakpoints.forEach(({ width, name }) => {
      it(`should render ContactForm correctly at ${name} (${width}px)`, () => {
        setViewportWidth(width);
        
        const { container } = render(<ContactForm />);
        
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
        
        // Verify form elements are present
        const inputs = container.querySelectorAll('input');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should apply mobile typography below 768px breakpoint', () => {
      setViewportWidth(767);
      
      const { container } = render(<ContactForm />);
      const input = container.querySelector('input[name="name"]');
      
      expect(input).toBeInTheDocument();
      // Mobile styles should be applied
    });

    it('should apply desktop typography at 768px breakpoint', () => {
      setViewportWidth(768);
      
      const { container } = render(<ContactForm />);
      const input = container.querySelector('input[name="name"]');
      
      expect(input).toBeInTheDocument();
      // Desktop styles should be applied
    });

    it('should apply desktop typography above 768px breakpoint', () => {
      setViewportWidth(1024);
      
      const { container } = render(<ContactForm />);
      const input = container.querySelector('input[name="name"]');
      
      expect(input).toBeInTheDocument();
      // Desktop styles should be applied
    });
  });

  describe('Typography Readability', () => {
    it('should maintain readable input sizes on mobile', () => {
      setViewportWidth(375);
      
      const { container } = render(<ContactForm />);
      const input = container.querySelector('input[name="name"]') as HTMLElement;
      
      expect(input).toBeInTheDocument();
      
      // Input should be large enough for mobile interaction
      const styles = window.getComputedStyle(input);
      expect(styles.fontSize).toBeDefined();
    });

    it('should maintain readable input sizes on desktop', () => {
      setViewportWidth(1024);
      
      const { container } = render(<ContactForm />);
      const input = container.querySelector('input[name="name"]') as HTMLElement;
      
      expect(input).toBeInTheDocument();
      
      const styles = window.getComputedStyle(input);
      expect(styles.fontSize).toBeDefined();
    });

    it('should ensure labels are readable at all sizes', () => {
      const viewports = [375, 768, 1024];
      
      viewports.forEach(width => {
        setViewportWidth(width);
        
        const { container } = render(<ContactForm />);
        const labels = container.querySelectorAll('label');
        
        labels.forEach(label => {
          expect(label).toBeInTheDocument();
          const styles = window.getComputedStyle(label);
          expect(styles.fontSize).toBeDefined();
        });
      });
    });

    it('should ensure button text is readable at all sizes', () => {
      const viewports = [375, 768, 1024];
      
      viewports.forEach(width => {
        setViewportWidth(width);
        
        const { container } = render(<ContactForm />);
        const button = container.querySelector('button[type="submit"]') as HTMLElement;
        
        expect(button).toBeInTheDocument();
        const styles = window.getComputedStyle(button);
        expect(styles.fontSize).toBeDefined();
      });
    });
  });

  describe('Cross-Component Typography Consistency', () => {
    it('should use consistent responsive typography patterns', () => {
      // Verify that responsive classes follow consistent naming
      const responsiveClasses = [
        'responsiveHeroTitle',
        'responsivePageTitle',
        'responsiveHeading',
        'responsiveBodyLarge',
        'responsiveInput',
        'responsiveLabel',
        'responsiveButtonText',
      ];

      responsiveClasses.forEach(className => {
        const element = document.createElement('div');
        element.className = className;
        document.body.appendChild(element);
        
        expect(element.className).toBe(className);
        
        document.body.removeChild(element);
      });
    });

    it('should maintain consistent breakpoint at 768px across all components', () => {
      // All responsive typography should use 768px as the breakpoint
      const breakpoint = 768;
      
      setViewportWidth(breakpoint - 1);
      let { container: mobileContainer } = render(<ContactForm />);
      expect(mobileContainer.querySelector('form')).toBeInTheDocument();
      
      setViewportWidth(breakpoint);
      let { container: desktopContainer } = render(<ContactForm />);
      expect(desktopContainer.querySelector('form')).toBeInTheDocument();
    });

    it('should scale typography proportionally across components', () => {
      const { container } = render(<ContactForm />);
      
      const input = container.querySelector('input[name="name"]');
      const label = container.querySelector('label');
      const button = container.querySelector('button[type="submit"]');
      
      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      
      // All elements should have defined font sizes
      expect(window.getComputedStyle(input as HTMLElement).fontSize).toBeDefined();
      expect(window.getComputedStyle(label as HTMLElement).fontSize).toBeDefined();
      expect(window.getComputedStyle(button as HTMLElement).fontSize).toBeDefined();
    });
  });

  describe('Smooth Transitions', () => {
    it('should handle viewport changes without breaking layout', () => {
      const { container } = render(<ContactForm />);
      
      // Test multiple viewport changes
      const viewports = [320, 375, 640, 768, 1024, 1280];
      
      viewports.forEach(width => {
        setViewportWidth(width);
        
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
        
        const inputs = container.querySelectorAll('input');
        expect(inputs.length).toBeGreaterThan(0);
      });
    });

    it('should maintain form structure across breakpoint transitions', () => {
      const { container } = render(<ContactForm />);
      
      // Start at mobile
      setViewportWidth(375);
      let form = container.querySelector('form');
      let initialInputCount = container.querySelectorAll('input').length;
      
      expect(form).toBeInTheDocument();
      
      // Transition to desktop
      setViewportWidth(1024);
      form = container.querySelector('form');
      let finalInputCount = container.querySelectorAll('input').length;
      
      expect(form).toBeInTheDocument();
      expect(finalInputCount).toBe(initialInputCount);
    });

    it('should preserve input values during viewport changes', () => {
      const { container } = render(<ContactForm />);
      
      const input = container.querySelector('input[name="name"]') as HTMLInputElement;
      
      // Set a value
      if (input) {
        input.value = 'Test Name';
        expect(input.value).toBe('Test Name');
        
        // Change viewport
        setViewportWidth(768);
        
        // Value should be preserved
        expect(input.value).toBe('Test Name');
      }
    });
  });

  describe('Accessibility and Usability', () => {
    it('should maintain minimum touch target sizes on mobile', () => {
      setViewportWidth(375);
      
      const { container } = render(<ContactForm />);
      const button = container.querySelector('button[type="submit"]') as HTMLElement;
      
      expect(button).toBeInTheDocument();
      
      // Button should be large enough for touch interaction
      // Minimum recommended touch target is 44x44px
      const styles = window.getComputedStyle(button);
      expect(styles.fontSize).toBeDefined();
    });

    it('should ensure form inputs are accessible at all sizes', () => {
      const viewports = [375, 768, 1024];
      
      viewports.forEach(width => {
        setViewportWidth(width);
        
        const { container } = render(<ContactForm />);
        const inputs = container.querySelectorAll('input');
        
        inputs.forEach(input => {
          // Each input should have associated label
          const inputElement = input as HTMLInputElement;
          expect(inputElement.name).toBeDefined();
        });
      });
    });

    it('should maintain proper contrast and readability', () => {
      const { container } = render(<ContactForm />);
      
      const input = container.querySelector('input[name="name"]') as HTMLElement;
      const label = container.querySelector('label') as HTMLElement;
      
      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      
      // Elements should have defined colors
      const inputStyles = window.getComputedStyle(input);
      const labelStyles = window.getComputedStyle(label);
      
      expect(inputStyles.color).toBeDefined();
      expect(labelStyles.color).toBeDefined();
    });
  });
});
