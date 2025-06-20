'use client';

import { RecognitionType } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: RecognitionType[];
  value: RecognitionType | null;
  onChange: (value: RecognitionType | null) => void;
  error?: string;
  required?: boolean;
}

export function Select({ 
  label, 
  placeholder = "Selecione uma opção", 
  options, 
  value, 
  onChange, 
  error,
  required = false 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: RecognitionType) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-full bg-white border rounded-lg px-4 py-3 text-left cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {value ? (
                <>
                  <span className="text-xl">{value.emoji}</span>
                  <span className="text-gray-900 font-medium">{value.label}</span>
                </>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`
                  w-full px-4 py-3 text-left flex items-center space-x-3
                  hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
                  transition-colors duration-150 cursor-pointer
                  ${value?.value === option.value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                <span className="text-xl">{option.emoji}</span>
                <span className="font-medium">{option.label}</span>
                {value?.value === option.value && (
                  <svg className="w-5 h-5 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 