import Image from 'next/image';
import { memo } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const Avatar = memo(function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}: AvatarProps) {
  return (
    <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'}
        className="object-cover"
        unoptimized
      />
    </div>
  );
}); 