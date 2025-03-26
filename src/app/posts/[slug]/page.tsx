import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../../../lib/api";
import { getContentBySlug } from "../../../lib/content-api";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "../../../lib/constants";
// Remove markdownToHtml import as we'll use the PostBody's built-in processing
// import markdownToHtml from "../../../lib/markdownToHtml";
import Container from "../../_components/container";
import Header from "../../_components/header";
import { PostBody } from "../../_components/post-body";
import { PostHeader } from "../../_components/post-header";

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

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  // Default OG image from constants if post.ogImage is undefined
  const ogImageUrl = post.ogImage?.url || HOME_OG_IMAGE_URL;

  return {
    title,
    description: post.excerpt || '',
    openGraph: {
      title,
      description: post.excerpt || '',
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
