import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAMAPosts, getPostBySlug } from "../../../lib/api";
import { getContentBySlug, getAMAContent } from "../../../lib/content-api";
import { CMS_NAME, HOME_OG_IMAGE_URL, SITE_URL, SITE_DESCRIPTION } from "../../../lib/constants";
import { Post } from "../../../interfaces/post";
// Remove markdownToHtml import as we'll use the PostBody's built-in processing
// import markdownToHtml from "../../../lib/markdownToHtml";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";
import Script from "next/script";

export default async function AMAPost({ params }: Params) {
  // First try to get the post with the amas/ prefix using both APIs
  let post = getPostBySlug(`amas/${params.slug}`);
  
  // If not found, try using the content API
  if (!post) {
    post = getContentBySlug(`amas/${params.slug}`);
  }
  
  // If still not found, try to get the post directly by slug using both APIs
  if (!post) {
    post = getPostBySlug(params.slug);
    
    if (!post) {
      post = getContentBySlug(params.slug);
    }
  }

  // If still not found, return 404
  if (!post) {
    console.error(`AMA post not found: ${params.slug}`);
    return notFound();
  }

  // Use the raw markdown content instead of pre-processed HTML
  // This allows PostBody to handle the processing with PagesCMS features
  const content = post.content || "";
  
  // Extract the person's name from the title (assuming format "AMA with Person Name")
  const personName = post.title.includes('with ') ? 
    post.title.split('with ')[1] : 
    post.title.replace('AMA: ', '').replace('AMA - ', '');
  
  // Prepare interview schema data
  const interviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'InterviewObject',
    headline: post.title,
    description: post.excerpt || '',
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'CryptoBitMag',
      url: post.author?.picture ? `${SITE_URL}/authors/${post.author.name.toLowerCase().replace(/\s+/g, '-')}` : undefined
    },
    interviewee: {
      '@type': 'Person',
      name: personName
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
      '@id': `${SITE_URL}/amas/${params.slug}`
    }
  };

  return (
    <main>
      <Container>
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody 
            content={content} 
            contentType="ama" 
            allowHtml={true}
          />
          
          {/* Interview Schema JSON-LD */}
          <Script id="interview-schema" type="application/ld+json">
            {JSON.stringify(interviewSchema)}
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
                  'name': 'AMAs',
                  'item': `${SITE_URL}/amas`
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': post.title,
                  'item': `${SITE_URL}/amas/${params.slug}`
                }
              ]
            })}
          </Script>
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  // First try to get the post with the amas/ prefix using both APIs
  let post = getPostBySlug(`amas/${params.slug}`);
  
  // If not found, try using the content API
  if (!post) {
    post = getContentBySlug(`amas/${params.slug}`);
  }
  
  // If still not found, try to get the post directly by slug using both APIs
  if (!post) {
    post = getPostBySlug(params.slug);
    
    if (!post) {
      post = getContentBySlug(params.slug);
    }
  }

  // If still not found, return 404
  if (!post) {
    return notFound();
  }
  
  // Extract the person's name from the title (assuming format "AMA with Person Name")
  const personName = post.title.includes('with ') ? 
    post.title.split('with ')[1] : 
    post.title.replace('AMA: ', '').replace('AMA - ', '');

  // Default OG image from constants if post.ogImage is undefined
  const ogImageUrl = post.ogImage?.url || post.coverImage || HOME_OG_IMAGE_URL;
  
  // Create a descriptive title
  const title = `${post.title} | Ask Me Anything`;
  
  // Create a more specific description if one doesn't exist
  const description = post.excerpt || 
    `Read our exclusive AMA interview with ${personName} discussing cryptocurrency, blockchain technology, and the future of digital assets.`;
  
  // Extract topics for keywords if available
  const keywords = post.topics ? 
    ['cryptocurrency', 'blockchain', 'ama', 'interview', ...post.topics, personName.toLowerCase()] : 
    ['cryptocurrency', 'blockchain', 'ama', 'interview', personName.toLowerCase()];

  // Determine publish and modified dates
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = publishDate; // Use same date if no modified date available

  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author?.name || CMS_NAME }],
    publisher: CMS_NAME,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/amas/${params.slug}`,
      type: 'article',
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
      authors: post.author?.name || CMS_NAME,
      tags: post.topics ? [...post.topics, 'AMA', 'Interview'] : ['AMA', 'Interview'],
      images: [ogImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/amas/${params.slug}`,
    },
  };
}

export async function generateStaticParams() {
  // Get AMA posts from both APIs
  const apiPosts = getAMAPosts();
  const contentApiPosts = getAMAContent();
  
  // Combine posts from both APIs, ensuring no duplicates by slug
  const slugSet = new Set();
  const allPosts = [...apiPosts];
  
  // Add posts from content API if they don't already exist
  contentApiPosts.forEach((post: Post) => {
    if (!slugSet.has(post.slug)) {
      allPosts.push(post);
      slugSet.add(post.slug);
    }
  });

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}
