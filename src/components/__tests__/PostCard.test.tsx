import { Post } from '@/types'
import { render, screen } from '@testing-library/react'
import { PostCard } from '../PostCard'

// Test data
const mockPost: Post = {
  id: 1,
  authorName: 'João Silva',
  authorAvatar: 'https://example.com/author.jpg',
  recipientName: 'Maria Santos',
  recipientAvatar: 'https://example.com/recipient.jpg',
  type: 'Obrigado!',
  emoji: '🙏',
  text: 'Obrigado pela ajuda no projeto!',
  hashtags: ['trabalho', 'equipe'],
  image: 'https://picsum.photos/1200/800?random=1',
  date: '2024-01-15T10:30:00.000Z'
}

const mockPostWithoutImage: Post = {
  ...mockPost,
  id: 2,
  image: '',
  hashtags: []
}

describe('Main Components - Basic Rendering', () => {
  describe('PostCard Component', () => {
    it('renders post basic information', () => {
      render(<PostCard post={mockPost} />)
      
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('elogiou')).toBeInTheDocument()
      expect(screen.getAllByText('Maria Santos').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('🙏')).toBeInTheDocument()
      expect(screen.getByText('Obrigado!')).toBeInTheDocument()
      expect(screen.getByText('Obrigado pela ajuda no projeto!')).toBeInTheDocument()
    })

    it('renders hashtags when present', () => {
      render(<PostCard post={mockPost} />)
      
      expect(screen.getByText('#trabalho')).toBeInTheDocument()
      expect(screen.getByText('#equipe')).toBeInTheDocument()
    })

    it('does not render hashtags section when no hashtags', () => {
      render(<PostCard post={mockPostWithoutImage} />)
      
      expect(screen.queryByText('#trabalho')).not.toBeInTheDocument()
    })

    it('renders post image when present', () => {
      render(<PostCard post={mockPost} />)
      
      const postImage = screen.getByAltText('Post image')
      expect(postImage).toBeInTheDocument()
    })

    it('does not render image when image is empty', () => {
      render(<PostCard post={mockPostWithoutImage} />)
      
      expect(screen.queryByAltText('Post image')).not.toBeInTheDocument()
    })

    it('renders with proper CSS classes', () => {
      const { container } = render(<PostCard post={mockPost} />)
      
      const postCard = container.firstChild
      expect(postCard).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm')
    })

    it('applies new post animation when isNew prop is true', () => {
      const { container } = render(<PostCard post={mockPost} isNew={true} />)
      
      const postCard = container.firstChild
      expect(postCard).toHaveClass('slide-in-from-top')
    })

    it('shows recognition context in footer', () => {
      render(<PostCard post={mockPost} />)
      
      expect(screen.getByText('Reconhecimento para')).toBeInTheDocument()
    })

    it('formats relative time for posts', () => {
      // Test with a specific date format that should show as a date
      const oldPost = {
        ...mockPost,
        date: '2023-01-15T10:30:00.000Z'
      }
      
      render(<PostCard post={oldPost} />)
      
      // Should display as formatted date for old posts
      const timeElement = screen.getByRole('time')
      expect(timeElement).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('PostCard renders all avatars correctly', () => {
      render(<PostCard post={mockPost} />)
      
      // Should have author avatar, post image, and recipient avatar
      const avatars = screen.getAllByRole('img')
      expect(avatars.length).toBeGreaterThanOrEqual(2) // At least author and recipient avatars
    })

    it('PostCard handles empty hashtags gracefully', () => {
      const postWithEmptyHashtags = {
        ...mockPost,
        hashtags: []
      }
      
      render(<PostCard post={postWithEmptyHashtags} />)
      
      // Should not crash and should render other content
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.queryByText('#trabalho')).not.toBeInTheDocument()
      expect(screen.queryByText('#equipe')).not.toBeInTheDocument()
    })

    it('PostCard displays proper recognition type styling', () => {
      render(<PostCard post={mockPost} />)
      
      const typeElement = screen.getByText('Obrigado!')
      expect(typeElement).toHaveClass('text-blue-600')
    })
  })
}) 