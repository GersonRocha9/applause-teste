export interface Participant {
  id: number;
  name: string;
  avatar: string;
}

export interface Post {
  id: number;
  authorName: string;
  authorAvatar: string;
  recipientName: string;
  recipientAvatar: string;
  type: string;
  emoji: string;
  date: string;
  text: string;
  image: string;
  hashtags?: string[];
}

export interface RecognitionType {
  emoji: string;
  label: string;
  value: string;
}

export interface Filter {
  searchTerm: string;
  recognitionType: string;
}

export interface AppState {
  posts: Post[];
  participants: Participant[];
  filter: Filter;
  displayedPosts: Post[];
  currentPage: number;
  postsPerPage: number;
  hasMorePosts: boolean;
}

export interface NewPostData {
  recipient: Participant | null;
  recognitionType: RecognitionType | null;
  message: string;
  image: File | null;
  hashtags: string[];
} 