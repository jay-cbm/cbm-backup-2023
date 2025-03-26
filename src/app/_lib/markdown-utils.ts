/**
 * Utilities for working with markdown content, especially from PagesCMS
 */

/**
 * Pre-processes markdown content from PagesCMS to ensure compatibility
 * with our markdown renderer
 */
export function processPagesCmsMarkdown(content: string): string {
  if (!content) return '';
  
  // Convert PagesCMS shortcodes to proper markdown or HTML as needed
  let processedContent = content;
  
  // Handle image shortcodes with captions
  // Example: {{image src="/images/example.jpg" caption="This is a caption"}}
  processedContent = processedContent.replace(
    /{{image\s+src="([^"]+)"\s+caption="([^"]+)"[^}]*}}/g,
    '<figure>\n<img src="$1" alt="$2" />\n<figcaption>$2</figcaption>\n</figure>'
  );
  
  // Handle standard image shortcodes without captions
  processedContent = processedContent.replace(
    /{{image\s+src="([^"]+)"[^}]*}}/g,
    '![]($1)'
  );
  
  // Handle embedded content shortcodes (like YouTube, Twitter, etc.)
  processedContent = processedContent.replace(
    /{{embed\s+url="([^"]+)"[^}]*}}/g,
    '<div class="embed-container">\n<iframe src="$1" frameborder="0" allowfullscreen></iframe>\n</div>'
  );
  
  // Handle code blocks with language specification
  // This ensures proper syntax highlighting
  processedContent = processedContent.replace(
    /{{code\s+language="([^"]+)"[^}]*}}([\s\S]*?){{\/code}}/g,
    '```$1\n$2\n```'
  );
  
  // Handle callouts/notices with different types
  // Example: {{notice type="info"}} Content {{/notice}}
  const noticeTypes = {
    info: 'info-notice',
    warning: 'warning-notice',
    error: 'error-notice',
    success: 'success-notice',
    tip: 'tip-notice'
  };
  
  Object.entries(noticeTypes).forEach(([type, className]) => {
    const regex = new RegExp(`{{notice\\s+type="${type}"[^}]*}}([\\s\\S]*?){{/notice}}`, 'g');
    processedContent = processedContent.replace(
      regex,
      `<div class="${className}">\n$1\n</div>`
    );
  });
  
  // Add more processors as needed for other PagesCMS shortcodes or special formatting
  
  return processedContent;
}

/**
 * Extracts and processes frontmatter metadata from markdown content
 * Returns an object with the extracted frontmatter and the content without frontmatter
 */
export function extractFrontmatter(markdown: string): { 
  frontmatter: Record<string, any>; 
  content: string;
} {
  // Default return value
  const defaultResult = {
    frontmatter: {},
    content: markdown || ''
  };
  
  if (!markdown) return defaultResult;
  
  // Check if the content has frontmatter (starts with ---)
  if (!markdown.startsWith('---')) return defaultResult;
  
  // Find the end of the frontmatter section
  const endOfFrontmatter = markdown.indexOf('---', 3);
  if (endOfFrontmatter === -1) return defaultResult;
  
  // Extract the frontmatter section
  const frontmatterText = markdown.substring(3, endOfFrontmatter).trim();
  
  // Extract the content without frontmatter
  const content = markdown.substring(endOfFrontmatter + 3).trim();
  
  // Parse the frontmatter into an object
  const frontmatter: Record<string, any> = {};
  
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Handle quoted values
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      
      // Handle arrays (comma-separated values in square brackets)
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayValue = value.substring(1, value.length - 1)
          .split(',')
          .map(v => v.trim());
        frontmatter[key] = arrayValue;
      } else {
        // Only assign the regular value if it's not an array
        frontmatter[key] = value;
      }
    }
  });
  
  return { frontmatter, content };
}
