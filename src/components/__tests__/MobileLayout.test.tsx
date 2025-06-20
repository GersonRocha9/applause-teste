import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileLayout } from '../MobileLayout'

// Mock child components to isolate MobileLayout testing
jest.mock('../Feed', () => ({
  Feed: jest.fn(() => <div data-testid="feed-component">Feed Component</div>)
}))

jest.mock('../RecognitionForm', () => ({
  RecognitionForm: jest.fn(() => <div data-testid="form-component">Recognition Form Component</div>)
}))

jest.mock('../SearchAndFilters', () => ({
  SearchAndFilters: jest.fn(() => <div data-testid="search-filters-component">Search and Filters Component</div>)
}))

describe('MobileLayout Component', () => {
  it('renders with initial feed tab active', () => {
    render(<MobileLayout />)

    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Elogiar')).toBeInTheDocument()
    
    // Feed tab should be active initially
    const feedTab = screen.getByText('Feed').closest('button')
    expect(feedTab).toHaveClass('border-blue-500', 'bg-blue-50', 'text-blue-700')
    
    // Form tab should be inactive
    const formTab = screen.getByText('Elogiar').closest('button')
    expect(formTab).toHaveClass('border-transparent', 'text-gray-600')
  })

  it('renders feed content by default', () => {
    render(<MobileLayout />)

    expect(screen.getByTestId('feed-component')).toBeInTheDocument()
    expect(screen.getByTestId('search-filters-component')).toBeInTheDocument()
    expect(screen.queryByTestId('form-component')).not.toBeInTheDocument()
  })

  it('switches to form tab when form button is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileLayout />)

    const formTabButton = screen.getByText('Elogiar').closest('button')
    await user.click(formTabButton!)

    // Form tab should now be active
    expect(formTabButton).toHaveClass('border-blue-500', 'bg-blue-50', 'text-blue-700')
    
    // Feed tab should now be inactive
    const feedTab = screen.getByText('Feed').closest('button')
    expect(feedTab).toHaveClass('border-transparent', 'text-gray-600')
  })

  it('renders form content when form tab is active', async () => {
    const user = userEvent.setup()
    render(<MobileLayout />)

    const formTabButton = screen.getByText('Elogiar').closest('button')
    await user.click(formTabButton!)

    expect(screen.getByTestId('form-component')).toBeInTheDocument()
    expect(screen.queryByTestId('feed-component')).not.toBeInTheDocument()
    expect(screen.queryByTestId('search-filters-component')).not.toBeInTheDocument()
  })

  it('switches back to feed tab when feed button is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileLayout />)

    // Switch to form first
    const formTabButton = screen.getByText('Elogiar').closest('button')
    await user.click(formTabButton!)

    // Now switch back to feed
    const feedTabButton = screen.getByText('Feed').closest('button')
    await user.click(feedTabButton!)

    // Feed tab should be active again
    expect(feedTabButton).toHaveClass('border-blue-500', 'bg-blue-50', 'text-blue-700')
    
    // Form tab should be inactive
    expect(formTabButton).toHaveClass('border-transparent', 'text-gray-600')
    
    // Feed content should be visible
    expect(screen.getByTestId('feed-component')).toBeInTheDocument()
    expect(screen.getByTestId('search-filters-component')).toBeInTheDocument()
    expect(screen.queryByTestId('form-component')).not.toBeInTheDocument()
  })

  it('renders tab icons correctly', () => {
    render(<MobileLayout />)

    expect(screen.getByText('📱')).toBeInTheDocument() // Feed icon
    expect(screen.getByText('✏️')).toBeInTheDocument() // Form icon
  })

  it('has proper mobile-only classes', () => {
    const { container } = render(<MobileLayout />)
    
    const mobileContainer = container.firstChild
    expect(mobileContainer).toHaveClass('lg:hidden', 'bg-gray-50', 'min-h-screen')
  })

  it('has sticky navigation header', () => {
    render(<MobileLayout />)
    
    const header = screen.getByText('Feed').closest('div')?.parentElement
    expect(header).toHaveClass('sticky', 'top-16', 'z-40', 'bg-white', 'border-b')
  })

  it('tabs have proper flex layout', () => {
    render(<MobileLayout />)
    
    const feedTab = screen.getByText('Feed').closest('button')
    const formTab = screen.getByText('Elogiar').closest('button')
    
    expect(feedTab).toHaveClass('flex-1')
    expect(formTab).toHaveClass('flex-1')
  })

  it('tabs have transition classes for smooth animations', () => {
    render(<MobileLayout />)
    
    const feedTab = screen.getByText('Feed').closest('button')
    const formTab = screen.getByText('Elogiar').closest('button')
    
    expect(feedTab).toHaveClass('transition-all', 'duration-200')
    expect(formTab).toHaveClass('transition-all', 'duration-200')
  })

  it('content area has proper padding and background', () => {
    render(<MobileLayout />)
    
    // Find the main content container that should have padding
    const contentArea = screen.getByTestId('feed-component').closest('div.p-4')
    expect(contentArea).toHaveClass('p-4', 'bg-gray-50')
  })

  it('feed content has proper spacing', () => {
    render(<MobileLayout />)
    
    // Find the container that wraps both search-filters and feed
    const feedContainer = screen.getByTestId('search-filters-component').parentElement
    expect(feedContainer).toHaveClass('space-y-6')
  })

  it('tabs maintain state through multiple clicks', async () => {
    const user = userEvent.setup()
    render(<MobileLayout />)

    const feedTab = screen.getByText('Feed').closest('button')
    const formTab = screen.getByText('Elogiar').closest('button')

    // Start on feed (default)
    expect(feedTab).toHaveClass('border-blue-500')
    expect(screen.getByTestId('feed-component')).toBeInTheDocument()

    // Switch to form
    await user.click(formTab!)
    expect(formTab).toHaveClass('border-blue-500')
    expect(screen.getByTestId('form-component')).toBeInTheDocument()

    // Switch back to feed
    await user.click(feedTab!)
    expect(feedTab).toHaveClass('border-blue-500')
    expect(screen.getByTestId('feed-component')).toBeInTheDocument()

    // Switch to form again
    await user.click(formTab!)
    expect(formTab).toHaveClass('border-blue-500')
    expect(screen.getByTestId('form-component')).toBeInTheDocument()
  })

  it('hover states are applied correctly for inactive tabs', () => {
    render(<MobileLayout />)

    // Form tab should be inactive initially and have hover classes
    const formTab = screen.getByText('Elogiar').closest('button')
    expect(formTab).toHaveClass('hover:bg-gray-50', 'hover:text-gray-800')
  })

  it('active tab has shadow styling', () => {
    render(<MobileLayout />)

    const feedTab = screen.getByText('Feed').closest('button')
    expect(feedTab).toHaveClass('shadow-sm')
  })

  it('tab buttons have proper accessibility attributes', () => {
    render(<MobileLayout />)

    const feedTab = screen.getByText('Feed').closest('button')
    const formTab = screen.getByText('Elogiar').closest('button')

    // Buttons should be clickable elements
    expect(feedTab).toBeInTheDocument()
    expect(formTab).toBeInTheDocument()
    expect(feedTab?.tagName).toBe('BUTTON')
    expect(formTab?.tagName).toBe('BUTTON')
  })

  it('clicking same tab multiple times maintains active state', async () => {
    const user = userEvent.setup()
    render(<MobileLayout />)

    const feedTab = screen.getByText('Feed').closest('button')

    // Click feed tab multiple times (it's already active)
    await user.click(feedTab!)
    await user.click(feedTab!)
    await user.click(feedTab!)

    // Should remain active
    expect(feedTab).toHaveClass('border-blue-500', 'bg-blue-50', 'text-blue-700')
    expect(screen.getByTestId('feed-component')).toBeInTheDocument()
  })
}) 