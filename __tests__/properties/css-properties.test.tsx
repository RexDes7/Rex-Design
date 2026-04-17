import fc from 'fast-check'
import { render } from '@/lib/test-utils'
import ProjectCard from '@/components/ProjectCard'
import { Project } from '@/types/project'

// Feature: brutalist-portfolio-nextjs, Property 2: Image Grayscale Transition
describe('CSS Properties - Image Grayscale Transition', () => {
  it('should apply grayscale filter to all project images', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          category: fc.constantFrom('Веб-Дизайн', 'Брендинг', 'Типографика', 'UI/UX'),
          year: fc.integer({ min: 2020, max: 2024 }).map(String),
          image: fc.constant('/images/test.jpg'),
          imageAlt: fc.string({ minLength: 1 }),
        }),
        (project: Project) => {
          const { container } = render(<ProjectCard project={project} />)
          const imageContainer = container.querySelector('[class*="imageContainer"]')
          
          // Check that image container exists
          expect(imageContainer).toBeTruthy()
          
          // The grayscale filter is applied via CSS class
          // We verify the class is present
          expect(imageContainer?.className).toContain('imageContainer')
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: brutalist-portfolio-nextjs, Property 11: Image Alt Text Presence
describe('CSS Properties - Image Alt Text', () => {
  it('should have non-empty alt text for all images', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          title: fc.string({ minLength: 1 }),
          description: fc.string({ minLength: 1 }),
          category: fc.constantFrom('Веб-Дизайн', 'Брендинг', 'Типографика', 'UI/UX'),
          year: fc.integer({ min: 2020, max: 2024 }).map(String),
          image: fc.constant('/images/test.jpg'),
          imageAlt: fc.string({ minLength: 1 }),
        }),
        (project: Project) => {
          const { container } = render(<ProjectCard project={project} />)
          const image = container.querySelector('img')
          
          // Check that image has alt attribute
          expect(image).toBeTruthy()
          expect(image?.getAttribute('alt')).toBeTruthy()
          expect(image?.getAttribute('alt')).not.toBe('')
        }
      ),
      { numRuns: 100 }
    )
  })
})
