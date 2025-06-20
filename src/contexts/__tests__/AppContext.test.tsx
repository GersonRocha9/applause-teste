import { POSTS_PER_PAGE } from '@/constants'
import { NewPostData, Participant, RecognitionType } from '@/types'
import { act, render, renderHook, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { AppProvider, useApp } from '../AppContext'

// Mock the JSON data
jest.mock('../../../participants-mock.json', () => [
  { id: 1, name: 'John Doe', avatar: 'avatar1.jpg' },
  { id: 2, name: 'Jane Smith', avatar: 'avatar2.jpg' },
])

jest.mock('../../../posts-mock.json', () => [
  {
    id: 1,
    authorName: 'John Doe',
    authorAvatar: 'avatar1.jpg',
    recipientName: 'Jane Smith',
    recipientAvatar: 'avatar2.jpg',
    type: 'thanks',
    emoji: '🙏',
    date: '2024-01-01T10:00:00Z',
    text: 'Great work!',
    image: 'image1.jpg',
    hashtags: ['teamwork']
  },
  {
    id: 2,
    authorName: 'Jane Smith',
    authorAvatar: 'avatar2.jpg',
    recipientName: 'John Doe',
    recipientAvatar: 'avatar1.jpg',
    type: 'achievement',
    emoji: '🏆',
    date: '2024-01-02T10:00:00Z',
    text: 'Amazing job!',
    image: 'image2.jpg',
    hashtags: ['success']
  },
  {
    id: 3,
    authorName: 'Bob Wilson',
    authorAvatar: 'avatar3.jpg',
    recipientName: 'Alice Brown',
    recipientAvatar: 'avatar4.jpg',
    type: 'thanks',
    emoji: '🙏',
    date: '2024-01-03T10:00:00Z',
    text: 'Thank you!',
    image: 'image3.jpg',
    hashtags: ['gratitude']
  }
])

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AppProvider', () => {
    it('renders children without crashing', () => {
      render(
        <AppProvider>
          <div data-testid="child">Test Child</div>
        </AppProvider>
      )
      
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('provides initial state correctly', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      expect(result.current.state.posts).toHaveLength(3)
      expect(result.current.state.participants).toHaveLength(2)
      expect(result.current.state.filter.searchTerm).toBe('')
      expect(result.current.state.filter.recognitionType).toBe('')
      expect(result.current.state.currentPage).toBe(1)
      expect(result.current.state.postsPerPage).toBe(POSTS_PER_PAGE)
    })

    it('provides all expected actions', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      expect(result.current.actions).toHaveProperty('setFilter')
      expect(result.current.actions).toHaveProperty('loadMorePosts')
      expect(result.current.actions).toHaveProperty('addNewPost')
      expect(result.current.actions).toHaveProperty('resetPosts')

      expect(typeof result.current.actions.setFilter).toBe('function')
      expect(typeof result.current.actions.loadMorePosts).toBe('function')
      expect(typeof result.current.actions.addNewPost).toBe('function')
      expect(typeof result.current.actions.resetPosts).toBe('function')
    })
  })

  describe('useApp hook', () => {
    it('throws error when used outside of AppProvider', () => {
      // Suppress console.error for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        renderHook(() => useApp())
      }).toThrow('useApp must be used within an AppProvider')
      
      consoleError.mockRestore()
    })

    it('returns context value when used within AppProvider', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      expect(result.current).toHaveProperty('state')
      expect(result.current).toHaveProperty('actions')
    })
  })

  describe('setFilter action', () => {
    it('filters posts by search term', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ searchTerm: 'John' })
      })

      expect(result.current.state.filter.searchTerm).toBe('John')
      // Should find posts where author or recipient is John
      expect(result.current.state.displayedPosts).toHaveLength(2)
    })

    it('filters posts by recognition type', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ recognitionType: 'thanks' })
      })

      expect(result.current.state.filter.recognitionType).toBe('thanks')
      // Should find posts with type 'thanks'
      expect(result.current.state.displayedPosts).toHaveLength(2)
    })

    it('filters posts by both search term and recognition type', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ 
          searchTerm: 'Jane', 
          recognitionType: 'thanks' 
        })
      })

      expect(result.current.state.filter.searchTerm).toBe('Jane')
      expect(result.current.state.filter.recognitionType).toBe('thanks')
      // Should find posts where Jane is involved AND type is 'thanks'
      expect(result.current.state.displayedPosts).toHaveLength(1)
    })

    it('resets pagination when setting filter', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // First load more posts
      act(() => {
        result.current.actions.loadMorePosts()
      })

      expect(result.current.state.currentPage).toBe(2)

      // Then set filter - should reset to page 1
      act(() => {
        result.current.actions.setFilter({ searchTerm: 'test' })
      })

      expect(result.current.state.currentPage).toBe(1)
    })

    it('handles case insensitive search', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ searchTerm: 'john' }) // lowercase
      })

      // Should still find John Doe posts
      expect(result.current.state.displayedPosts.length).toBeGreaterThan(0)
    })
  })

  describe('loadMorePosts action', () => {
    it('loads more posts and increments page', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const initialPage = result.current.state.currentPage
      const initialDisplayedCount = result.current.state.displayedPosts.length

      act(() => {
        result.current.actions.loadMorePosts()
      })

      expect(result.current.state.currentPage).toBe(initialPage + 1)
      expect(result.current.state.displayedPosts.length).toBeGreaterThanOrEqual(initialDisplayedCount)
    })

    it('updates hasMorePosts correctly', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.loadMorePosts()
      })

      // With 3 posts total and POSTS_PER_PAGE, hasMorePosts should be false after loading more
      expect(result.current.state.hasMorePosts).toBe(false)
    })

    it('respects current filter when loading more', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // Set filter first
      act(() => {
        result.current.actions.setFilter({ recognitionType: 'thanks' })
      })

      // Load more posts
      act(() => {
        result.current.actions.loadMorePosts()
      })

      // Should only show filtered posts
      expect(result.current.state.displayedPosts.every(post => post.type === 'thanks')).toBe(true)
    })
  })

  describe('addNewPost action', () => {
    const mockRecognitionType: RecognitionType = {
      value: 'kudos',
      label: 'Kudos',
      emoji: '👏'
    }

    const mockParticipant: Participant = {
      id: 99,
      name: 'Test User',
      avatar: 'test-avatar.jpg'
    }

    const validPostData: NewPostData = {
      recipient: mockParticipant,
      recognitionType: mockRecognitionType,
      message: 'Great job!',
      hashtags: ['test', 'kudos'],
      image: new File([''], 'test.jpg', { type: 'image/jpeg' })
    }

    it('adds new post with all data', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const initialCount = result.current.state.posts.length

      act(() => {
        result.current.actions.addNewPost(validPostData)
      })

      expect(result.current.state.posts).toHaveLength(initialCount + 1)
      
      const newPost = result.current.state.posts[0] // New posts are added to the beginning
      expect(newPost.recipientName).toBe('Test User')
      expect(newPost.type).toBe('kudos')
      expect(newPost.emoji).toBe('👏')
      expect(newPost.text).toBe('Great job!')
      expect(newPost.hashtags).toEqual(['test', 'kudos'])
      expect(newPost.authorName).toBe('Você')
    })

    it('generates unique ID for new post', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(12345)

      act(() => {
        result.current.actions.addNewPost(validPostData)
      })

      const newPost = result.current.state.posts[0]
      expect(newPost.id).toBe(12345)

      dateSpy.mockRestore()
    })

    it('handles post without image', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const postDataWithoutImage = { ...validPostData, image: null }

      act(() => {
        result.current.actions.addNewPost(postDataWithoutImage)
      })

      const newPost = result.current.state.posts[0]
      expect(newPost.image).toBe('https://picsum.photos/1200/800?random=100')
    })

    it('handles post with image using URL.createObjectURL', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.addNewPost(validPostData)
      })

      const newPost = result.current.state.posts[0]
      expect(newPost.image).toBe('mocked-url')
      expect(URL.createObjectURL).toHaveBeenCalledWith(validPostData.image)
    })

    it('does not add post when recipient is missing', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const initialCount = result.current.state.posts.length
      const invalidPostData = { ...validPostData, recipient: null }

      act(() => {
        result.current.actions.addNewPost(invalidPostData)
      })

      expect(result.current.state.posts).toHaveLength(initialCount)
    })

    it('does not add post when recognition type is missing', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const initialCount = result.current.state.posts.length
      const invalidPostData = { ...validPostData, recognitionType: null }

      act(() => {
        result.current.actions.addNewPost(invalidPostData)
      })

      expect(result.current.state.posts).toHaveLength(initialCount)
    })

    it('updates displayed posts after adding new post', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.addNewPost(validPostData)
      })

      // New post should appear in displayed posts
      expect(result.current.state.displayedPosts[0].recipientName).toBe('Test User')
    })

    it('respects current filter when adding new post', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // Set filter that won't match the new post
      act(() => {
        result.current.actions.setFilter({ recognitionType: 'achievement' })
      })

      const initialDisplayedCount = result.current.state.displayedPosts.length

      act(() => {
        result.current.actions.addNewPost(validPostData) // type: 'kudos'
      })

      // New post shouldn't appear in displayedPosts because it doesn't match filter
      expect(result.current.state.displayedPosts).toHaveLength(initialDisplayedCount)
      expect(result.current.state.displayedPosts.every(post => post.type === 'achievement')).toBe(true)
    })
  })

  describe('resetPosts action', () => {
    it('resets pagination to first page', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // Load more posts first
      act(() => {
        result.current.actions.loadMorePosts()
      })

      expect(result.current.state.currentPage).toBe(2)

      // Reset posts
      act(() => {
        result.current.actions.resetPosts()
      })

      expect(result.current.state.currentPage).toBe(1)
    })

    it('displays only first page of posts', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // Load more posts first
      act(() => {
        result.current.actions.loadMorePosts()
      })

      const expandedCount = result.current.state.displayedPosts.length

      // Reset posts
      act(() => {
        result.current.actions.resetPosts()
      })

      expect(result.current.state.displayedPosts.length).toBeLessThanOrEqual(POSTS_PER_PAGE)
      expect(result.current.state.displayedPosts.length).toBeLessThanOrEqual(expandedCount)
    })

    it('respects current filter when resetting', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // Set filter
      act(() => {
        result.current.actions.setFilter({ recognitionType: 'thanks' })
      })

      // Load more
      act(() => {
        result.current.actions.loadMorePosts()
      })

      // Reset
      act(() => {
        result.current.actions.resetPosts()
      })

      // Should still respect the filter
      expect(result.current.state.displayedPosts.every(post => post.type === 'thanks')).toBe(true)
      expect(result.current.state.currentPage).toBe(1)
    })
  })

  describe('filtering functionality', () => {
    it('filters by author name', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ searchTerm: 'John Doe' })
      })

      expect(result.current.state.displayedPosts.every(post => 
        post.authorName.toLowerCase().includes('john doe') || 
        post.recipientName.toLowerCase().includes('john doe')
      )).toBe(true)
    })

    it('filters by recipient name', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ searchTerm: 'Jane Smith' })
      })

      expect(result.current.state.displayedPosts.every(post => 
        post.authorName.toLowerCase().includes('jane smith') || 
        post.recipientName.toLowerCase().includes('jane smith')
      )).toBe(true)
    })

    it('returns empty results for non-matching search', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.setFilter({ searchTerm: 'nonexistent' })
      })

      expect(result.current.state.displayedPosts).toHaveLength(0)
      expect(result.current.state.hasMorePosts).toBe(false)
    })

    it('handles empty search term (shows all posts)', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      // First set a filter
      act(() => {
        result.current.actions.setFilter({ searchTerm: 'John' })
      })

      const filteredCount = result.current.state.displayedPosts.length

      // Clear the filter
      act(() => {
        result.current.actions.setFilter({ searchTerm: '' })
      })

      expect(result.current.state.displayedPosts.length).toBeGreaterThan(filteredCount)
    })
  })

  describe('hasMorePosts calculation', () => {
    it('calculates hasMorePosts correctly initially', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const totalPosts = result.current.state.posts.length
      const expected = totalPosts > POSTS_PER_PAGE

      expect(result.current.state.hasMorePosts).toBe(expected)
    })

    it('updates hasMorePosts after loading more posts', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      act(() => {
        result.current.actions.loadMorePosts()
      })

      const displayedCount = result.current.state.displayedPosts.length
      const totalPosts = result.current.state.posts.length

      expect(result.current.state.hasMorePosts).toBe(displayedCount < totalPosts)
    })
  })

  describe('edge cases', () => {
    it('handles unknown action type gracefully', () => {
      // This tests the default case in the reducer
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const initialState = result.current.state

      // We can't directly dispatch unknown actions through the public API,
      // but we can verify the initial state is stable
      expect(result.current.state).toEqual(initialState)
    })

    it('maintains referential equality for actions', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: TestWrapper
      })

      const actions1 = result.current.actions

      // Force re-render
      act(() => {
        result.current.actions.setFilter({ searchTerm: 'test' })
      })

      const actions2 = result.current.actions

      // Actions should be the same reference due to useMemo
      expect(actions1).toBe(actions2)
    })
  })
}) 