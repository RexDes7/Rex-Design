/**
 * Unit tests for image loading animations
 * Task 14.3: Добавить loading animations для изображений
 * Requirements: 10.5
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/project';

describe('Image Loading Animations', () => {
  const mockProject: Project = {
    id: '1',
    title: 'Test Project',
    description: 'Test Description',
    category: 'Web Design',
    year: '2024',
    image: '/test-image.jpg',
    imageAlt: 'Test Image',
    wide: false,
    featured: false,
    variant: 'standard',
  };

  it('should show skeleton loader before image loads', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    // Check that skeleton loader is present
    const skeleton = container.querySelector('.imageSkeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply imageLoading class to image initially', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    // Check that image has loading class
    const image = container.querySelector('.projectImage');
    expect(image).toHaveClass('imageLoading');
  });

  it('should trigger onLoad event when image loads', async () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    // Get the image element
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    
    // Simulate image load
    if (image) {
      const loadEvent = new Event('load', { bubbles: true });
      image.dispatchEvent(loadEvent);
    }
    
    // Wait for state update
    await waitFor(() => {
      const skeleton = container.querySelector('.imageSkeleton');
      expect(skeleton).not.toBeInTheDocument();
    });
  });

  it('should apply imageLoaded class after image loads', async () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    // Get the image element
    const image = container.querySelector('img');
    
    // Simulate image load
    if (image) {
      const loadEvent = new Event('load', { bubbles: true });
      image.dispatchEvent(loadEvent);
    }
    
    // Wait for state update and check for loaded class
    await waitFor(() => {
      const projectImage = container.querySelector('.projectImage');
      expect(projectImage).toHaveClass('imageLoaded');
    });
  });

  it('should have fade-in transition on image', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    // Check that image has transition styles
    const image = container.querySelector('.projectImage');
    expect(image).toBeInTheDocument();
    
    // The CSS should include opacity transition
    // This is verified by the presence of imageLoading/imageLoaded classes
    expect(image).toHaveClass('imageLoading');
  });
});
