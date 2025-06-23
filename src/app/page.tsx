'use client';

import { Feed } from '@/components/Feed';
import { MobileLayout } from '@/components/MobileLayout';
import { RecognitionForm } from '@/components/RecognitionForm';
import { SearchAndFilters } from '@/components/SearchAndFilters';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <MobileLayout />

      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <RecognitionForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <SearchAndFilters />
              <Feed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
