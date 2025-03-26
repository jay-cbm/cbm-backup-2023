'use client';

import { useState, Suspense } from 'react';
import { Post } from '@/interfaces/post';
import { SearchBar } from '@/app/_components/search-bar';
import { TopicFilter } from '@/app/_components/topic-filter';
import { Pagination } from '@/app/_components/pagination';
import { PostCard } from '@/app/_components/post-card';
import { filterPosts } from '@/lib/client-utils';
import { useSearchParams, useRouter } from 'next/navigation';

interface PressReleasesClientProps {
  initialPosts: Post[];
  topicCounts: Record<string, number>;
  blockchainTopics: string[];
  subtopics: string[];
}

// Main wrapper component that doesn't directly use useSearchParams
export default function PressReleasesClient({ 
  initialPosts, 
  topicCounts,
  blockchainTopics,
  subtopics
}: PressReleasesClientProps) {
  return (
    <Suspense fallback={<div className="my-8 text-center">Loading press releases...</div>}>
      <PressReleasesClientContent 
        initialPosts={initialPosts}
        topicCounts={topicCounts}
        blockchainTopics={blockchainTopics}
        subtopics={subtopics}
      />
    </Suspense>
  );
}

// Inner component that uses useSearchParams within Suspense boundary
function PressReleasesClientContent({ 
  initialPosts, 
  topicCounts,
  blockchainTopics,
  subtopics
}: PressReleasesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Parse query parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const topicsParam = searchParams.get('topics') || '';
  const selectedTopics = topicsParam ? topicsParam.split(',') : [];
  
  // State
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter posts based on current parameters
  const { posts: filteredPosts, total: totalPosts, totalPages } = filterPosts(initialPosts, {
    searchQuery: query,
    topics: selectedTopics,
    page: currentPage,
    limit: 12 // Posts per page
  });
  
  // Update URL when filters change
  const updateUrlParams = (newParams: { q?: string; topics?: string[]; page?: number }) => {
    const params = new URLSearchParams();
    
    // Add search query if present
    if (newParams.q) {
      params.set('q', newParams.q);
    }
    
    // Add selected topics if present
    if (newParams.topics && newParams.topics.length > 0) {
      params.set('topics', newParams.topics.join(','));
    }
    
    // Add page number if not 1
    if (newParams.page && newParams.page > 1) {
      params.set('page', newParams.page.toString());
    }
    
    // Update URL
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(newUrl);
  };
  
  // Handle search
  const handleSearch = (searchQuery: string) => {
    setCurrentPage(1);
    updateUrlParams({ q: searchQuery, topics: selectedTopics, page: 1 });
  };
  
  // Handle topic selection
  const handleTopicChange = (topics: string[]) => {
    setCurrentPage(1);
    updateUrlParams({ q: query, topics, page: 1 });
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams({ q: query, topics: selectedTopics, page: newPage });
    
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left sidebar with filters */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-8">
          <TopicFilter
            selectedTopics={selectedTopics}
            topicCounts={topicCounts}
            onTopicChange={handleTopicChange}
          />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow">
        <div className="mb-8">
          <SearchBar
            initialQuery={query}
            onSearch={handleSearch}
          />
        </div>
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {totalPosts === 0 ? (
              'No press releases found'
            ) : (
              `Found ${totalPosts} press release${totalPosts === 1 ? '' : 's'}`
            )}
          </p>
        </div>
        
        {/* Grid of posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              showTopics={true}
              postType="press-release"
            />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
