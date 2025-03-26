'use client';

import { useState, Suspense } from 'react';
import { Post } from '@/interfaces/post';
import { SearchBar } from '@/app/_components/search-bar';
import { TopicFilter } from '@/app/_components/topic-filter';
import { Pagination } from '@/app/_components/pagination';
import { PostCard } from '@/app/_components/post-card';
import { filterPosts } from '@/lib/client-utils';
import { useSearchParams, useRouter } from 'next/navigation';

interface PostsClientProps {
  initialPosts: Post[];
  topicCounts: Record<string, number>;
  blockchainTopics: string[];
  subtopics: string[];
}

// Main wrapper component that doesn't directly use useSearchParams
export default function PostsClient({ 
  initialPosts, 
  topicCounts,
  blockchainTopics,
  subtopics
}: PostsClientProps) {
  return (
    <Suspense fallback={<div className="my-8 text-center">Loading posts...</div>}>
      <PostsClientContent 
        initialPosts={initialPosts}
        topicCounts={topicCounts}
        blockchainTopics={blockchainTopics}
        subtopics={subtopics}
      />
    </Suspense>
  );
}

// Inner component that uses useSearchParams within Suspense boundary
function PostsClientContent({ 
  initialPosts, 
  topicCounts,
  blockchainTopics,
  subtopics
}: PostsClientProps) {
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
    console.log('Updating URL params with:', newParams);
    
    // Create a new URLSearchParams object to avoid mutation issues
    const params = new URLSearchParams();
    
    // Preserve existing parameters that aren't being updated
    searchParams.forEach((value, key) => {
      if (!(key === 'q' && newParams.q !== undefined) && 
          !(key === 'topics' && newParams.topics !== undefined) && 
          !(key === 'page' && newParams.page !== undefined)) {
        params.set(key, value);
      }
    });
    
    // Update with new parameters
    if (newParams.q !== undefined) {
      if (newParams.q) {
        params.set('q', newParams.q);
      } else {
        params.delete('q');
      }
    }
    
    if (newParams.topics !== undefined) {
      if (newParams.topics.length > 0) {
        // Ensure topics are properly encoded
        const topicsString = newParams.topics.join(',');
        params.set('topics', topicsString);
        console.log('Setting topics URL param:', topicsString);
      } else {
        params.delete('topics');
        console.log('Removing topics URL param');
      }
    }
    
    if (newParams.page !== undefined) {
      if (newParams.page > 1) {
        params.set('page', newParams.page.toString());
      } else {
        params.delete('page');
      }
    }
    
    const newUrl = `/posts${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('New URL:', newUrl);
    
    // Use Next.js router for client-side navigation
    router.push(newUrl);
  };
  
  // Event handlers
  const handleSearch = (newQuery: string) => {
    updateUrlParams({ q: newQuery, page: 1 });
    setCurrentPage(1);
  };
  
  const handleTopicChange = (newTopics: string[]) => {
    console.log('Topic change detected:', newTopics);
    // Force a reset of the current page to 1 when topics change
    setCurrentPage(1);
    // Update URL with the new topics
    updateUrlParams({ topics: newTopics, page: 1 });
  };
  
  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };
  
  return (
    <>
      <SearchBar initialQuery={query} onSearch={handleSearch} />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="md:w-1/4">
          <TopicFilter 
            selectedTopics={selectedTopics} 
            onTopicChange={handleTopicChange}
            topicCounts={topicCounts}
          />
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          {/* Results summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              {isLoading ? (
                'Loading results...'
              ) : totalPosts === 0 ? (
                'No posts found. Try adjusting your filters.'
              ) : (
                `Showing ${filteredPosts.length} of ${totalPosts} posts`
              )}
            </p>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-[400px]"></div>
              ))}
            </div>
          ) : totalPosts === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Grid of posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <div key={post.slug} className="h-full">
                    <PostCard 
                      post={post} 
                      showTopics={true}
                      postType="post"
                    />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
