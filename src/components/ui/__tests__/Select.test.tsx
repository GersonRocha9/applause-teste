import { RECOGNITION_TYPES } from '@/constants'
import { fireEvent, render, screen } from '@testing-library/react'
import { Select } from '../Select'

describe('Select Component', () => {
  it('renders select with placeholder', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        placeholder="Select an option"
      />
    )
    
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <Select
        label="Test Label"
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Should show the options
    expect(screen.getByText('Obrigado!')).toBeInTheDocument()
    expect(screen.getByText('Bom trabalho!')).toBeInTheDocument()
  })

  it('calls onChange when option is selected', () => {
    const handleChange = jest.fn()
    
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={handleChange}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    const option = screen.getByText('Obrigado!')
    fireEvent.click(option)
    
    expect(handleChange).toHaveBeenCalledWith(RECOGNITION_TYPES[0])
  })

  it('displays selected value', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={RECOGNITION_TYPES[0]}
        onChange={() => {}}
      />
    )
    
    expect(screen.getByText('🙏')).toBeInTheDocument()
    expect(screen.getByText('Obrigado!')).toBeInTheDocument()
  })

  it('shows error message when error prop is provided', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        error="This field is required"
      />
    )
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies error styling to button when error prop is provided', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        error="Invalid selection"
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-red-300', 'focus:ring-red-500', 'focus:border-red-500')
  })

  it('does not apply error styling when no error', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-gray-300', 'hover:border-gray-400')
    expect(button).not.toHaveClass('border-red-300')
  })

  it('shows required asterisk when required prop is true', () => {
    render(
      <Select
        label="Required Field"
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        required={true}
      />
    )
    
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-red-500')
  })

  it('does not show required asterisk when required prop is false', () => {
    render(
      <Select
        label="Optional Field"
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        required={false}
      />
    )
    
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('does not show required asterisk when no label', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        required={true}
      />
    )
    
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('applies isOpen styling when dropdown is open', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(button).toHaveClass('border-blue-500', 'ring-2', 'ring-blue-500')
  })

  it('rotates chevron icon when dropdown is open', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    const chevron = button.querySelector('svg')
    
    // Initially not rotated
    expect(chevron).not.toHaveClass('transform', 'rotate-180')
    
    fireEvent.click(button)
    
    // Should be rotated when open
    expect(chevron).toHaveClass('transform', 'rotate-180')
  })

  it('closes dropdown when clicking outside', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Dropdown should be open
    expect(screen.getByText('Obrigado!')).toBeInTheDocument()
    
    // Click outside
    fireEvent.mouseDown(document.body)
    
    // Dropdown should be closed
    expect(screen.queryByText('Obrigado!')).not.toBeInTheDocument()
  })

  it('shows checkmark icon for selected option', () => {
    const { container } = render(
      <Select
        options={RECOGNITION_TYPES}
        value={RECOGNITION_TYPES[0]}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Look for the checkmark icon using querySelector
    const checkmark = container.querySelector('svg.text-blue-600')
    expect(checkmark).toBeInTheDocument()
    expect(checkmark).toHaveClass('text-blue-600')
  })

  it('applies selected styling to selected option', () => {
    const { container } = render(
      <Select
        options={RECOGNITION_TYPES}
        value={RECOGNITION_TYPES[1]}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Look for button with selected styling
    const selectedOption = container.querySelector('button.bg-blue-100.text-blue-900')
    expect(selectedOption).toBeInTheDocument()
    expect(selectedOption).toHaveClass('bg-blue-100', 'text-blue-900')
  })

  it('does not apply selected styling to non-selected options', () => {
    const { container } = render(
      <Select
        options={RECOGNITION_TYPES}
        value={RECOGNITION_TYPES[0]}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Check that there are buttons with non-selected styling
    const nonSelectedOptions = container.querySelectorAll('button.text-gray-900:not(.bg-blue-100)')
    expect(nonSelectedOptions.length).toBeGreaterThan(0)
    
    // Verify they don't have selected styling
    nonSelectedOptions.forEach(option => {
      expect(option).not.toHaveClass('bg-blue-100', 'text-blue-900')
    })
  })

  it('closes dropdown after selecting an option', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Dropdown should be open
    expect(screen.getByText('Obrigado!')).toBeInTheDocument()
    
    const option = screen.getByText('Obrigado!')
    fireEvent.click(option)
    
    // Dropdown should be closed after selection
    expect(screen.queryByText('Obrigado!')).not.toBeInTheDocument()
  })

  it('uses default placeholder when none provided', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument()
  })

  it('uses custom placeholder when provided', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
        placeholder="Choose recognition type"
      />
    )
    
    expect(screen.getByText('Choose recognition type')).toBeInTheDocument()
    expect(screen.queryByText('Selecione uma opção')).not.toBeInTheDocument()
  })

  it('toggles dropdown when button is clicked multiple times', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    
    // Open dropdown
    fireEvent.click(button)
    expect(screen.getByText('Obrigado!')).toBeInTheDocument()
    
    // Close dropdown
    fireEvent.click(button)
    expect(screen.queryByText('Obrigado!')).not.toBeInTheDocument()
    
    // Open again
    fireEvent.click(button)
    expect(screen.getByText('Obrigado!')).toBeInTheDocument()
  })

  it('renders all options in dropdown', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Should render all RECOGNITION_TYPES
    RECOGNITION_TYPES.forEach(type => {
      expect(screen.getByText(type.label)).toBeInTheDocument()
      expect(screen.getByText(type.emoji)).toBeInTheDocument()
    })
  })

  it('has proper accessibility roles', () => {
    render(
      <Select
        options={RECOGNITION_TYPES}
        value={null}
        onChange={() => {}}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
    
    fireEvent.click(button)
    
    const optionButtons = screen.getAllByRole('button')
    // Should have main button + option buttons
    expect(optionButtons.length).toBeGreaterThan(1)
  })
}) 