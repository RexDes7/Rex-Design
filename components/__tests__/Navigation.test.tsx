import { render, screen } from '@/lib/test-utils'
import Navigation from '@/components/Navigation'

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('Navigation Component', () => {
  it('should display the АРХИВ-24 logo text', () => {
    render(<Navigation />)
    expect(screen.getByText('АРХИВ-24')).toBeInTheDocument()
  })

  it('should include links to Portfolio, About Me, and Contact pages', () => {
    render(<Navigation />)
    expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about me/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('should include ЗАКАЗАТЬ button', () => {
    render(<Navigation />)
    const button = screen.getByRole('link', { name: /заказать/i })
    expect(button).toBeInTheDocument()
  })
})
