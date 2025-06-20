'use client';

import { Participant } from '@/types';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from './ui/Avatar';
import { Input } from './ui/Input';

interface ParticipantSelectorProps {
  participants: Participant[];
  selectedParticipant: Participant | null;
  onSelect: (participant: Participant | null) => void;
  error?: string;
}

const PARTICIPANTS_PER_PAGE = 20;

export const ParticipantSelector = memo(function ParticipantSelector({
  participants,
  selectedParticipant,
  onSelect,
  error
}: ParticipantSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredParticipants = useMemo(() => {
    if (!searchTerm) return participants;
    return participants.filter(participant =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [participants, searchTerm]);

  const paginatedParticipants = useMemo(() => {
    return filteredParticipants.slice(0, currentPage * PARTICIPANTS_PER_PAGE);
  }, [filteredParticipants, currentPage]);

  const hasMoreParticipants = paginatedParticipants.length < filteredParticipants.length;

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setIsOpen(true);
  }, []);

  const handleSelectParticipant = useCallback((participant: Participant) => {
    onSelect(participant);
    setSearchTerm('');
    setIsOpen(false);
    setCurrentPage(1);
  }, [onSelect]);

  const handleRemoveParticipant = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  const handleLoadMore = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Buscar participante *
      </label>

      {selectedParticipant && (
        <div className="slide-in-from-left flex items-center space-x-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Avatar src={selectedParticipant.avatar} alt={selectedParticipant.name} size="sm" />
          <span className="flex-1 font-medium text-blue-900">{selectedParticipant.name}</span>
          <button
            onClick={handleRemoveParticipant}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            type="button"
            title="Remover participante"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <Input
          ref={inputRef}
          placeholder="Digite o nome do participante..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          error={error}
          className="cursor-text"
          leftIcon={
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto custom-scrollbar">
            {paginatedParticipants.length > 0 ? (
              <>
                {paginatedParticipants.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => handleSelectParticipant(participant)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left cursor-pointer focus:bg-gray-50 focus:outline-none"
                    type="button"
                  >
                    <Avatar src={participant.avatar} alt={participant.name} size="sm" />
                    <span className="font-medium text-gray-900">{participant.name}</span>
                  </button>
                ))}
                
                {hasMoreParticipants && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full p-3 text-center text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100 cursor-pointer focus:bg-blue-50 focus:outline-none"
                    type="button"
                  >
                    Carregar mais participantes...
                  </button>
                )}
              </>
            ) : searchTerm ? (
              <div className="p-3 text-center text-gray-500">
                Nenhum participante encontrado para &quot;{searchTerm}&quot;
              </div>
            ) : (
              <div className="p-3 text-center text-gray-500">
                Digite para buscar participantes
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}); 