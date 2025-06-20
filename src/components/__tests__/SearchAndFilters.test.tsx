import { RECOGNITION_TYPES } from '@/constants'
import { Post } from '@/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchAndFilters } from '../SearchAndFilters'

// Mock posts data
const mockPosts: Post[] = [
  {
    id: 1,
    authorName: 'João Silva',
    authorAvatar: 'https://example.com/joao.jpg',
    recipientName: 'Maria Santos',
    recipientAvatar: 'https://example.com/maria.jpg',
    type: '🙏 Obrigado!',
    emoji: '🙏',
    date: '2024-01-15T10:30:00Z',
    text: 'Obrigado pela ajuda com o projeto!',
    image: 'https://example.com/image1.jpg',
    hashtags: ['teamwork', 'gratitude']
  },
  {
    id: 2,
    authorName: 'Pedro Oliveira',
    authorAvatar: 'https://example.com/pedro.jpg',
    recipientName: 'Ana Costa',
    recipientAvatar: 'https://example.com/ana.jpg',
    type: '🙌 Bom trabalho!',
    emoji: '🙌',
    date: '2024-01-14T14:20:00Z',
    text: 'Excelente apresentação hoje!',
    image: 'https://example.com/image2.jpg',
    hashtags: ['presentation', 'excellence']
  },
  {
    id: 3,
    authorName: 'Carlos Mendes',
    authorAvatar: 'https://example.com/carlos.jpg',
    recipientName: 'João Silva',
    recipientAvatar: 'https://example.com/joao.jpg',
    type: '😍 Impressionante!',
    emoji: '😍',
    date: '2024-01-13T09:15:00Z',
    text: 'Código incrível, parabéns!',
    image: 'https://example.com/image3.jpg',
    hashtags: ['coding', 'awesome']
  }
]

// Mock actions
const mockActions = {
  setFilter: jest.fn(),
  loadMorePosts: jest.fn(),
  addNewPost: jest.fn(),
  resetPosts: jest.fn()
}

// Mock default state
const mockDefaultState = {
  posts: mockPosts,
  participants: [],
  filter: {
    searchTerm: '',
    recognitionType: ''
  },
  displayedPosts: mockPosts,
  currentPage: 1,
  postsPerPage: 5,
  hasMorePosts: false
}

// Mock useToast hook
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  })
}))

// Mock AppContext hook
const mockUseApp = jest.fn()

jest.mock('@/contexts/AppContext', () => ({
  useApp: () => mockUseApp()
}))

