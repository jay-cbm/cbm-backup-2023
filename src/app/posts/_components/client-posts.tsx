'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/app/_components/search-bar';
import { TopicFilter } from '@/app/_components/topic-filter';
import { Pagination } from '@/app/_components/pagination';
import { PostCard } from '@/app/_components/post-card';
import { filterPosts } from '@/lib/client-utils';
import { Post } from '@/interfaces/post';

const POSTS_PER_PAGE = 12;

interface ClientPostsProps {
  initialPosts: Post[];
  topicCounts: Record<string, number>;
  blockchainTopics: string[];
  subtopics: string[];
}

export default function ClientPosts({ 
  initialPosts, 
  topicCounts,
  blockchainTopics,
  subtopics
}: ClientPostsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Parse query parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const topicsParam = searchParams.get('topics') || '';
  const selectedTopics = topicsParam ? topicsParam.split(',') : [];
  
  // State
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter posts client-side based on search parameters
  useEffect(() => {
    setIsLoading(true);
    
    // Use the filterPosts function from pages-cms
    const results = filterPosts(initialPosts, {
      searchQuery: query,
      topics: selectedTopics,
      page: currentPage,
      limit: POSTS_PER_PAGE
    });
    
    setFilteredPosts(results.posts);
    setTotalPosts(results.total);
    setTotalPages(results.totalPages);
    setIsLoading(false);
  }, [initialPosts, query, selectedTopics, currentPage]);
  
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
  
  // We'll let the Link component in PostCard handle navigation
  // This avoids conflicts between different navigation methods
  
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
                'No articles found. Try adjusting your filters.'
              ) : (
                `Showing ${filteredPosts.length} of ${totalPosts} articles`
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
          ) : (
            <>
              {/* Results grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.slug} className="h-full">
                      <PostCard post={post} showTopics={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
