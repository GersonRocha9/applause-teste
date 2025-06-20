import { debounce, extractHashtags, formatRelativeTime, generateUniqueId, validateImageFile } from '../index'

describe('Utility Functions', () => {
  describe('formatRelativeTime', () => {
    it('returns "agora" for current time', () => {
      const now = new Date().toISOString()
      const result = formatRelativeTime(now)
      expect(result).toBe('agora')
    })

    it('returns minutes for recent time', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const result = formatRelativeTime(fiveMinutesAgo)
      expect(result).toBe('5min')
    })

    it('returns locale date for old dates', () => {
      const oldDate = '2020-01-15T10:30:00Z'
      const result = formatRelativeTime(oldDate)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('extractHashtags', () => {
    it('extracts hashtags from text', () => {
      const text = 'This is a #great #post with #hashtags'
      const result = extractHashtags(text)
      expect(result).toEqual(['great', 'post', 'hashtags'])
    })

    it('returns empty array for text without hashtags', () => {
      const text = 'This is just normal text'
      const result = extractHashtags(text)
      expect(result).toEqual([])
    })

    it('handles empty string', () => {
      const result = extractHashtags('')
      expect(result).toEqual([])
    })
  })

  describe('validateImageFile', () => {
    it('validates correct image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('rejects files that are too large', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(largeFile)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('A imagem deve ter no máximo 5MB')
    })

    it('rejects unsupported file types', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' })
      const result = validateImageFile(file)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Formato de imagem não suportado. Use JPG, PNG, GIF ou WebP')
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 1000)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(1000)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('generateUniqueId', () => {
    it('generates different IDs', () => {
      const id1 = generateUniqueId()
      const id2 = generateUniqueId()
      expect(id1).not.toBe(id2)
    })

    it('returns a number', () => {
      const id = generateUniqueId()
      expect(typeof id).toBe('number')
    })
  })
}) 