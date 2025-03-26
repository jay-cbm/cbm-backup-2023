import { getPressReleases } from '@/lib/api';
import { getPressReleaseContent } from '@/lib/content-api';
import { Metadata } from 'next';
import { BLOCKCHAIN_TOPICS, SUBTOPICS } from '@/lib/client-utils';
import PressReleasesClient from './press-releases-client';

// This tells Next.js this is a dynamic route that shouldn't be statically generated
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Press Releases | CryptoBitMag',
  description: 'Latest press releases covering cryptocurrency, blockchain technology, and digital assets.',
};

export default async function PressReleasesPage() {
  // Get all press release posts using both API functions
  const apiPosts = await getPressReleases();
  const contentApiPosts = await getPressReleaseContent();
  
  // Combine posts from both APIs, ensuring no duplicates by slug
  const slugSet = new Set();
  const pressReleasePosts = [...apiPosts];
  apiPosts.forEach(post => slugSet.add(post.slug));
  
  // Add posts from content API if they don't already exist
  contentApiPosts.forEach(post => {
    if (!slugSet.has(post.slug)) {
      pressReleasePosts.push(post);
      slugSet.add(post.slug);
    }
  });
  
  // Calculate topic counts for the filter sidebar
  const topicCounts: Record<string, number> = {};
  
  pressReleasePosts.forEach(post => {
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
        <h1 className="text-4xl font-bold mb-2">Press Releases</h1>
        <p className="text-xl text-gray-600">
          Latest press releases covering cryptocurrency, blockchain technology, and digital assets.
        </p>
      </div>
      
      <PressReleasesClient 
        initialPosts={pressReleasePosts}
        topicCounts={topicCounts}
        blockchainTopics={BLOCKCHAIN_TOPICS}
        subtopics={SUBTOPICS}
      />
    </div>
  );
}
