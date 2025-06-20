import { render, screen } from '@testing-library/react'
import { Avatar } from '../Avatar'

describe('Avatar Component', () => {
  const mockProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'John Doe'
  }

  it('renders avatar with image', () => {
    render(<Avatar {...mockProps} />)
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'John Doe')
    expect(image).toHaveAttribute('src')
  })

  it('renders with default size (md)', () => {
    render(<Avatar {...mockProps} />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('w-12', 'h-12')
  })

  it('renders with small size', () => {
    render(<Avatar {...mockProps} size="sm" />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('w-8', 'h-8')
  })

  it('renders with large size', () => {
    render(<Avatar {...mockProps} size="lg" />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('w-16', 'h-16')
  })

  it('applies custom className', () => {
    render(<Avatar {...mockProps} className="custom-class" />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('has correct background color', () => {
    render(<Avatar {...mockProps} />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('bg-gray-200')
  })

  it('is rounded and has overflow hidden', () => {
    render(<Avatar {...mockProps} />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('rounded-full', 'overflow-hidden')
  })

  it('has flex-shrink-0 class', () => {
    render(<Avatar {...mockProps} />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('flex-shrink-0')
  })

  it('image has object-cover class', () => {
    render(<Avatar {...mockProps} />)
    const image = screen.getByRole('img')
    expect(image).toHaveClass('object-cover')
  })

  it('renders without custom className', () => {
    render(<Avatar {...mockProps} />)
    const container = screen.getByRole('img').parentElement
    // Should have default classes but not custom ones
    expect(container).toHaveClass('w-12', 'h-12', 'relative', 'rounded-full', 'overflow-hidden', 'bg-gray-200', 'flex-shrink-0')
  })

  it('sets correct sizes attribute for small avatar', () => {
    render(<Avatar {...mockProps} size="sm" />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('sizes', '32px')
  })

  it('sets correct sizes attribute for medium avatar', () => {
    render(<Avatar {...mockProps} size="md" />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('sizes', '48px')
  })

  it('sets correct sizes attribute for large avatar', () => {
    render(<Avatar {...mockProps} size="lg" />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('sizes', '64px')
  })

  it('image has correct image-specific classes and attributes', () => {
    render(<Avatar {...mockProps} />)
    const image = screen.getByRole('img')
    expect(image).toHaveClass('object-cover')
    expect(image).toHaveAttribute('alt', mockProps.alt)
    expect(image).toHaveAttribute('src')
  })

  it('combines size classes with custom className correctly', () => {
    render(<Avatar {...mockProps} size="lg" className="border-2 border-blue-500" />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('w-16', 'h-16')
    expect(container).toHaveClass('border-2', 'border-blue-500')
  })

  it('handles empty className prop', () => {
    render(<Avatar {...mockProps} className="" />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('w-12', 'h-12')
    expect(container).not.toHaveClass('undefined')
  })

  it('sets alt text correctly', () => {
    render(<Avatar src="https://example.com/user.jpg" alt="User Profile" />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'User Profile')
  })

  it('sets src correctly', () => {
    const testSrc = 'https://example.com/test-avatar.jpg'
    render(<Avatar src={testSrc} alt="Test User" />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src')
  })

  it('has correct relative positioning', () => {
    render(<Avatar {...mockProps} />)
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('relative')
  })
}) 