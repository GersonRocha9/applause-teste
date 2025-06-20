'use client';

import { useApp } from '@/contexts/AppContext';
import { memo, useCallback, useEffect, useRef } from 'react';
import { PostCard } from './PostCard';
import { Button } from './ui/Button';

export const Feed = memo(function Feed() {
  const { state, actions } = useApp();
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (state.hasMorePosts) {
      actions.loadMorePosts();
    }
  }, [state.hasMorePosts, actions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && state.hasMorePosts) {
          handleLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [handleLoadMore, state.hasMorePosts]);

  if (state.displayedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum reconhecimento encontrado</h3>
        <p className="text-gray-500">
          Tente ajustar seus filtros ou seja o primeiro a fazer um reconhecimento!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {state.displayedPosts.map((post, index) => (
        <PostCard 
          key={post.id} 
          post={post} 
          isNew={index === 0 && state.currentPage === 1}
        />
      ))}

      <div ref={loadingRef} className="text-center py-6">
        {state.hasMorePosts ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <Button 
              onClick={handleLoadMore}
              variant="outline"
              className="mx-auto hover:shadow-md transition-shadow duration-200"
            >
              Carregar mais reconhecimentos
            </Button>
          </div>
        ) : state.displayedPosts.length > 0 ? (
          <div className="text-gray-500 text-sm">
            ✨ Você viu todos os reconhecimentos!
          </div>
        ) : null}
      </div>
    </div>
  );
}); 