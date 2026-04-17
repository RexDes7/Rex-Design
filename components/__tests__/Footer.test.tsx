import { render, screen } from '@/lib/test-utils'
import Footer from '@/components/Footer'

describe('Footer Component', () => {
  it('should display the АРХИВ-24 branding', () => {
    render(<Footer />)
    expect(screen.getByText('АРХИВ-24')).toBeInTheDocument()
  })

  it('should include social media links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /telegram/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /behance/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /dribbble/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument()
  })

  it('should display copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2024/i)).toBeInTheDocument()
  })
})
