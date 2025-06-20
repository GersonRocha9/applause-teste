'use client';

import { forwardRef, memo } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = memo(forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ 
    label,
    error,
    className = '',
    ...props 
  }, ref) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1 cursor-default">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
            bg-white text-gray-900 placeholder-gray-500 cursor-text
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed
            hover:border-gray-400 transition-colors duration-200
            resize-vertical
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
)); 