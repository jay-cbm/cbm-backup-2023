// This module should ONLY be imported in Server Components
// It uses Node.js APIs that are not available in the browser

import { Post } from "../interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// Support both old and new directory structures
const oldPostsDirectory = join(process.cwd(), "_posts");
const newContentDirectory = join(process.cwd(), "content");

// Check if new content directory exists
const useNewContentStructure = fs.existsSync(newContentDirectory);

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

// Get all post slugs for static generation
export function getAllContentSlugs() {
  // Get files from both old and new directory structures
  const oldFiles = fs.existsSync(oldPostsDirectory) ? getMarkdownFiles(oldPostsDirectory) : [];
  const newFiles = useNewContentStructure ? getMarkdownFiles(newContentDirectory) : [];
  
  // Combine files from both directories
  return [...oldFiles, ...newFiles];
}

// Get a post by its slug (handles both direct and path-based slugs)
export function getContentBySlug(slug: string): Post | null {
  try {
    // Handle both direct slugs and path-based slugs
    const realSlug = slug.replace(/\.md$/, "");
    
    // Check if the slug contains a directory path
    if (realSlug.includes('/')) {
      // For paths like 'amas/ama-vitalik-buterin'
      const oldPath = join(oldPostsDirectory, `${realSlug}.md`);
      const newPath = useNewContentStructure ? join(newContentDirectory, `${realSlug}.md`) : '';
      
      let fullPath = '';
      
      // Try old directory structure first
      if (fs.existsSync(oldPath)) {
        fullPath = oldPath;
      }
      // Then try new directory structure
      else if (useNewContentStructure && fs.existsSync(newPath)) {
        fullPath = newPath;
      }
      else {
        console.error(`File not found: ${oldPath}`);
        if (useNewContentStructure) {
          console.error(`Also checked: ${newPath}`);
        }
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
      const oldPath = join(oldPostsDirectory, `${realSlug}.md`);
      const newPath = useNewContentStructure ? join(newContentDirectory, `${realSlug}.md`) : '';
      
      let fullPath = '';
      
      // Try old directory structure first
      if (fs.existsSync(oldPath)) {
        fullPath = oldPath;
      }
      // Then try new directory structure
      else if (useNewContentStructure && fs.existsSync(newPath)) {
        fullPath = newPath;
      } else {
        // If not found in either location, default to old path for error reporting
        fullPath = oldPath;
      }
      
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
          
          return { ...data, slug: realSlug, content } as Post;
        } catch (error) {
          console.error(`Error processing ${realSlug}.md:`, error);
          return createErrorPost(realSlug);
        }
      } else {
        // Try to find in subdirectories
        const allSlugs = getAllContentSlugs();
        const matchingSlug = allSlugs.find(s => s.endsWith(`${realSlug}.md`));
        
        if (matchingSlug) {
          // Try both directory structures
          const oldPath = join(oldPostsDirectory, matchingSlug);
          const newPath = useNewContentStructure ? join(newContentDirectory, matchingSlug) : '';
          
          let fullPath = '';
          
          // Try old directory structure first
          if (fs.existsSync(oldPath)) {
            fullPath = oldPath;
          }
          // Then try new directory structure
          else if (useNewContentStructure && fs.existsSync(newPath)) {
            fullPath = newPath;
          } else {
            // If not found in either location, default to old path for error reporting
            fullPath = oldPath;
          }
          
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
            
            return { ...data, slug: realSlug, content } as Post;
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
    console.error(`Unexpected error in getContentBySlug for ${slug}:`, error);
    return null;
  }
}

// Get all posts with sorting and filtering
export function getAllContent(): Post[] {
  const slugs = getAllContentSlugs();
  const posts = slugs
    .map((slug) => getContentBySlug(slug))
    // Filter out any undefined or null posts (in case of errors)
    .filter((post): post is Post => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

// Get all AMA content
export function getAMAContent(): Post[] {
  // Get all posts first
  const allPosts = getAllContent();
  
  // Define a function to check if a post is an AMA based on its properties
  const isAmaPost = (post: Post): boolean => {
    // Check if the post has the 'ama' topic
    const hasAmaTopic = post.topics && post.topics.some(topic => 
      topic.toLowerCase().trim() === 'ama'
    );
    
    // Check if the post slug starts with 'ama-'
    const hasAmaSlug = post.slug.startsWith('ama-');
    
    // Check if the post is in the amas directory based on metadata or known path patterns
    // This avoids recursive lookups that cause the file not found errors
    const inAmasDirectory = post.slug.includes('/amas/') || 
                           (typeof post._contentPath === 'string' && post._contentPath.includes('/amas/'));
    
    return hasAmaTopic || hasAmaSlug || inAmasDirectory;
  };
  
  // Filter posts using our criteria
  return allPosts.filter(isAmaPost);
}

// Get all press release content
export function getPressReleaseContent(): Post[] {
  // Get all posts first
  const allPosts = getAllContent();
  
  // Define a function to check if a post is a press release based on its properties
  const isPressRelease = (post: Post): boolean => {
    // Check if the post has the 'press-release' topic
    const hasPressReleaseTopic = post.topics && post.topics.some(topic => 
      topic.toLowerCase().trim() === 'press-release'
    );
    
    // Check if the post slug starts with 'pr-'
    const hasPrSlug = post.slug.startsWith('pr-');
    
    // Check if the post is in the press-releases directory based on metadata or known path patterns
    const inPressReleasesDirectory = post.slug.includes('/press-releases/') || 
                                   (typeof post._contentPath === 'string' && post._contentPath.includes('/press-releases/'));
    
    return hasPressReleaseTopic || hasPrSlug || inPressReleasesDirectory;
  };
  
  // Filter posts using our criteria
  return allPosts.filter(isPressRelease);
}
