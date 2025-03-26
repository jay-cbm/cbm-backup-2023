import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAMAPosts, getPostBySlug } from "../../../lib/api";
import { getContentBySlug, getAMAContent } from "../../../lib/content-api";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "../../../lib/constants";
import { Post } from "../../../interfaces/post";
// Remove markdownToHtml import as we'll use the PostBody's built-in processing
// import markdownToHtml from "../../../lib/markdownToHtml";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";

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

  // Default OG image from constants if post.ogImage is undefined
  const ogImageUrl = post.ogImage?.url || HOME_OG_IMAGE_URL;

  return {
    title: `${post.title} | AMA | ${CMS_NAME}`,
    description: post.excerpt || '',
    openGraph: {
      title: `${post.title} | AMA | ${CMS_NAME}`,
      description: post.excerpt || '',
      images: [ogImageUrl],
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
