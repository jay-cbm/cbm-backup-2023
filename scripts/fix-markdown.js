const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory containing markdown files
const postsDirectory = path.join(process.cwd(), '_posts');

// Get all markdown files
const markdownFiles = fs.readdirSync(postsDirectory)
  .filter(file => file.endsWith('.md'));

console.log(`Found ${markdownFiles.length} markdown files to process`);

// Process each file
markdownFiles.forEach(filename => {
  const filePath = path.join(postsDirectory, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  try {
    // Parse the frontmatter
    const { data, content } = matter(fileContent);
    
    // Ensure topics is an array
    if (!data.topics) {
      data.topics = [];
    } else if (!Array.isArray(data.topics)) {
      data.topics = [data.topics];
    }
    
    // Rebuild the frontmatter with consistent formatting
    const newFrontmatter = [
      '---',
      `title: "${data.title}"`,
      `excerpt: "${data.excerpt}"`,
      `coverImage: "${data.coverImage}"`,
      `date: "${data.date}"`,
      `topics: [${data.topics.map(t => `"${t}"`).join(', ')}]`,
      'author:',
      `  name: "${data.author.name}"`,
      `  picture: "${data.author.picture}"`,
      'ogImage:',
      `  url: "${data.ogImage.url}"`,
      '---'
    ].join('\n');
    
    // Write the new file content
    const newContent = `${newFrontmatter}\n\n${content}`;
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ Fixed: ${filename}`);
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
});

console.log('Markdown file processing complete!');
