'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DateFormatter from './date-formatter';
import { Post } from '@/interfaces/post';

interface PostCardProps {
  post: Post;
  showTopics?: boolean;
  postType?: 'post' | 'ama' | 'press-release';
}

export function PostCard({ post, showTopics = false, postType = 'post' }: PostCardProps) {
  // Use Next.js router for client-side navigation
  const router = useRouter();

  // Determine the correct path based on the post type and slug
  let postPath = `/posts/${post.slug}`;
  
  if (postType === 'ama' || post.slug.startsWith('ama-') || (post.topics && post.topics.includes('ama'))) {
    postPath = `/amas/${post.slug}`;
  } else if (postType === 'press-release') {
    postPath = `/press-releases/${post.slug}`;
  }
    
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Image Container - Fixed height */}
      <Link href={postPath} prefetch={false} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={post.coverImage} 
            alt={`Cover Image for ${post.title}`}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            fill
          />
        </div>
      </Link>
      
      {/* Content Container - Flex grow to fill remaining space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Author and Date - Fixed height */}
        <div className="flex items-center mb-2 text-sm h-5">
          {post.author && (
            <span className="font-semibold mr-2 truncate">
              {postType === 'ama' && post.interviewee ? (
                <>
                  {post.interviewee.name} interviewed by {post.author.name}
                </>
              ) : (
                post.author.name
              )}
            </span>
          )}
          <span className="text-gray-500 whitespace-nowrap">
            • <DateFormatter dateString={post.date} />
          </span>
        </div>
        
        {/* Title - Fixed height with 2 lines */}
        <h3 className="text-xl font-bold leading-tight mb-2 h-14 line-clamp-2">
          <Link href={postPath} prefetch={false} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        
        {/* Excerpt - Fixed height with 2 lines */}
        <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">
          {post.excerpt}
        </p>
        
        {/* Topics - Auto height at bottom */}
        <div className="mt-auto">
          {showTopics && post.topics && post.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.topics.map(topic => (
                <span 
                  key={topic} 
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize hover:bg-gray-200 hover:text-red-600 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Prevent the event from bubbling up to parent links
                    e.stopPropagation();
                    
                    // Use Next.js router for client-side navigation
                    router.push(postType === 'ama' 
                      ? `/amas?topics=${encodeURIComponent(topic)}` 
                      : `/posts?topics=${encodeURIComponent(topic)}`);
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