describe('SearchAndFilters Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set default mock return value
    mockUseApp.mockReturnValue({
      state: mockDefaultState,
      actions: mockActions
    })
  })

  it('renders search input and filters', () => {
    render(<SearchAndFilters />)

    expect(screen.getByPlaceholderText('Buscar por nome do autor ou destinatário...')).toBeInTheDocument()
    expect(screen.getByText('Filtrar por tipo de reconhecimento:')).toBeInTheDocument()
    
    // Should render all recognition type buttons
    RECOGNITION_TYPES.forEach(type => {
      expect(screen.getByText(type.label)).toBeInTheDocument()
      expect(screen.getByText(type.emoji)).toBeInTheDocument()
    })
  })

  it('displays total posts count when no filters are active', () => {
    render(<SearchAndFilters />)

    expect(screen.getByText(/Total de/)).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // Total posts count
    expect(screen.getByText(/reconhecimentos/)).toBeInTheDocument()
  })

  it('calls setFilter when search input changes', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilters />)

    const searchInput = screen.getByPlaceholderText('Buscar por nome do autor ou destinatário...')
    await user.type(searchInput, 'A')

    // Should have called setFilter with the typed character
    expect(mockActions.setFilter).toHaveBeenCalledWith({ searchTerm: 'A' })
  })

  it('filters by recognition type when button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilters />)

    const thankYouButton = screen.getByText('Obrigado!')
    await user.click(thankYouButton)

    expect(mockActions.setFilter).toHaveBeenCalledWith({ recognitionType: '🙏 Obrigado!' })
  })

  it('toggles recognition type filter when same button is clicked', async () => {
    const user = userEvent.setup()
    
    // Mock state with active filter
    const stateWithFilter = {
      ...mockDefaultState,
      filter: { searchTerm: '', recognitionType: '🙏 Obrigado!' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithFilter,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    const thankYouButton = screen.getByText('Obrigado!')
    await user.click(thankYouButton)

    // Should clear the filter (toggle off)
    expect(mockActions.setFilter).toHaveBeenCalledWith({ recognitionType: '' })
  })

  it('shows active filter styling for selected recognition type', () => {
    // Mock state with active recognition type filter
    const stateWithFilter = {
      ...mockDefaultState,
      filter: { searchTerm: '', recognitionType: '🙏 Obrigado!' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithFilter,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    const thankYouButton = screen.getByText('Obrigado!').closest('button')
    // Active filter should have primary variant styling
    expect(thankYouButton).toHaveClass('bg-blue-600', 'text-white')
  })

  it('shows inactive filter styling for non-selected recognition types', () => {
    // Mock state with active recognition type filter
    const stateWithFilter = {
      ...mockDefaultState,
      filter: { searchTerm: '', recognitionType: '🙏 Obrigado!' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithFilter,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    const goodJobButton = screen.getByText('Bom trabalho!').closest('button')
    // Inactive filter should have outline variant styling
    expect(goodJobButton).toHaveClass('border-blue-600', 'text-blue-600')
  })

  it('displays filtered posts count when filters are active', () => {
    // Mock state with active filters and filtered results
    const stateWithFilters = {
      ...mockDefaultState,
      filter: { searchTerm: 'João', recognitionType: '' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithFilters,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    // Just check that the counts are displayed - numbers are split across elements
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows clear filters button when filters are active', () => {
    // Mock state with active filters
    const stateWithFilters = {
      ...mockDefaultState,
      filter: { searchTerm: 'João', recognitionType: '🙏 Obrigado!' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithFilters,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    expect(screen.getByText('Limpar filtros')).toBeInTheDocument()
  })

  it('hides clear filters button when no filters are active', () => {
    render(<SearchAndFilters />)

    expect(screen.queryByText('Limpar filtros')).not.toBeInTheDocument()
  })

  it('calls clearFilters when clear button is clicked', async () => {
    const user = userEvent.setup()
    
    // Mock state with active filters
    const stateWithFilters = {
      ...mockDefaultState,
      filter: { searchTerm: 'João', recognitionType: '🙏 Obrigado!' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithFilters,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    const clearButton = screen.getByText('Limpar filtros')
    await user.click(clearButton)

    expect(mockActions.setFilter).toHaveBeenCalledWith({ searchTerm: '', recognitionType: '' })
  })

  it('shows search icon in input field', () => {
    render(<SearchAndFilters />)

    // Check for search icon SVG
    const searchIcon = document.querySelector('svg path[d*="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"]')
    expect(searchIcon).toBeInTheDocument()
  })

  it('shows filter icon in filter section', () => {
    render(<SearchAndFilters />)

    // Check for filter icon SVG  
    const filterIcon = document.querySelector('svg path[d*="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586"]')
    expect(filterIcon).toBeInTheDocument()
  })

  it('has proper responsive layout classes', () => {
    const { container } = render(<SearchAndFilters />)

    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm', 'border', 'border-gray-200', 'p-4', 'sm:p-6')
  })

  it('applies transition animations to filter buttons', () => {
    render(<SearchAndFilters />)

    const filterButtons = screen.getAllByRole('button').filter(button => 
      RECOGNITION_TYPES.some(type => button.textContent?.includes(type.label))
    )

    filterButtons.forEach(button => {
      expect(button).toHaveClass('transition-all', 'duration-200')
    })
  })

  it('handles empty search input correctly', async () => {
    const user = userEvent.setup()
    render(<SearchAndFilters />)

    const searchInput = screen.getByPlaceholderText('Buscar por nome do autor ou destinatário...')
    
    // Type something and then clear
    await user.type(searchInput, 'A')
    await user.clear(searchInput)
    
    // Check that setFilter was called (multiple times due to typing each character)
    expect(mockActions.setFilter).toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<SearchAndFilters />)

    const searchInput = screen.getByPlaceholderText('Buscar por nome do autor ou destinatário...')
    expect(searchInput).toHaveAttribute('placeholder', 'Buscar por nome do autor ou destinatário...')

    // All filter buttons should be clickable
    const filterButtons = screen.getAllByRole('button')
    filterButtons.forEach(button => {
      expect(button.tagName).toBe('BUTTON')
    })
  })

  it('displays correct filter count text formatting', () => {
    // Test with both search and type filters
    const stateWithBothFilters = {
      ...mockDefaultState,
      filter: { searchTerm: 'João', recognitionType: '🙏 Obrigado!' }
    }
    mockUseApp.mockReturnValue({
      state: stateWithBothFilters,
      actions: mockActions
    })

    render(<SearchAndFilters />)

    // Should show filtered count numbers
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
}) 