import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { TopicSection } from "@/app/_components/topic-section";
import DateFormatter from "@/app/_components/date-formatter";
import { getAllPosts } from "../lib/api";
import { getPostsByTopic, getFeaturedPosts } from "../lib/pages-cms";
import { BLOCKCHAIN_TOPICS, SUBTOPICS } from "../lib/client-utils";
import Link from "next/link";
import Image from "next/image";

export default async function Index() {
  // Get all posts for the hero post
  const allPosts = getAllPosts();
  const heroPost = allPosts[0];
  
  // Get posts for each topic section using the PagesCMS service
  // These could be parallel requests to the CMS API in a real implementation
  const [bitcoinPosts, ethereumPosts, solanaPosts, newsPosts, latestPosts] = await Promise.all([
    getPostsByTopic('bitcoin', 3),
    getPostsByTopic('ethereum', 3),
    getPostsByTopic('solana', 3),
    getPostsByTopic('news', 3),
    getFeaturedPosts(4)
  ]);

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          excerpt={heroPost.excerpt}
          slug={heroPost.slug}
        />
        
        {/* Latest News Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Latest News
            </h2>
            <a href="/" className="text-red-600 hover:underline text-sm font-medium">
              See all →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts.map((post) => (
              <div key={post.slug} className="group">
                <div className="mb-5 overflow-hidden rounded-lg">
                  <Link href={`/posts/${post.slug}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={post.coverImage} 
                        alt={`Cover Image for ${post.title}`}
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        fill
                      />
                    </div>
                  </Link>
                </div>
                <div className="flex items-center mb-2 text-sm">
                  {post.author && (
                    <span className="font-semibold mr-2">{post.author.name}</span>
                  )}
                  <span className="text-gray-500">
                    • <DateFormatter dateString={post.date} />
                  </span>
                </div>
                <h3 className="text-xl font-bold leading-tight mb-2 h-14 overflow-hidden">
                  <Link href={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 h-10 overflow-hidden">{post.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Topic Sections */}
        <TopicSection title="Bitcoin" posts={bitcoinPosts} layout="three-column" topicSlug="bitcoin" />
        <TopicSection title="Ethereum" posts={ethereumPosts} layout="three-column" topicSlug="ethereum" />
        <TopicSection title="Solana" posts={solanaPosts} layout="three-column" topicSlug="solana" />
        <TopicSection title="News" posts={newsPosts} layout="three-column" topicSlug="news" />
      </Container>
    </main>
  );
}
