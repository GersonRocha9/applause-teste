'use client';

import { RECOGNITION_TYPES } from '@/constants';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/useToast';
import { memo, useCallback, useMemo } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
  </svg>
);

export const SearchAndFilters = memo(function SearchAndFilters() {
  const { state, actions } = useApp();
  const toast = useToast();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setFilter({ searchTerm: e.target.value });
  }, [actions]);

  const handleTypeFilter = useCallback((type: string) => {
    const newType = state.filter.recognitionType === type ? '' : type;
    actions.setFilter({ recognitionType: newType });
  }, [state.filter.recognitionType, actions]);

  const clearFilters = useCallback(() => {
    actions.setFilter({ searchTerm: '', recognitionType: '' });
    toast.info('Filtros limpos! Exibindo todos os reconhecimentos');
  }, [actions, toast]);

  const hasActiveFilters = useMemo(() => {
    return state.filter.searchTerm || state.filter.recognitionType;
  }, [state.filter]);

  const filteredPostsCount = useMemo(() => {
    const filteredPosts = state.posts.filter(post => {
      const matchesSearch = !state.filter.searchTerm || 
        post.authorName.toLowerCase().includes(state.filter.searchTerm.toLowerCase()) ||
        post.recipientName.toLowerCase().includes(state.filter.searchTerm.toLowerCase());
      
      const matchesType = !state.filter.recognitionType || post.type === state.filter.recognitionType;
      
      return matchesSearch && matchesType;
    });
    return filteredPosts.length;
  }, [state.posts, state.filter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Buscar por nome do autor ou destinatário..."
          value={state.filter.searchTerm}
          onChange={handleSearchChange}
          leftIcon={<SearchIcon />}
          className="w-full cursor-text"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <FilterIcon />
          <span className="text-sm font-medium text-gray-700">Filtrar por tipo de reconhecimento:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {RECOGNITION_TYPES.map((type) => (
            <Button
              key={type.value}
              onClick={() => handleTypeFilter(type.value)}
              variant={state.filter.recognitionType === type.value ? 'primary' : 'outline'}
              size="sm"
              className="flex items-center space-x-2 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-lg">{type.emoji}</span>
              <span>{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          {hasActiveFilters ? (
            <>Mostrando <span className="font-medium">{filteredPostsCount}</span> de <span className="font-medium">{state.posts.length}</span> reconhecimentos</>
          ) : (
            <>Total de <span className="font-medium">{state.posts.length}</span> reconhecimentos</>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
          >
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}); 