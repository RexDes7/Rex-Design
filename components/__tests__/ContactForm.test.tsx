import { render, screen, fireEvent, waitFor } from '@/lib/test-utils'
import ContactForm from '@/components/ContactForm'

describe('ContactForm Component', () => {
  it('should render all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email.*telegram/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/бюджет/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/описание проекта/i)).toBeInTheDocument()
  })

  it('should have a submit button', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /отправить/i })).toBeInTheDocument()
  })

  it('should update input values when user types', () => {
    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Test Name' } })
    expect(nameInput.value).toBe('Test Name')
  })

  it('should show validation errors for empty required fields', async () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /отправить/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/имя обязательно/i)).toBeInTheDocument()
      expect(screen.getByText(/контакт обязателен/i)).toBeInTheDocument()
      expect(screen.getByText(/описание проекта обязательно/i)).toBeInTheDocument()
    })
  })
})
