import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/api";
import { getContentBySlug } from "../../../lib/content-api";
import { CMS_NAME, HOME_OG_IMAGE_URL, SITE_URL, SITE_DESCRIPTION } from "../../../lib/constants";
// Remove markdownToHtml import as we'll use the PostBody's built-in processing
// import markdownToHtml from "../../../lib/markdownToHtml";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";
import Script from "next/script";

export default async function Post({ params }: Params) {
  // First try to get post from the local API
  let post = getPostBySlug(params.slug);
  
  // If not found, try using the content API (PagesCMS)
  if (!post) {
    post = getContentBySlug(params.slug);
  }

  if (!post) {
    return notFound();
  }

  // Use the raw markdown content instead of pre-processed HTML
  // This allows PostBody to handle the processing with PagesCMS features
  const content = post.content || "";
  
  // Prepare article schema data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
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
      '@id': `${SITE_URL}/posts/${params.slug}`
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
            contentType="post" 
            allowHtml={true}
          />
          
          {/* Article Schema JSON-LD */}
          <Script id="article-schema" type="application/ld+json">
            {JSON.stringify(articleSchema)}
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
                  'name': 'Posts',
                  'item': `${SITE_URL}/posts`
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': post.title,
                  'item': `${SITE_URL}/posts/${params.slug}`
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
  // First try to get post from the local API
  let post = getPostBySlug(params.slug);
  
  // If not found, try using the content API (PagesCMS)
  if (!post) {
    post = getContentBySlug(params.slug);
  }

  if (!post) {
    return notFound();
  }

  const title = post.title;

  // Default OG image from constants if post.ogImage is undefined
  const ogImageUrl = post.ogImage?.url || post.coverImage || HOME_OG_IMAGE_URL;
  
  // Extract topics for keywords if available
  const keywords = post.topics ? 
    ['cryptocurrency', 'blockchain', ...post.topics] : 
    ['cryptocurrency', 'blockchain', 'crypto news'];

  // Determine publish and modified dates
  const publishDate = new Date(post.date).toISOString();
  const modifiedDate = publishDate; // Use same date if no modified date available

  return {
    title,
    description: post.excerpt || SITE_DESCRIPTION,
    keywords,
    authors: [{ name: post.author?.name || CMS_NAME }],
    publisher: CMS_NAME,
    openGraph: {
      title,
      description: post.excerpt || SITE_DESCRIPTION,
      url: `${SITE_URL}/posts/${params.slug}`,
      type: 'article',
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
      authors: post.author?.name || CMS_NAME,
      tags: post.topics,
      images: [ogImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.excerpt || SITE_DESCRIPTION,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/posts/${params.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
