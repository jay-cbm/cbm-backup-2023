import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPressReleases } from '@/lib/api';
import { getPressReleaseContent } from '@/lib/content-api';
import { Post } from '@/interfaces/post';
import { PostBody } from '@/app/_components/post-body';
import Container from '@/app/_components/container';
import { PostHeader } from '@/app/_components/post-header';
import { PostTitle } from '@/app/_components/post-title';

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
  
  return {
    title: `${post.title} | CryptoBitMag Press Releases`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/press-releases/${post.slug}`,
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
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
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
      </article>
    </Container>
  );
}
