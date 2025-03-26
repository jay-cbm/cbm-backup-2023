import { Post } from "@/interfaces/post";

// This is a placeholder for the actual PagesCMS API integration
// You would replace this with actual API calls to your PagesCMS instance

// Define server-side constants
// Major blockchains
export const BLOCKCHAIN_TOPICS = [
  'bitcoin',
  'ethereum',
  'solana',
  'cardano',
  'polkadot',
  'avalanche',
  'cosmos',
  'ripple',
  'tezos',
  'near'
];

// Subtopics
export const SUBTOPICS = [
  'defi',
  'nfts',
  'dao',
  'gaming',
  'metaverse',
  'cryptography',
  'privacy',
  'security',
  'hacks',
  'legal',
  'regulation',
  'stablecoins',
  'interoperability',
  'scaling',
  'layer2',
  'mining',
  'staking',
  'governance',
  'identity',
  'market',
  'news',
  'technology',
  'economics'
];

// All available topics combined
export const AVAILABLE_TOPICS = [...BLOCKCHAIN_TOPICS, ...SUBTOPICS];

// Function to fetch posts by topic from PagesCMS
export async function getPostsByTopic(topic: string, limit: number = 10): Promise<Post[]> {
  // In a real implementation, this would make an API call to PagesCMS
  // For now, we'll use the local API to simulate this behavior
  
  const { getAllPosts } = await import('./api');
  const allPosts = getAllPosts();
  
  return allPosts
    .filter(post => post.topics?.includes(topic))
    .slice(0, limit);
}

// Function to fetch featured posts for the homepage
export async function getFeaturedPosts(limit: number = 4): Promise<Post[]> {
  const { getAllPosts } = await import('./api');
  const allPosts = getAllPosts();
  
  // In a real implementation, you might have a "featured" flag in PagesCMS
  // For now, we'll just return the most recent posts
  return allPosts.slice(0, limit);
}

// Function to fetch all available topics with their post counts
export async function getTopicsWithCounts(): Promise<{topic: string; count: number}[]> {
  const { getAllPosts } = await import('./api');
  const allPosts = getAllPosts();
  
  // Create a map to count posts per topic
  const topicCounts = new Map<string, number>();
  
  // Count posts for each topic
  allPosts.forEach(post => {
    if (post.topics) {
      post.topics.forEach(topic => {
        const currentCount = topicCounts.get(topic) || 0;
        topicCounts.set(topic, currentCount + 1);
      });
    }
  });
  
  // Convert map to array and sort by count (descending)
  return Array.from(topicCounts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
}

// Interface for search and filter options
export interface SearchOptions {
  searchQuery?: string;
  topics?: string[];
  page?: number;
  limit?: number;
}

// Client-side filtering function (doesn't use fs/api imports)
export function filterPosts(allPosts: Post[], options: SearchOptions = {}): {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
} {
  const {
    searchQuery = '',
    topics = [],
    page = 1,
    limit = 10
  } = options;
  
  // Filter posts by search query and topics
  let filteredPosts = [...allPosts];
  
  // Apply search filter if provided
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      (post.content && post.content.toLowerCase().includes(query))
    );
  }
  
  // Apply topic filter if provided
  if (topics.length > 0) {
    filteredPosts = filteredPosts.filter(post => {
      if (!post.topics) return false;
      // Check if the post has at least one of the selected topics
      return topics.some(topic => post.topics?.includes(topic));
    });
  }
  
  // Calculate pagination
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / limit);
  const safePageNumber = Math.max(1, Math.min(page, totalPages || 1));
  const offset = (safePageNumber - 1) * limit;
  
  // Get paginated results
  const paginatedPosts = filteredPosts.slice(offset, offset + limit);
  
  return {
    posts: paginatedPosts,
    total,
    page: safePageNumber,
    totalPages
  };
}

// Server-side search function
export async function searchPosts(options: SearchOptions = {}): Promise<{
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const { getAllPosts } = await import('./api');
  const allPosts = getAllPosts();
  return filterPosts(allPosts, options);
}
