import { Participant } from '@/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ParticipantSelector } from '../ParticipantSelector'

// Mock participants data
const mockParticipants: Participant[] = [
  { id: 1, name: 'João Silva', avatar: 'https://example.com/joao.jpg' },
  { id: 2, name: 'Maria Santos', avatar: 'https://example.com/maria.jpg' },
  { id: 3, name: 'Pedro Oliveira', avatar: 'https://example.com/pedro.jpg' },
  { id: 4, name: 'Ana Costa', avatar: 'https://example.com/ana.jpg' },
  { id: 5, name: 'Carlos Mendes', avatar: 'https://example.com/carlos.jpg' },
  { id: 6, name: 'Julia Santos', avatar: 'https://example.com/julia.jpg' },
  { id: 7, name: 'Roberto Silva', avatar: 'https://example.com/roberto.jpg' },
  { id: 8, name: 'Fernanda Lima', avatar: 'https://example.com/fernanda.jpg' },
  { id: 9, name: 'Lucas Pereira', avatar: 'https://example.com/lucas.jpg' },
  { id: 10, name: 'Camila Rocha', avatar: 'https://example.com/camila.jpg' }
]

// Generate more participants for pagination testing
const generateParticipants = (count: number): Participant[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 11,
    name: `Participante ${i + 11}`,
    avatar: `https://example.com/user${i + 11}.jpg`
  }))
}

const manyParticipants = [...mockParticipants, ...generateParticipants(25)] // 35 total

describe('ParticipantSelector Component', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  it('renders with initial state', () => {
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    expect(screen.getByText('Buscar participante *')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o nome do participante...')).toBeInTheDocument()
    // Dropdown should not be visible initially
    expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
  })

  it('shows empty state message when no participants and input is focused', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={[]}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    expect(screen.getByText('Digite para buscar participantes')).toBeInTheDocument()
  })

  it('opens dropdown when input is focused', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    // When there are participants, it shows them directly instead of the empty message
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
  })

  it('filters participants by search term', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.type(input, 'Silva')

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Roberto Silva')).toBeInTheDocument()
    expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument()
  })

  it('shows case-insensitive search results', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.type(input, 'maria')

    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
  })

  it('shows "not found" message when no participants match search', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.type(input, 'xyz')

    expect(screen.getByText('Nenhum participante encontrado para "xyz"')).toBeInTheDocument()
  })

  it('selects participant when clicked', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    const participantButton = screen.getByText('João Silva')
    await user.click(participantButton)

    expect(mockOnSelect).toHaveBeenCalledWith(mockParticipants[0])
  })

  it('displays selected participant', () => {
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={mockParticipants[0]}
        onSelect={mockOnSelect}
      />
    )

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByTitle('Remover participante')).toBeInTheDocument()
  })

  it('removes selected participant when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={mockParticipants[0]}
        onSelect={mockOnSelect}
      />
    )

    const removeButton = screen.getByTitle('Remover participante')
    await user.click(removeButton)

    expect(mockOnSelect).toHaveBeenCalledWith(null)
  })

  it('shows pagination with many participants', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={manyParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    // Should show first batch of participants
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Camila Rocha')).toBeInTheDocument() // Last of the initial 10
    
    // Check if load more button exists (means there are more participants)
    expect(screen.getByText('Carregar mais participantes...')).toBeInTheDocument()
  })

  it('loads more participants when load more button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={manyParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    const loadMoreButton = screen.getByText('Carregar mais participantes...')
    await user.click(loadMoreButton)

    // Should now show more participants - check for a participant that should be in the second batch
    expect(screen.getByText('Participante 11')).toBeInTheDocument() // First generated participant
  })

  it('resets pagination when search changes', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={manyParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    // Load more participants
    const loadMoreButton = screen.getByText('Carregar mais participantes...')
    await user.click(loadMoreButton)

    // Clear and search for something specific
    await user.clear(input)
    await user.type(input, 'Santos')

    // Should only show Santos participants (reset pagination)
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('Julia Santos')).toBeInTheDocument()
    expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <ParticipantSelector
          participants={mockParticipants}
          selectedParticipant={null}
          onSelect={mockOnSelect}
        />
        <button>Outside button</button>
      </div>
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    // Dropdown should be open - verify by seeing participants
    expect(screen.getByText('João Silva')).toBeInTheDocument()

    // Click outside
    const outsideButton = screen.getByText('Outside button')
    await user.click(outsideButton)

    // Dropdown should be closed - participants should not be visible
    expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
  })

  it('clears search and closes dropdown after selection', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.type(input, 'João')

    expect(input).toHaveValue('João')

    const participantButton = screen.getByText('João Silva')
    await user.click(participantButton)

    // Input should be cleared and dropdown closed
    expect(input).toHaveValue('')
    expect(screen.queryByText('João Silva')).not.toBeInTheDocument() // dropdown closed
  })

  it('displays error message when provided', () => {
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
        error="Por favor, selecione um participante"
      />
    )

    expect(screen.getByText('Por favor, selecione um participante')).toBeInTheDocument()
  })

  it('renders avatars for participants in dropdown', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    // Should have avatars for each participant
    const avatars = screen.getAllByRole('img')
    expect(avatars.length).toBeGreaterThan(0)
    
    // Check specific avatar
    expect(screen.getByAltText('João Silva')).toBeInTheDocument()
  })

  it('renders search icon in input', () => {
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    // Check for SVG search icon
    const searchIcon = document.querySelector('svg path[d*="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"]')
    expect(searchIcon).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={null}
        onSelect={mockOnSelect}
      />
    )

    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    expect(input).toHaveAttribute('placeholder', 'Digite o nome do participante...')
    
    // Label should be associated
    expect(screen.getByText('Buscar participante *')).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', async () => {
    const user = userEvent.setup()
    render(
      <ParticipantSelector
        participants={mockParticipants}
        selectedParticipant={mockParticipants[0]}
        onSelect={mockOnSelect}
      />
    )

    // Selected participant should have blue styling
    const selectedDiv = screen.getByText('João Silva').closest('div')
    expect(selectedDiv).toHaveClass('bg-blue-50', 'border-blue-200')

    // Open dropdown to check participant buttons
    const input = screen.getByPlaceholderText('Digite o nome do participante...')
    await user.click(input)

    const participantButton = screen.getByText('Maria Santos').closest('button')
    expect(participantButton).toHaveClass('hover:bg-gray-50', 'transition-colors')
  })
}) 