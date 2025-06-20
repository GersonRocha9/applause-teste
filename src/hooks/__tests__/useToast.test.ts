import { renderHook } from '@testing-library/react'
import { useToast } from '../useToast'

// Mock react-hot-toast
jest.mock('react-hot-toast', () => {
  const mockToastFn = jest.fn()
  const mockSuccess = jest.fn()
  const mockError = jest.fn()
  const mockLoading = jest.fn()
  const mockDismiss = jest.fn()
  
  return {
    __esModule: true,
    default: Object.assign(mockToastFn, {
      success: mockSuccess,
      error: mockError,
      loading: mockLoading,
      dismiss: mockDismiss,
    }),
  }
})

import toast from 'react-hot-toast'

const mockToast = toast as jest.Mocked<typeof toast>
const mockToastFn = toast as jest.MockedFunction<typeof toast>

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('success toast', () => {
    it('calls toast.success with correct message and options', () => {
      const { result } = renderHook(() => useToast())
      const message = 'Success message'

      result.current.success(message)

      expect(mockToast.success).toHaveBeenCalledWith(message, {
        duration: 4000,
        style: {
          background: '#f0fdf4',
          color: '#15803d',
          border: '1px solid #bbf7d0',
          padding: '16px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#ffffff',
        },
      })
    })

    it('returns toast ID when called', () => {
      const mockToastId = 'success-toast-1'
      mockToast.success.mockReturnValue(mockToastId)
      
      const { result } = renderHook(() => useToast())
      const toastId = result.current.success('Test message')

      expect(toastId).toBe(mockToastId)
    })

    it('uses correct green color theme', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.success('Green themed message')

      const callArgs = mockToast.success.mock.calls[0][1]
      expect(callArgs?.style?.background).toBe('#f0fdf4')
      expect(callArgs?.style?.color).toBe('#15803d')
      expect(callArgs?.style?.border).toBe('1px solid #bbf7d0')
      expect(callArgs?.iconTheme?.primary).toBe('#10b981')
    })
  })

  describe('error toast', () => {
    it('calls toast.error with correct message and options', () => {
      const { result } = renderHook(() => useToast())
      const message = 'Error message'

      result.current.error(message)

      expect(mockToast.error).toHaveBeenCalledWith(message, {
        duration: 5000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          padding: '16px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      })
    })

    it('returns toast ID when called', () => {
      const mockToastId = 'error-toast-1'
      mockToast.error.mockReturnValue(mockToastId)
      
      const { result } = renderHook(() => useToast())
      const toastId = result.current.error('Test error')

      expect(toastId).toBe(mockToastId)
    })

    it('uses longer duration for errors', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.error('Error with longer duration')

      const callArgs = mockToast.error.mock.calls[0][1]
      expect(callArgs?.duration).toBe(5000)
    })

    it('uses correct red color theme', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.error('Red themed error')

      const callArgs = mockToast.error.mock.calls[0][1]
      expect(callArgs?.style?.background).toBe('#fef2f2')
      expect(callArgs?.style?.color).toBe('#dc2626')
      expect(callArgs?.style?.border).toBe('1px solid #fecaca')
      expect(callArgs?.iconTheme?.primary).toBe('#ef4444')
    })
  })

  describe('info toast', () => {
    it('calls toast with correct message and options', () => {
      const { result } = renderHook(() => useToast())
      const message = 'Info message'

      result.current.info(message)

      expect(mockToastFn).toHaveBeenCalledWith(message, {
        duration: 3500,
        style: {
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          padding: '16px',
          fontWeight: '500',
        },
        icon: 'ℹ️',
      })
    })

    it('returns toast ID when called', () => {
      const mockToastId = 'info-toast-1'
      mockToastFn.mockReturnValue(mockToastId)
      
      const { result } = renderHook(() => useToast())
      const toastId = result.current.info('Test info')

      expect(toastId).toBe(mockToastId)
    })

    it('uses custom info icon', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.info('Info with custom icon')

      const callArgs = mockToastFn.mock.calls[0][1]
      expect(callArgs?.icon).toBe('ℹ️')
    })

    it('uses correct blue color theme', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.info('Blue themed info')

      const callArgs = mockToastFn.mock.calls[0][1]
      expect(callArgs?.style?.background).toBe('#eff6ff')
      expect(callArgs?.style?.color).toBe('#1d4ed8')
      expect(callArgs?.style?.border).toBe('1px solid #bfdbfe')
    })
  })

  describe('loading toast', () => {
    it('calls toast.loading with correct message and options', () => {
      const { result } = renderHook(() => useToast())
      const message = 'Loading message'

      result.current.loading(message)

      expect(mockToast.loading).toHaveBeenCalledWith(message, {
        style: {
          background: '#ffffff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          padding: '16px',
          fontWeight: '500',
        },
      })
    })

    it('returns toast ID when called', () => {
      const mockToastId = 'loading-toast-1'
      mockToast.loading.mockReturnValue(mockToastId)
      
      const { result } = renderHook(() => useToast())
      const toastId = result.current.loading('Test loading')

      expect(toastId).toBe(mockToastId)
    })

    it('uses neutral color theme for loading', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.loading('Loading with neutral theme')

      const callArgs = mockToast.loading.mock.calls[0][1]
      expect(callArgs?.style?.background).toBe('#ffffff')
      expect(callArgs?.style?.color).toBe('#374151')
      expect(callArgs?.style?.border).toBe('1px solid #e5e7eb')
    })

    it('does not specify duration for loading toasts', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.loading('Loading without duration')

      const callArgs = mockToast.loading.mock.calls[0][1]
      expect(callArgs?.duration).toBeUndefined()
    })
  })

  describe('dismiss functionality', () => {
    it('calls toast.dismiss without ID', () => {
      const { result } = renderHook(() => useToast())

      result.current.dismiss()

      expect(mockToast.dismiss).toHaveBeenCalledWith(undefined)
    })

    it('calls toast.dismiss with specific toast ID', () => {
      const { result } = renderHook(() => useToast())
      const toastId = 'specific-toast-123'

      result.current.dismiss(toastId)

      expect(mockToast.dismiss).toHaveBeenCalledWith(toastId)
    })

    it('returns result from toast.dismiss', () => {
      mockToast.dismiss.mockReturnValue(undefined)
      
      const { result } = renderHook(() => useToast())
      const returnValue = result.current.dismiss('test-id')

      expect(returnValue).toBeUndefined()
    })
  })

  describe('hook interface', () => {
    it('returns all expected methods', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current).toHaveProperty('success')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('info')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('dismiss')

      expect(typeof result.current.success).toBe('function')
      expect(typeof result.current.error).toBe('function')
      expect(typeof result.current.info).toBe('function')
      expect(typeof result.current.loading).toBe('function')
      expect(typeof result.current.dismiss).toBe('function')
    })

    it('creates new function instances on each render', () => {
      const { result, rerender } = renderHook(() => useToast())
      
      const firstRender = result.current
      rerender()
      const secondRender = result.current

      // Functions are recreated on each render since useToast doesn't use useCallback
      expect(firstRender.success).not.toBe(secondRender.success)
      expect(firstRender.error).not.toBe(secondRender.error)
      expect(firstRender.info).not.toBe(secondRender.info)
      expect(firstRender.loading).not.toBe(secondRender.loading)
      expect(firstRender.dismiss).not.toBe(secondRender.dismiss)
    })
  })

  describe('common styling properties', () => {
    it('applies consistent padding and font weight across all toast types', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.success('Success test')
      result.current.error('Error test')
      result.current.info('Info test')
      result.current.loading('Loading test')

      // Check success style
      const successStyle = mockToast.success.mock.calls[0][1]?.style
      expect(successStyle?.padding).toBe('16px')
      expect(successStyle?.fontWeight).toBe('500')

      // Check error style
      const errorStyle = mockToast.error.mock.calls[0][1]?.style
      expect(errorStyle?.padding).toBe('16px')
      expect(errorStyle?.fontWeight).toBe('500')

      // Check info style
      const infoStyle = mockToastFn.mock.calls[0][1]?.style
      expect(infoStyle?.padding).toBe('16px')
      expect(infoStyle?.fontWeight).toBe('500')

      // Check loading style
      const loadingStyle = mockToast.loading.mock.calls[0][1]?.style
      expect(loadingStyle?.padding).toBe('16px')
      expect(loadingStyle?.fontWeight).toBe('500')
    })
  })

  describe('edge cases', () => {
    it('handles empty string messages', () => {
      const { result } = renderHook(() => useToast())
      
      result.current.success('')
      result.current.error('')
      result.current.info('')
      result.current.loading('')

      expect(mockToast.success).toHaveBeenCalledWith('', expect.any(Object))
      expect(mockToast.error).toHaveBeenCalledWith('', expect.any(Object))
      expect(mockToastFn).toHaveBeenCalledWith('', expect.any(Object))
      expect(mockToast.loading).toHaveBeenCalledWith('', expect.any(Object))
    })

    it('handles very long messages', () => {
      const { result } = renderHook(() => useToast())
      const longMessage = 'A'.repeat(1000)
      
      result.current.success(longMessage)

      expect(mockToast.success).toHaveBeenCalledWith(longMessage, expect.any(Object))
    })

    it('handles special characters in messages', () => {
      const { result } = renderHook(() => useToast())
      const specialMessage = '🎉 Success! 特殊文字 & HTML <tags> "quotes" \'apostrophes\''
      
      result.current.info(specialMessage)

      expect(mockToastFn).toHaveBeenCalledWith(specialMessage, expect.any(Object))
    })
  })
}) 