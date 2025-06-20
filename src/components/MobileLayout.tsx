'use client';

import { memo, useState } from 'react';
import { Feed } from './Feed';
import { RecognitionForm } from './RecognitionForm';
import { SearchAndFilters } from './SearchAndFilters';
import { Button } from './ui/Button';

export const MobileLayout = memo(function MobileLayout() {
  const [activeTab, setActiveTab] = useState<'feed' | 'form'>('feed');

  return (
    <div className="lg:hidden bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="flex">
          <Button
            onClick={() => setActiveTab('feed')}
            variant={activeTab === 'feed' ? 'primary' : 'ghost'}
            className={`
              flex-1 rounded-none py-4 px-6 border-b-2 transition-all duration-200 cursor-pointer
              ${activeTab === 'feed' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-800'
              }
            `}
          >
            <span className="flex items-center space-x-2">
              <span>📱</span>
              <span className="font-medium">Feed</span>
            </span>
          </Button>
          <Button
            onClick={() => setActiveTab('form')}
            variant={activeTab === 'form' ? 'primary' : 'ghost'}
            className={`
              flex-1 rounded-none py-4 px-6 border-b-2 transition-all duration-200 cursor-pointer
              ${activeTab === 'form' 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-800'
              }
            `}
          >
            <span className="flex items-center space-x-2">
              <span>✏️</span>
              <span className="font-medium">Elogiar</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        {activeTab === 'feed' ? (
          <div className="space-y-6">
            <SearchAndFilters />
            <Feed />
          </div>
        ) : (
          <RecognitionForm />
        )}
      </div>
    </div>
  );
}); 