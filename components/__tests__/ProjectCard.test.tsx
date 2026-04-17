import { render, screen } from '@/lib/test-utils'
import ProjectCard from '@/components/ProjectCard'
import { Project } from '@/types/project'

const mockProject: Project = {
  id: 'test-1',
  title: 'Test Project',
  description: 'Test Description',
  category: 'Веб-Дизайн',
  year: '2024',
  image: '/images/test.jpg',
  imageAlt: 'Test Image',
}

describe('ProjectCard Component', () => {
  it('should render project title', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('should render project description', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should render project category', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Веб-Дизайн')).toBeInTheDocument()
  })

  it('should render project year', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('should render project image with alt text', () => {
    render(<ProjectCard project={mockProject} />)
    const image = screen.getByAltText('Test Image')
    expect(image).toBeInTheDocument()
  })
})
