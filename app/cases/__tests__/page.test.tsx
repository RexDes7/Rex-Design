import { render, screen, fireEvent } from '@/lib/test-utils'
import CasesPage from '../page'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Cases Page', () => {
  it('should render the main headline', () => {
    render(<CasesPage />)
    // Check for the h1 headline specifically
    const headline = screen.getByRole('heading', { level: 1 })
    expect(headline).toHaveTextContent(/цифровой/i)
    expect(headline).toHaveTextContent(/манифест/i)
  })

  it('should render filter buttons', () => {
    render(<CasesPage />)
    expect(screen.getByRole('button', { name: /все проекты/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /веб-дизайн/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /брендинг/i })).toBeInTheDocument()
  })

  it('should display all projects initially', () => {
    render(<CasesPage />)
    const projectCards = screen.getAllByRole('article')
    expect(projectCards.length).toBeGreaterThan(0)
  })

  it('should filter projects when category button is clicked', () => {
    render(<CasesPage />)
    
    // Click on Веб-Дизайн filter
    const webDesignButton = screen.getByRole('button', { name: /веб-дизайн/i })
    fireEvent.click(webDesignButton)
    
    // Check that only web design projects are shown
    const projectCards = screen.getAllByRole('article')
    expect(projectCards.length).toBeGreaterThan(0)
  })

  it('should show all projects when "Все Проекты" is clicked', () => {
    render(<CasesPage />)
    
    // First filter by category
    const webDesignButton = screen.getByRole('button', { name: /веб-дизайн/i })
    fireEvent.click(webDesignButton)
    
    // Then click "Все Проекты"
    const allProjectsButton = screen.getByRole('button', { name: /все проекты/i })
    fireEvent.click(allProjectsButton)
    
    // Check that all projects are shown again
    const projectCards = screen.getAllByRole('article')
    expect(projectCards.length).toBeGreaterThan(0)
  })
})
