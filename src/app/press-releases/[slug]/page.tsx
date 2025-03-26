import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPressReleases } from '@/lib/api';
import { getPressReleaseContent } from '@/lib/content-api';
import { Post } from '@/interfaces/post';
import { PostBody } from '@/app/_components/post-body';
import Container from '@/app/_components/container';
import { PostHeader } from '@/app/_components/post-header';
import { PostTitle } from '@/app/_components/post-title';
import { CMS_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';
import Script from 'next/script';

interface Params {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const apiPosts = await getPressReleases();
  const contentApiPosts = await getPressReleaseContent();
  
  // Find the post in either API response
  const post = [...apiPosts, ...contentApiPosts].find((post) => post.slug === slug);
  
  if (!post) {
    return {
      title: 'Not Found'
    };
  }
  
  // Determine publish and modified dates
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = publishDate; // Use same date if no modified date available
  
  // Extract company name from title if possible
  const companyMatch = post.title.match(/([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*?)(?::|\s+Announces|\s+Launches|\s+Partners)/i);
  const companyName = companyMatch ? companyMatch[1].trim() : 'Cryptocurrency Company';
  
  // Extract topics for keywords
  const keywords = post.topics ? 
    ['press release', 'announcement', 'crypto news', ...post.topics] : 
    ['press release', 'announcement', 'crypto news', 'blockchain'];
  
  // Enhanced title and description
  const title = `${post.title} | Official Press Release`;
  const description = post.excerpt || `Official press release from ${companyName} - Read the full announcement on CryptoBitMag.`;
  
  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author?.name || companyName }],
    publisher: CMS_NAME,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/press-releases/${post.slug}`,
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
      authors: post.author?.name || companyName,
      tags: post.topics || ['press release', 'announcement', 'crypto news'],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage],
    },
    alternates: {
      canonical: `${SITE_URL}/press-releases/${post.slug}`,
    },
  };
}

export default async function PressReleasePage({ params }: Params) {
  const { slug } = params;
  const apiPosts = await getPressReleases();
  const contentApiPosts = await getPressReleaseContent();
  
  // Find the post in either API response
  const post = [...apiPosts, ...contentApiPosts].find((post) => post.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  // Extract company name from title if possible
  const companyMatch = post.title.match(/([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*?)(?::|\s+Announces|\s+Launches|\s+Partners)/i);
  const companyName = companyMatch ? companyMatch[1].trim() : 'Cryptocurrency Company';
  
  // Prepare press release schema data
  const pressReleaseSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt || '',
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: companyName,
    },
    publisher: {
      '@type': 'Organization',
      name: CMS_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon/android-chrome-512x512.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/press-releases/${post.slug}`
    },
    about: {
      '@type': 'Organization',
      name: companyName
    },
    isAccessibleForFree: 'True',
    articleSection: 'Press Release'
  };
  
  return (
    <Container>
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody 
          content={post.content}
          contentType="press-release"
          allowHtml={true}
        />
        
        {/* Press Release Schema JSON-LD */}
        <Script id="press-release-schema" type="application/ld+json">
          {JSON.stringify(pressReleaseSchema)}
        </Script>
        
        {/* BreadcrumbList Schema */}
        <Script id="breadcrumb-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': SITE_URL
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Press Releases',
                'item': `${SITE_URL}/press-releases`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': post.title,
                'item': `${SITE_URL}/press-releases/${post.slug}`
              }
            ]
          })}
        </Script>
      </article>
    </Container>
  );
}
