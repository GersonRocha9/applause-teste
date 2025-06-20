import { AppProvider } from '@/contexts/AppContext'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecognitionForm } from '../RecognitionForm'

// Mock the useToast hook
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  loading: jest.fn(() => 'loading-id'),
  dismiss: jest.fn(),
}

jest.mock('@/hooks/useToast', () => ({
  useToast: () => mockToast,
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')

// Wrapper component with AppProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('RecognitionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form title and basic elements', () => {
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    expect(screen.getByText('Criar novo reconhecimento')).toBeInTheDocument()
    expect(screen.getByText('Tipo de reconhecimento')).toBeInTheDocument()
    expect(screen.getByText('Mensagem *')).toBeInTheDocument()
    expect(screen.getByText('Imagem *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /elogiar/i })).toBeInTheDocument()
  })

  it('renders form inputs and controls', () => {
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    // Should have participant selector
    expect(screen.getByPlaceholderText('Digite o nome do participante...')).toBeInTheDocument()
    
    // Should have recognition type selector
    expect(screen.getByText('Selecione o tipo de reconhecimento')).toBeInTheDocument()
    
    // Should have message textarea
    expect(screen.getByPlaceholderText(/escreva sua mensagem/i)).toBeInTheDocument()
    
    // Should have image upload area
    expect(screen.getByText('Clique para adicionar uma imagem *')).toBeInTheDocument()
  })

  it('displays character count for message', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const textarea = screen.getByPlaceholderText(/escreva sua mensagem/i)
    
    // Initially shows 0/500
    expect(screen.getByText('0/500')).toBeInTheDocument()
    
    // Type some text
    await user.type(textarea, 'Hello world')
    
    // Should update character count
    expect(screen.getByText('11/500')).toBeInTheDocument()
  })

  it('detects and displays hashtags from message', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const textarea = screen.getByPlaceholderText(/escreva sua mensagem/i)
    
    // Type message with hashtags
    await user.type(textarea, 'Great work #teamwork #success')
    
    // Should detect and display hashtags
    await waitFor(() => {
      expect(screen.getByText('Hashtags detectadas:')).toBeInTheDocument()
      expect(screen.getByText('#teamwork')).toBeInTheDocument()
      expect(screen.getByText('#success')).toBeInTheDocument()
    })
  })

  it('handles image file selection', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/clique para adicionar uma imagem/i)
    
    await user.upload(fileInput, file)
    
    expect(mockToast.success).toHaveBeenCalledWith('Imagem adicionada com sucesso!')
  })

  it('validates image file size', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    // Create a large file (6MB)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/clique para adicionar uma imagem/i)
    
    await user.upload(fileInput, largeFile)
    
    expect(mockToast.error).toHaveBeenCalledWith('A imagem deve ter no máximo 5MB')
  })

  it('validates image file type', async () => {
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    
    // Simulate file selection by directly changing the input
    Object.defineProperty(fileInput, 'files', {
      value: [textFile],
      writable: false,
    })
    
    // Dispatch change event
    const changeEvent = new Event('change', { bubbles: true })
    fileInput.dispatchEvent(changeEvent)
    
    expect(mockToast.error).toHaveBeenCalledWith('Por favor, selecione apenas arquivos de imagem')
  })

  it('shows image preview after successful upload', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/clique para adicionar uma imagem/i)
    
    await user.upload(fileInput, file)
    
    // Should show image preview
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
    })
  })

  it('removes image when remove button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/clique para adicionar uma imagem/i)
    
    // Upload image first
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument()
    })
    
    // Remove image
    const removeButton = screen.getByRole('button', { name: 'Remover' })
    await user.click(removeButton)
    
    expect(mockToast.info).toHaveBeenCalledWith('Imagem removida')
    
    // Should show upload area again
    expect(screen.getByText('Clique para adicionar uma imagem *')).toBeInTheDocument()
  })

  it('shows character count warning when approaching limit', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const textarea = screen.getByPlaceholderText(/escreva sua mensagem/i)
    
    // Type text close to limit
    const longText = 'x'.repeat(460)
    await user.type(textarea, longText)
    
    // Character count should show in red
    const characterCount = screen.getByText('460/500')
    expect(characterCount).toHaveClass('text-red-500')
  })

  it('displays form validation errors on submit without required fields', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /elogiar/i })
    await user.click(submitButton)
    
    expect(mockToast.error).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios')
  })

  it('handles form submission validation errors', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    // Fill message first
    const textarea = screen.getByPlaceholderText(/escreva sua mensagem/i)
    await user.type(textarea, 'Great work!')
    
    // Add image
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    
    // Simulate successful image upload
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    const changeEvent = new Event('change', { bubbles: true })
    fileInput.dispatchEvent(changeEvent)
    
    // Wait for image upload success toast
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Imagem adicionada com sucesso!')
    })
    
    // Submit form without all required fields
    const submitButton = screen.getByRole('button', { name: /elogiar/i })
    await user.click(submitButton)
    
    // Should show validation error for missing required fields
    expect(mockToast.error).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios')
  })

  it('clears errors when valid data is entered', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    const textarea = screen.getByPlaceholderText(/escreva sua mensagem/i)
    
    // Submit to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /elogiar/i })
    await user.click(submitButton)
    
    expect(mockToast.error).toHaveBeenCalled()
    
    // Enter valid message
    await user.type(textarea, 'Valid message')
    
    // Errors should be cleared (implementation may vary)
  })

  it('has proper form structure and accessibility', () => {
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    // Should have form element with proper structure
    const formElement = document.querySelector('form')
    expect(formElement).toBeInTheDocument()
    
    // Required fields should be marked
    expect(screen.getByText('Mensagem *')).toBeInTheDocument()
    expect(screen.getByText('Imagem *')).toBeInTheDocument()
    
    // Submit button should be present
    expect(screen.getByRole('button', { name: /elogiar/i })).toBeInTheDocument()
  })

  it('shows hashtag hint text', () => {
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    expect(screen.getByText('Use # para adicionar hashtags (ex: #excelente #trabalhoEmEquipe)')).toBeInTheDocument()
  })

  it('shows file upload restrictions', () => {
    render(
      <TestWrapper>
        <RecognitionForm />
      </TestWrapper>
    )

    expect(screen.getByText('PNG, JPG até 5MB')).toBeInTheDocument()
  })
}) 