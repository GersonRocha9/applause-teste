import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Textarea } from '../Textarea'

describe('Textarea Component', () => {
  it('renders basic textarea', () => {
    render(<Textarea placeholder="Enter text..." />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('placeholder', 'Enter text...')
  })

  it('renders with label', () => {
    render(<Textarea label="Description" placeholder="Enter description..." />)
    
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders without label when not provided', () => {
    render(<Textarea placeholder="Enter text..." />)
    
    expect(screen.queryByText('Description')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays error message when error prop is provided', () => {
    render(
      <Textarea 
        label="Description"
        error="This field is required"
        placeholder="Enter text..."
      />
    )
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600')
  })

  it('applies error styling when error prop is provided', () => {
    render(
      <Textarea 
        error="Invalid input"
        placeholder="Enter text..."
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500')
  })

  it('does not display error message when error prop is not provided', () => {
    render(<Textarea placeholder="Enter text..." />)
    
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
  })

  it('handles user input correctly', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(
      <Textarea 
        placeholder="Enter text..."
        onChange={handleChange}
      />
    )
    
    const textarea = screen.getByRole('textbox')
    await user.type(textarea, 'Hello World')
    
    expect(handleChange).toHaveBeenCalled()
    expect(textarea).toHaveValue('Hello World')
  })

  it('supports controlled input with value prop', () => {
    const { rerender } = render(
      <Textarea value="Initial value" onChange={() => {}} />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Initial value')
    
    rerender(<Textarea value="Updated value" onChange={() => {}} />)
    expect(textarea).toHaveValue('Updated value')
  })

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLTextAreaElement>()
    
    render(<Textarea ref={ref} placeholder="Enter text..." />)
    
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(ref.current).toHaveAttribute('placeholder', 'Enter text...')
  })

  it('applies disabled state correctly', () => {
    render(<Textarea disabled placeholder="Enter text..." />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500', 'disabled:border-gray-200', 'disabled:cursor-not-allowed')
  })

  it('supports custom className', () => {
    render(
      <Textarea 
        className="custom-class"
        placeholder="Enter text..."
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-class')
  })

  it('has proper default styling classes', () => {
    render(<Textarea placeholder="Enter text..." />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass(
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-lg',
      'shadow-sm',
      'bg-white',
      'text-gray-900',
      'placeholder-gray-500',
      'cursor-text',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:border-blue-500',
      'hover:border-gray-400',
      'transition-colors',
      'duration-200',
      'resize-vertical'
    )
  })

  it('label has proper styling and accessibility', () => {
    render(<Textarea label="Message" placeholder="Enter message..." />)
    
    const label = screen.getByText('Message')
    expect(label).toHaveClass(
      'block',
      'text-sm',
      'font-medium',
      'text-gray-700',
      'mb-1',
      'cursor-default'
    )
  })

  it('container has proper wrapper styling', () => {
    const { container } = render(<Textarea placeholder="Enter text..." />)
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('w-full')
  })

  it('supports all standard textarea attributes', () => {
    render(
      <Textarea 
        placeholder="Enter text..."
        rows={5}
        cols={50}
        maxLength={100}
        required
        name="description"
        id="description-field"
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toHaveAttribute('cols', '50')
    expect(textarea).toHaveAttribute('maxlength', '100')
    expect(textarea).toHaveAttribute('required')
    expect(textarea).toHaveAttribute('name', 'description')
    expect(textarea).toHaveAttribute('id', 'description-field')
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(
      <Textarea 
        placeholder="Enter text..."
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    )
    
    const textarea = screen.getByRole('textbox')
    
    await user.click(textarea)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('supports readonly attribute', () => {
    render(<Textarea readOnly value="Read only text" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('readonly')
    expect(textarea).toHaveValue('Read only text')
  })

  it('combines error styling with custom className correctly', () => {
    render(
      <Textarea 
        className="custom-border"
        error="Error message"
        placeholder="Enter text..."
      />
    )
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-border')
    expect(textarea).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500')
  })

  it('error message has proper styling', () => {
    render(
      <Textarea 
        error="This field is required"
        placeholder="Enter text..."
      />
    )
    
    const errorMessage = screen.getByText('This field is required')
    expect(errorMessage).toHaveClass('mt-1', 'text-sm', 'text-red-600')
  })
}) 