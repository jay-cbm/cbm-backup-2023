import { getAllPosts } from '@/lib/api';
import { getAllContent } from '@/lib/content-api';
import { Metadata } from 'next';
import { BLOCKCHAIN_TOPICS, SUBTOPICS } from '@/lib/client-utils';
import PostsClient from './posts-client';

// This tells Next.js this is a dynamic route that shouldn't be statically generated
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Articles | Blockchain Insights',
  description: 'Browse our collection of articles, tutorials, and insights on blockchain, cryptocurrency, and Web3 technologies.',
};

export default async function AllPostsPage() {
  // Get all posts using both API functions
  const apiPosts = await getAllPosts();
  const contentApiPosts = await getAllContent();
  
  // Combine posts from both APIs, ensuring no duplicates by slug
  const slugSet = new Set();
  const allPosts = [...apiPosts];
  apiPosts.forEach(post => slugSet.add(post.slug));
  
  // Add posts from content API if they don't already exist
  contentApiPosts.forEach(post => {
    if (!slugSet.has(post.slug)) {
      allPosts.push(post);
      slugSet.add(post.slug);
    }
  });
  
  // Calculate topic counts for the filter sidebar
  const topicCounts: Record<string, number> = {};
  
  allPosts.forEach(post => {
    if (post.topics) {
      post.topics.forEach(topic => {
        const normalizedTopic = topic.toLowerCase().trim();
        topicCounts[normalizedTopic] = (topicCounts[normalizedTopic] || 0) + 1;
      });
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">All Articles</h1>
        <p className="text-xl text-gray-600">
          Browse our collection of articles, tutorials, and insights on blockchain, cryptocurrency, and Web3 technologies.
        </p>
      </div>
      
      <PostsClient 
        initialPosts={allPosts} 
        topicCounts={topicCounts}
        blockchainTopics={BLOCKCHAIN_TOPICS}
        subtopics={SUBTOPICS}
      />
    </div>
  );
}
