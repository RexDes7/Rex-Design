/**
 * Integration Test: Cases Page Filter Functionality
 * Task 25.2: Test filter functionality on Cases page
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CasesPage from '@/app/cases/page';

describe('Cases Page Filter Functionality', () => {
  it('should render filter bar with all categories', () => {
    render(<CasesPage />);
    
    // Check all filter buttons are present
    expect(screen.getByRole('button', { name: /все проекты/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /веб-дизайн/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /брендинг/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /типографика/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ui\/ux/i })).toBeInTheDocument();
  });

  it('should show all projects by default', () => {
    render(<CasesPage />);
    
    // Should show multiple project cards
    const projectCards = screen.getAllByRole('article');
    expect(projectCards.length).toBeGreaterThan(0);
  });

  it('should filter projects by category when filter button is clicked', async () => {
    const user = userEvent.setup();
    render(<CasesPage />);
    
    // Get initial project count
    const initialProjects = screen.getAllByRole('article');
    const initialCount = initialProjects.length;
    
    // Click on Веб-Дизайн filter
    const webDesignButton = screen.getByRole('button', { name: /веб-дизайн/i });
    await user.click(webDesignButton);
    
    // Projects should be filtered
    const filteredProjects = screen.getAllByRole('article');
    
    // Verify all visible projects have the correct category
    filteredProjects.forEach(project => {
      expect(within(project).getByText(/веб-дизайн/i)).toBeInTheDocument();
    });
  });

  it('should show all projects when "Все Проекты" is clicked', async () => {
    const user = userEvent.setup();
    render(<CasesPage />);
    
    // First filter by a category
    const webDesignButton = screen.getByRole('button', { name: /веб-дизайн/i });
    await user.click(webDesignButton);
    
    // Then click "Все Проекты"
    const allProjectsButton = screen.getByRole('button', { name: /все проекты/i });
    await user.click(allProjectsButton);
    
    // Should show all projects again
    const allProjects = screen.getAllByRole('article');
    expect(allProjects.length).toBeGreaterThan(0);
  });

  it('should visually indicate active filter', async () => {
    const user = userEvent.setup();
    render(<CasesPage />);
    
    // Click on Брендинг filter
    const brandingButton = screen.getByRole('button', { name: /брендинг/i });
    await user.click(brandingButton);
    
    // Active filter should have active class
    expect(brandingButton).toHaveClass('active');
  });

  it('should handle multiple filter clicks', async () => {
    const user = userEvent.setup();
    render(<CasesPage />);
    
    // Click through multiple filters
    await user.click(screen.getByRole('button', { name: /веб-дизайн/i }));
    await user.click(screen.getByRole('button', { name: /брендинг/i }));
    await user.click(screen.getByRole('button', { name: /типографика/i }));
    await user.click(screen.getByRole('button', { name: /ui\/ux/i }));
    await user.click(screen.getByRole('button', { name: /все проекты/i }));
    
    // Should end up showing all projects
    const allProjects = screen.getAllByRole('article');
    expect(allProjects.length).toBeGreaterThan(0);
  });

  it('should render project cards with all required information', () => {
    render(<CasesPage />);
    
    const projectCards = screen.getAllByRole('article');
    
    // Check first project card has required elements
    const firstCard = projectCards[0];
    expect(within(firstCard).getByRole('img')).toBeInTheDocument();
    expect(within(firstCard).getByRole('heading')).toBeInTheDocument();
  });

  it('should have responsive grid layout', () => {
    const { container } = render(<CasesPage />);
    
    // Check that projects container exists
    const projectsGrid = container.querySelector('[class*="projectsGrid"]');
    expect(projectsGrid).toBeInTheDocument();
  });
});
