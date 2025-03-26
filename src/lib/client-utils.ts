'use client';

import { Post } from "@/interfaces/post";

// Define available topics for better organization
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
  'technology',
  'news',
  'economics',
  'market'
];

// Client-safe interface for search options
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
    const query = searchQuery.toLowerCase().trim();
    if (query.length > 0) {
      // Split the query into words for better matching
      const queryWords = query.split(/\s+/).filter(word => word.length > 0);
      
      filteredPosts = filteredPosts.filter(post => {
        // Check if any of the query words match in title, excerpt, or content
        return queryWords.some(word => {
          const titleMatch = post.title?.toLowerCase().includes(word) || false;
          const excerptMatch = post.excerpt?.toLowerCase().includes(word) || false;
          const contentMatch = post.content?.toLowerCase().includes(word) || false;
          
          return titleMatch || excerptMatch || contentMatch;
        });
      });
    }
  }
  
  // Apply topic filter if provided
  if (topics.length > 0) {
    console.log('Filtering by topics:', topics);
    
    filteredPosts = filteredPosts.filter(post => {
      if (!post.topics || !Array.isArray(post.topics)) return false;
      
      // Normalize post topics once for efficiency
      const normalizedPostTopics = post.topics.map(t => t.toLowerCase().trim());
      console.log('Post topics for:', post.title, normalizedPostTopics);
      
      // Check if the post has at least one of the selected topics
      const hasMatchingTopic = topics.some(topic => {
        const normalizedTopic = topic.toLowerCase().trim();
        const matches = normalizedPostTopics.includes(normalizedTopic);
        if (matches) {
          console.log('Match found for topic:', topic, 'in post:', post.title);
        }
        return matches;
      });
      
      return hasMatchingTopic;
    });
    
    console.log('After topic filtering, posts count:', filteredPosts.length);
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
