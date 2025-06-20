import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { Input } from '../Input'

// Mock icons for testing
const SearchIcon = () => (
  <svg data-testid="search-icon" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const CloseIcon = () => (
  <svg data-testid="close-icon" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

describe('Input Component', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text..." />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Enter text...')
  })

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username..." />)
    
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders without label when not provided', () => {
    render(<Input placeholder="Enter text..." />)
    
    expect(screen.queryByText('Username')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays error message when error prop is provided', () => {
    render(
      <Input 
        label="Email"
        error="Invalid email format"
        placeholder="Enter email..."
      />
    )
    
    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    expect(screen.getByText('Invalid email format')).toHaveClass('text-red-600')
  })

  it('applies error styling when error prop is provided', () => {
    render(
      <Input 
        error="Invalid input"
        placeholder="Enter text..."
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500')
  })

  it('does not display error message when error prop is not provided', () => {
    render(<Input placeholder="Enter text..." />)
    
    expect(screen.queryByText('Invalid input')).not.toBeInTheDocument()
  })

  it('renders with left icon', () => {
    render(
      <Input 
        placeholder="Search..."
        leftIcon={<SearchIcon />}
      />
    )
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('pl-10')
  })

  it('renders with right icon', () => {
    render(
      <Input 
        placeholder="Enter text..."
        rightIcon={<CloseIcon />}
      />
    )
    
    expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('pr-10')
  })

  it('renders with both left and right icons', () => {
    render(
      <Input 
        placeholder="Search..."
        leftIcon={<SearchIcon />}
        rightIcon={<CloseIcon />}
      />
    )
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('pl-10', 'pr-10')
  })

  it('does not apply icon padding when no icons are provided', () => {
    render(<Input placeholder="Enter text..." />)
    
    const input = screen.getByRole('textbox')
    expect(input).not.toHaveClass('pl-10')
    expect(input).not.toHaveClass('pr-10')
  })

  it('handles user input correctly', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(
      <Input 
        placeholder="Enter text..."
        onChange={handleChange}
      />
    )
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello World')
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('Hello World')
  })

  it('supports controlled input with value prop', () => {
    const { rerender } = render(
      <Input value="Initial value" onChange={() => {}} />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Initial value')
    
    rerender(<Input value="Updated value" onChange={() => {}} />)
    expect(input).toHaveValue('Updated value')
  })

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLInputElement>()
    
    render(<Input ref={ref} placeholder="Enter text..." />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toHaveAttribute('placeholder', 'Enter text...')
  })

  it('applies disabled state correctly', () => {
    render(<Input disabled placeholder="Enter text..." />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500', 'disabled:border-gray-200', 'disabled:cursor-not-allowed')
  })

  it('supports custom className', () => {
    render(
      <Input 
        className="custom-class"
        placeholder="Enter text..."
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('has proper default styling classes', () => {
    render(<Input placeholder="Enter text..." />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass(
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
      'duration-200'
    )
  })

  it('left icon container has proper styling', () => {
    render(
      <Input 
        placeholder="Search..."
        leftIcon={<SearchIcon />}
      />
    )
    
    const iconContainer = screen.getByTestId('search-icon').parentElement
    expect(iconContainer).toHaveClass(
      'absolute',
      'inset-y-0',
      'left-0',
      'pl-3',
      'flex',
      'items-center',
      'pointer-events-none'
    )
  })

  it('right icon container has proper styling', () => {
    render(
      <Input 
        placeholder="Enter text..."
        rightIcon={<CloseIcon />}
      />
    )
    
    const iconContainer = screen.getByTestId('close-icon').parentElement
    expect(iconContainer).toHaveClass(
      'absolute',
      'inset-y-0',
      'right-0',
      'pr-3',
      'flex',
      'items-center'
    )
  })

  it('label has proper styling and accessibility', () => {
    render(<Input label="Password" placeholder="Enter password..." />)
    
    const label = screen.getByText('Password')
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
    const { container } = render(<Input placeholder="Enter text..." />)
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('w-full')
  })

  it('relative container has proper positioning', () => {
    render(
      <Input 
        placeholder="Search..."
        leftIcon={<SearchIcon />}
      />
    )
    
    const relativeContainer = screen.getByTestId('search-icon').parentElement?.parentElement
    expect(relativeContainer).toHaveClass('relative')
  })

  it('supports all standard input attributes', () => {
    render(
      <Input 
        placeholder="Enter text..."
        type="email"
        maxLength={50}
        required
        name="email"
        id="email-field"
        autoComplete="email"
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('maxlength', '50')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('id', 'email-field')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(
      <Input 
        placeholder="Enter text..."
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    )
    
    const input = screen.getByRole('textbox')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('supports readonly attribute', () => {
    render(<Input readOnly value="Read only text" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
    expect(input).toHaveValue('Read only text')
  })

  it('combines error styling with custom className correctly', () => {
    render(
      <Input 
        className="custom-border"
        error="Error message"
        placeholder="Enter text..."
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-border')
    expect(input).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500')
  })

  it('error message has proper styling', () => {
    render(
      <Input 
        error="This field is required"
        placeholder="Enter text..."
      />
    )
    
    const errorMessage = screen.getByText('This field is required')
    expect(errorMessage).toHaveClass('mt-1', 'text-sm', 'text-red-600')
  })

  it('combines all conditional styles correctly', () => {
    render(
      <Input 
        className="custom-class"
        leftIcon={<SearchIcon />}
        rightIcon={<CloseIcon />}
        error="Error message"
        placeholder="Enter text..."
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
    expect(input).toHaveClass('pl-10', 'pr-10')
    expect(input).toHaveClass('border-red-500', 'focus:border-red-500', 'focus:ring-red-500')
  })

  it('supports password type input', () => {
    render(
      <Input 
        type="password"
        placeholder="Enter password..."
      />
    )
    
    const input = screen.getByPlaceholderText('Enter password...')
    expect(input).toHaveAttribute('type', 'password')
  })
}) 