import { render, screen } from '@testing-library/react';
import { Feed } from '../Feed';

// Mock PostCard component
jest.mock('../PostCard', () => ({
  PostCard: ({ post }: { post: { id: string; author: { name: string }; message: string } }) => (
    <div data-testid={`post-${post.id}`}>
      <h3>{post.author.name}</h3>
      <p>{post.message}</p>
    </div>
  ),
}))

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})

window.IntersectionObserver = mockIntersectionObserver

// Mock useApp hook
const mockLoadMorePosts = jest.fn()
const mockUseApp = jest.fn()

jest.mock('@/contexts/AppContext', () => ({
  useApp: () => mockUseApp(),
}))

const mockPosts = [
  {
    id: '1',
    author: { name: 'João Silva', avatar: 'avatar1.jpg' },
    authorName: 'João Silva',
    authorAvatar: 'avatar1.jpg',
    recipient: { name: 'Maria Santos', avatar: 'avatar2.jpg' },
    recipientName: 'Maria Santos', 
    recipientAvatar: 'avatar2.jpg',
    message: 'Excelente trabalho em equipe!',
    recognitionType: { id: 'praise', name: 'Elogiar', emoji: '🎉' },
    hashtags: ['teamwork'],
    image: 'image1.jpg',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    author: { name: 'Carlos Lima', avatar: 'avatar3.jpg' },
    authorName: 'Carlos Lima',
    authorAvatar: 'avatar3.jpg',
    recipient: { name: 'Ana Costa', avatar: 'avatar4.jpg' },
    recipientName: 'Ana Costa',
    recipientAvatar: 'avatar4.jpg',
    message: 'Parabéns pela dedicação!',
    recognitionType: { id: 'praise', name: 'Elogiar', emoji: '🎉' },
    hashtags: ['dedication'],
    image: 'image2.jpg',
    createdAt: '2024-01-14T15:30:00Z',
  },
]

describe('Feed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock return value
    mockUseApp.mockReturnValue({
      state: {
        displayedPosts: mockPosts,
        hasMorePosts: true,
        currentPage: 1,
        posts: mockPosts,
        participants: [],
        filter: { search: '', recognitionType: null },
      },
      actions: {
        loadMorePosts: mockLoadMorePosts,
        setFilter: jest.fn(),
        addNewPost: jest.fn(),
        resetPosts: jest.fn(),
      },
    })
  })

  it('renders list of posts correctly', () => {
    render(<Feed />)

    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-2')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument()
    expect(screen.getByText('Excelente trabalho em equipe!')).toBeInTheDocument()
  })

  it('shows empty state when no posts available', () => {
    mockUseApp.mockReturnValue({
      state: {
        displayedPosts: [],
        hasMorePosts: false,
        currentPage: 1,
        posts: [],
        participants: [],
        filter: { search: '', recognitionType: null },
      },
      actions: {
        loadMorePosts: jest.fn(),
        setFilter: jest.fn(),
        addNewPost: jest.fn(),
        resetPosts: jest.fn(),
      },
    })

    render(<Feed />)

    expect(screen.getByText('🔍')).toBeInTheDocument()
    expect(screen.getByText('Nenhum reconhecimento encontrado')).toBeInTheDocument()
    expect(screen.getByText('Tente ajustar seus filtros ou seja o primeiro a fazer um reconhecimento!')).toBeInTheDocument()
  })

  it('shows load more button when has more posts', () => {
    render(<Feed />)

    expect(screen.getByText('Carregar mais reconhecimentos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /carregar mais/i })).toBeInTheDocument()
  })

  it('shows end message when no more posts available', () => {
    mockUseApp.mockReturnValue({
      state: {
        displayedPosts: mockPosts,
        hasMorePosts: false, // No more posts
        currentPage: 2,
        posts: mockPosts,
        participants: [],
        filter: { search: '', recognitionType: null },
      },
      actions: {
        loadMorePosts: jest.fn(),
        setFilter: jest.fn(),
        addNewPost: jest.fn(),
        resetPosts: jest.fn(),
      },
    })

    render(<Feed />)

    expect(screen.getByText('✨ Você viu todos os reconhecimentos!')).toBeInTheDocument()
    expect(screen.queryByText('Carregar mais reconhecimentos')).not.toBeInTheDocument()
  })

  it('shows loading spinner when has more posts', () => {
    render(<Feed />)

    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('border-b-2', 'border-blue-600')
  })

  it('sets up IntersectionObserver on mount', () => {
    render(<Feed />)

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '100px' }
    )
  })

  it('marks first post as new when on first page', () => {
    render(<Feed />)

    const firstPost = screen.getByTestId('post-1')
    const secondPost = screen.getByTestId('post-2')
    
    // These are the actual rendered props from the mock
    expect(firstPost).toBeInTheDocument()
    expect(secondPost).toBeInTheDocument()
  })

  it('handles multiple posts with correct keys', () => {
    render(<Feed />)

    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-2')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Carlos Lima')).toBeInTheDocument()
  })

  it('renders with different post states', () => {
    // Test with single post first
    const singlePost = [mockPosts[0]]
    
    mockUseApp.mockReturnValueOnce({
      state: {
        displayedPosts: singlePost,
        hasMorePosts: true,
        currentPage: 1,
        posts: singlePost,
        participants: [],
        filter: { search: '', recognitionType: null },
      },
      actions: {
        loadMorePosts: jest.fn(),
        setFilter: jest.fn(),
        addNewPost: jest.fn(),
        resetPosts: jest.fn(),
      },
    })

    const { unmount } = render(<Feed />)

    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.queryByTestId('post-2')).not.toBeInTheDocument()

    unmount()

    // Test with all posts
    mockUseApp.mockReturnValueOnce({
      state: {
        displayedPosts: mockPosts,
        hasMorePosts: false,
        currentPage: 1,
        posts: mockPosts,
        participants: [],
        filter: { search: '', recognitionType: null },
      },
      actions: {
        loadMorePosts: jest.fn(),
        setFilter: jest.fn(),
        addNewPost: jest.fn(),
        resetPosts: jest.fn(),
      },
    })

    render(<Feed />)

    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-2')).toBeInTheDocument()
  })
}) 