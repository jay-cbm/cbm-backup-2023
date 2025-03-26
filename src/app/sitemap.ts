import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/api';
import { getAllContent, getAMAContent, getPressReleaseContent } from '@/lib/content-api';
import { SITE_URL } from '@/lib/constants';
import { Post } from '@/interfaces/post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all content from both local files and PagesCMS
  const posts = getAllPosts();
  const amas = getAMAContent();
  const pressReleases = getPressReleaseContent();
  
  // Create sitemap entries for static routes
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/amas`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/press-releases`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];
  
  // Create sitemap entries for blog posts
  const postRoutes = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  // Create sitemap entries for AMAs
  const amaRoutes = amas.map((ama: Post) => ({
    url: `${SITE_URL}/amas/${ama.slug}`,
    lastModified: new Date(ama.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  // Create sitemap entries for press releases
  const prRoutes = pressReleases.map((pr: Post) => ({
    url: `${SITE_URL}/press-releases/${pr.slug}`,
    lastModified: new Date(pr.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));
  
  // Combine all routes
  return [...staticRoutes, ...postRoutes, ...amaRoutes, ...prRoutes];
}
