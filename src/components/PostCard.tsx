'use client';

import { Post } from '@/types';
import Image from 'next/image';
import { memo } from 'react';
import { Avatar } from './ui/Avatar';

interface PostCardProps {
  post: Post;
  isNew?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `${diffInMinutes}min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return date.toLocaleDateString('pt-BR');
}

export const PostCard = memo(function PostCard({ post, isNew = false }: PostCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 ${isNew ? 'slide-in-from-top' : ''}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Avatar src={post.authorAvatar} alt={post.authorName} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{post.authorName}</span>
              <span className="text-gray-500 text-sm sm:text-base">elogiou</span>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{post.recipientName}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
              <span className="text-xl sm:text-2xl">{post.emoji}</span>
              <span className="text-xs sm:text-sm font-medium text-blue-600">{post.type}</span>
            </div>
          </div>
        </div>
        <time className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0">{formatDate(post.date)}</time>
      </div>

      <p className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">{post.text}</p>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {post.hashtags.map((hashtag, index) => (
            <span 
              key={index}
              className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 cursor-pointer transition-colors duration-200"
              onClick={() => console.log(`Clicked hashtag: ${hashtag}`)}
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      {post.image && (
        <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden bg-gray-100 mb-3 sm:mb-0">
          <Image
            src={post.image}
            alt="Post image"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}

      <div className="flex items-center mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <Avatar src={post.recipientAvatar} alt={post.recipientName} size="sm" />
        <span className="ml-2 text-xs sm:text-sm text-gray-600">
          Reconhecimento para <span className="font-medium">{post.recipientName}</span>
        </span>
      </div>
    </div>
  );
}); 