'use client';

import { POSTS_PER_PAGE } from '@/constants';
import { AppState, Filter, NewPostData, Participant, Post } from '@/types';
import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import participantsData from '../../participants-mock.json';
import postsData from '../../posts-mock.json';

interface AppContextType {
  state: AppState;
  actions: {
    setFilter: (filter: Partial<Filter>) => void;
    loadMorePosts: () => void;
    addNewPost: (postData: NewPostData) => void;
    resetPosts: () => void;
  };
}

type AppAction =
  | { type: 'SET_FILTER'; payload: Partial<Filter> }
  | { type: 'LOAD_MORE_POSTS' }
  | { type: 'ADD_NEW_POST'; payload: NewPostData }
  | { type: 'RESET_POSTS' };

const initialState: AppState = {
  posts: postsData as Post[],
  participants: participantsData as Participant[],
  filter: {
    searchTerm: '',
    recognitionType: '',
  },
  displayedPosts: postsData.slice(0, POSTS_PER_PAGE) as Post[],
  currentPage: 1,
  postsPerPage: POSTS_PER_PAGE,
  hasMorePosts: postsData.length > POSTS_PER_PAGE,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FILTER': {
      const newFilter = { ...state.filter, ...action.payload };
      const filteredPosts = filterPosts(state.posts, newFilter);
      
      return {
        ...state,
        filter: newFilter,
        displayedPosts: filteredPosts.slice(0, POSTS_PER_PAGE),
        currentPage: 1,
        hasMorePosts: filteredPosts.length > POSTS_PER_PAGE,
      };
    }
    
    case 'LOAD_MORE_POSTS': {
      const filteredPosts = filterPosts(state.posts, state.filter);
      const nextPage = state.currentPage + 1;
      const newDisplayedPosts = filteredPosts.slice(0, nextPage * POSTS_PER_PAGE);
      
      return {
        ...state,
        displayedPosts: newDisplayedPosts,
        currentPage: nextPage,
        hasMorePosts: newDisplayedPosts.length < filteredPosts.length,
      };
    }
    
    case 'ADD_NEW_POST': {
      if (!action.payload.recipient || !action.payload.recognitionType) {
        return state;
      }

      const newPost: Post = {
        id: Date.now(),
        authorName: 'Você', // In a real app, this would come from authenticated user
        authorAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        recipientName: action.payload.recipient.name,
        recipientAvatar: action.payload.recipient.avatar,
        type: action.payload.recognitionType.value,
        emoji: action.payload.recognitionType.emoji,
        date: new Date().toISOString(),
        text: action.payload.message,
        image: action.payload.image ? URL.createObjectURL(action.payload.image) : 
               'https://picsum.photos/1200/800?random=100',
        hashtags: action.payload.hashtags,
      };

      const newPosts = [newPost, ...state.posts];
      const filteredPosts = filterPosts(newPosts, state.filter);
      
      return {
        ...state,
        posts: newPosts,
        displayedPosts: filteredPosts.slice(0, state.currentPage * POSTS_PER_PAGE),
        hasMorePosts: filteredPosts.length > state.currentPage * POSTS_PER_PAGE,
      };
    }
    
    case 'RESET_POSTS': {
      const filteredPosts = filterPosts(state.posts, state.filter);
      return {
        ...state,
        displayedPosts: filteredPosts.slice(0, POSTS_PER_PAGE),
        currentPage: 1,
        hasMorePosts: filteredPosts.length > POSTS_PER_PAGE,
      };
    }
    
    default:
      return state;
  }
}

function filterPosts(posts: Post[], filter: Filter): Post[] {
  return posts.filter(post => {
    const matchesSearch = !filter.searchTerm || 
      post.authorName.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      post.recipientName.toLowerCase().includes(filter.searchTerm.toLowerCase());
    
    const matchesType = !filter.recognitionType || post.type === filter.recognitionType;
    
    return matchesSearch && matchesType;
  });
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = useMemo(() => ({
    setFilter: (filter: Partial<Filter>) => {
      dispatch({ type: 'SET_FILTER', payload: filter });
    },
    loadMorePosts: () => {
      dispatch({ type: 'LOAD_MORE_POSTS' });
    },
    addNewPost: (postData: NewPostData) => {
      dispatch({ type: 'ADD_NEW_POST', payload: postData });
    },
    resetPosts: () => {
      dispatch({ type: 'RESET_POSTS' });
    },
  }), []);

  const value = useMemo(() => ({
    state,
    actions,
  }), [state, actions]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 