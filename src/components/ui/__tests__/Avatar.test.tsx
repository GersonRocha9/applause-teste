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
}) 