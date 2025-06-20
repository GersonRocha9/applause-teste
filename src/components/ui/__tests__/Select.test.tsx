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
}) 