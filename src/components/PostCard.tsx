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
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${isNew ? 'slide-in-from-top' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar src={post.authorAvatar} alt={post.authorName} size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{post.authorName}</span>
              <span className="text-gray-500">elogiou</span>
              <span className="font-semibold text-gray-900">{post.recipientName}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl">{post.emoji}</span>
              <span className="text-sm font-medium text-blue-600">{post.type}</span>
            </div>
          </div>
        </div>
        <time className="text-sm text-gray-500">{formatDate(post.date)}</time>
      </div>

      <p className="text-gray-800 mb-4 text-base leading-relaxed">{post.text}</p>

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.hashtags.map((hashtag, index) => (
            <span 
              key={index}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer transition-colors duration-200"
              onClick={() => console.log(`Clicked hashtag: ${hashtag}`)}
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      {post.image && (
        <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={post.image}
            alt="Post image"
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      )}

      <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
        <Avatar src={post.recipientAvatar} alt={post.recipientName} size="sm" />
        <span className="ml-2 text-sm text-gray-600">
          Reconhecimento para <span className="font-medium">{post.recipientName}</span>
        </span>
      </div>
    </div>
  );
}); 