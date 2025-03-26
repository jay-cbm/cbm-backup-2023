// This module should ONLY be imported in Server Components
// It uses Node.js APIs that are not available in the browser

import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

// Helper function to recursively get all markdown files in a directory and its subdirectories
function getMarkdownFiles(dir: string, baseDir: string = ''): string[] {
  try {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
      const res = join(baseDir, dirent.name);
      if (dirent.isDirectory()) {
        return getMarkdownFiles(join(dir, dirent.name), res);
      } else if (dirent.name.endsWith('.md')) {
        return res;
      } else {
        return [];
      }
    });
    return Array.prototype.concat(...files);
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

export function getPostSlugs() {
  // Get all markdown files in the posts directory and its subdirectories
  return getMarkdownFiles(postsDirectory);
}

// Helper function to create an error post
function createErrorPost(slug: string): Post {
  return {
    slug: slug,
    title: `Error loading: ${slug}`,
    date: new Date().toISOString(),
    content: '',
    excerpt: 'This post could not be loaded due to a formatting error.',
    coverImage: '/assets/blog/error/cover.jpg',
    topics: [],
    author: {
      name: 'System',
      picture: '/assets/blog/authors/system.jpeg'
    },
    ogImage: {
      url: '/assets/blog/error/cover.jpg'
    }
  } as Post;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    // Handle both direct slugs and path-based slugs
    const realSlug = slug.replace(/\.md$/, "");
    
    // Check if the slug contains a directory path
    if (realSlug.includes('/')) {
      // For paths like 'amas/ama-vitalik-buterin'
      const fullPath = join(postsDirectory, `${realSlug}.md`);
      
      if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        return null;
      }
      
      // Read the file contents
      const fileContents = fs.readFileSync(fullPath, "utf8");
      
      try {
        // Parse the frontmatter
        const { data, content } = matter(fileContents);
        
        // Extract the slug from the path (e.g., 'ama-vitalik-buterin' from 'amas/ama-vitalik-buterin')
        const slugParts = realSlug.split('/');
        const extractedSlug = slugParts[slugParts.length - 1];
        
        // Ensure topics is always an array
        if (!data.topics) {
          data.topics = [];
        } else if (!Array.isArray(data.topics)) {
          data.topics = [data.topics];
        }
        
        // Store the content path for later reference
        return { 
          ...data, 
          slug: extractedSlug, 
          content,
          _contentPath: realSlug 
        } as Post;
      } catch (error) {
        console.error(`Error processing ${realSlug}.md:`, error);
        // Make sure we have a valid slug for the error post
        const slugParts = realSlug.split('/');
        const extractedSlug = slugParts[slugParts.length - 1];
        return createErrorPost(extractedSlug);
      }
    } else {
      // For direct slugs like 'hello-world'
      const fullPath = join(postsDirectory, `${realSlug}.md`);
      
      // Check if file exists directly
      if (fs.existsSync(fullPath)) {
        // Read and process the file
        const fileContents = fs.readFileSync(fullPath, "utf8");
        
        try {
          const { data, content } = matter(fileContents);
          
          // Ensure topics is always an array
          if (!data.topics) {
            data.topics = [];
          } else if (!Array.isArray(data.topics)) {
            data.topics = [data.topics];
          }
          
          // Store the content path for later reference
          return { 
            ...data, 
            slug: realSlug, 
            content,
            _contentPath: realSlug 
          } as Post;
        } catch (error) {
          console.error(`Error processing ${realSlug}.md:`, error);
          return createErrorPost(realSlug);
        }
      } else {
        // Try to find in subdirectories
        const allSlugs = getPostSlugs();
        const matchingSlug = allSlugs.find(s => s.endsWith(`${realSlug}.md`));
        
        if (matchingSlug) {
          const fullPath = join(postsDirectory, matchingSlug);
          console.log(`Found matching file in subdirectory: ${fullPath}`);
          
          // Read and process the file
          const fileContents = fs.readFileSync(fullPath, "utf8");
          
          try {
            const { data, content } = matter(fileContents);
            
            // Ensure topics is always an array
            if (!data.topics) {
              data.topics = [];
            } else if (!Array.isArray(data.topics)) {
              data.topics = [data.topics];
            }
            
            // Store the content path for later reference
            return { 
              ...data, 
              slug: realSlug, 
              content,
              _contentPath: matchingSlug.replace(/\.md$/, "") 
            } as Post;
          } catch (error) {
            console.error(`Error processing ${matchingSlug}:`, error);
            return createErrorPost(realSlug);
          }
        } else {
          console.error(`File not found in any subdirectory: ${realSlug}`);
          return null;
        }
      }
    }
  } catch (error) {
    console.error(`Unexpected error in getPostBySlug for ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // Filter out any undefined or null posts (in case of errors)
    .filter((post): post is Post => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

// Function to get all AMA posts
export function getAMAPosts(): Post[] {
  const allPosts = getAllPosts();
  
  // Define a function to check if a post is an AMA based on its properties
  const isAmaPost = (post: Post): boolean => {
    // Check if the post has the 'ama' topic
    const hasAmaTopic = post.topics && post.topics.some(topic => 
      topic.toLowerCase().trim() === 'ama'
    );
    
    // Check if the post slug starts with 'ama-'
    const hasAmaSlug = post.slug.startsWith('ama-');
    
    // Check if the post is in the amas directory based on slug or file path
    // Avoid recursive lookups that cause file not found errors
    const inAmasDirectory = post.slug.includes('/amas/') || 
                          (typeof post._contentPath === 'string' && post._contentPath.includes('/amas/'));
    
    // Check if the file is directly in the amas directory by examining the file system path
    // This is a more direct approach than trying to load the file again
    const slugParts = post.slug.split('/');
    const isInAmasDir = slugParts.length > 1 && slugParts[0] === 'amas';
    
    return hasAmaTopic || hasAmaSlug || inAmasDirectory || isInAmasDir;
  };
  
  // Filter posts using our criteria
  return allPosts.filter(isAmaPost);
}

// Function to get all press releases
export function getPressReleases(): Post[] {
  const allPosts = getAllPosts();
  
  // Define a function to check if a post is a press release based on its properties
  const isPressRelease = (post: Post): boolean => {
    // Check if the post has the 'press-release' topic
    const hasPressReleaseTopic = post.topics && post.topics.some(topic => 
      topic.toLowerCase().trim() === 'press-release'
    );
    
    // Check if the post slug starts with 'pr-'
    const hasPrSlug = post.slug.startsWith('pr-');
    
    // Check if the post is in the press-releases directory based on slug or file path
    const inPressReleasesDirectory = post.slug.includes('/press-releases/') || 
                                   (typeof post._contentPath === 'string' && post._contentPath.includes('/press-releases/'));
    
    // Check if the file is directly in the press-releases directory
    const slugParts = post.slug.split('/');
    const isInPressReleasesDir = slugParts.length > 1 && slugParts[0] === 'press-releases';
    
    return hasPressReleaseTopic || hasPrSlug || inPressReleasesDirectory || isInPressReleasesDir;
  };
  
  // Filter posts using our criteria
  return allPosts.filter(isPressRelease);
}
