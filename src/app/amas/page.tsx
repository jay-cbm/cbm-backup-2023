import { getAMAPosts } from '@/lib/api';
import { getAMAContent } from '@/lib/content-api';
import { Metadata } from 'next';
import { BLOCKCHAIN_TOPICS, SUBTOPICS } from '@/lib/client-utils';
import { Post } from '@/interfaces/post';
import { default as dynamicImport } from 'next/dynamic';
import { ErrorBoundary } from '../_components/error-boundary';

// This tells Next.js this is a dynamic route that shouldn't be statically generated
// Using correct Next.js configuration property
export const dynamic = 'force-dynamic';

// Use dynamic import with no SSR to fix chunk loading issues
const AMAsClient = dynamicImport(() => import('./amas-client'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mb-4"></div>
      <p className="text-gray-600">Loading AMAs...</p>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'Ask Me Anything (AMAs) | Blockchain Insights',
  description: 'Browse our collection of AMAs with industry experts and thought leaders in the blockchain space.',
};

export default async function AMAsPage() {
  // Wrap in try/catch to handle any errors during data fetching
  let amaPosts: Post[] = [];
  let apiPosts: Post[] = [];
  let contentApiPosts: Post[] = [];
  
  try {
    // Get all AMA posts using both API functions
    apiPosts = await getAMAPosts();
    contentApiPosts = await getAMAContent();
    
    // Combine posts from both APIs, ensuring no duplicates by slug
    const slugSet = new Set();
    amaPosts = [...apiPosts];
    apiPosts.forEach(post => slugSet.add(post.slug));
    
    // Add posts from content API if they don't already exist
    contentApiPosts.forEach(post => {
      if (!slugSet.has(post.slug)) {
        amaPosts.push(post);
        slugSet.add(post.slug);
      }
    });
  } catch (error) {
    console.error('Error fetching AMA posts:', error);
    // Return empty arrays if there's an error to prevent page from crashing
    amaPosts = [];
  }
  
  // Calculate topic counts for the filter sidebar
  const topicCounts: Record<string, number> = {};
  
  amaPosts.forEach(post => {
    if (post.topics) {
      post.topics.forEach((topic: string) => {
        const normalizedTopic = topic.toLowerCase().trim();
        topicCounts[normalizedTopic] = (topicCounts[normalizedTopic] || 0) + 1;
      });
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ask Me Anything (AMAs)</h1>
        <p className="text-xl text-gray-600">
          Explore our collection of AMAs with industry experts and thought leaders in the blockchain space.
        </p>
      </div>
      
      <ErrorBoundary>
        <AMAsClient 
        initialPosts={amaPosts} 
        topicCounts={topicCounts}
        blockchainTopics={BLOCKCHAIN_TOPICS}
        subtopics={SUBTOPICS}
      />
      </ErrorBoundary>
    </div>
  );
}
