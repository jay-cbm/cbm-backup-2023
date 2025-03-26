import { Post } from "@/interfaces/post";
import Link from "next/link";
import Image from "next/image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  posts: Post[];
  layout?: "two-column" | "three-column";
  topicSlug?: string; // Optional topic slug for the "See All" link
};

export function TopicSection({ title, posts, layout = "two-column", topicSlug }: Props) {
  // Skip rendering if no title (used for nested components)
  if (title === "") {
    // For single post display in grid
    const post = posts[0];
    return (
      <div className="group">
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
    );
  }

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          {title}
        </h2>
        <Link 
          href={topicSlug ? `/posts?topics=${topicSlug}` : '/posts'} 
          className="text-red-600 hover:underline text-sm font-medium"
        >
          See all →
        </Link>
      </div>
      <div className={`grid grid-cols-1 ${layout === "three-column" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-8`}>
        {posts.slice(0, layout === "three-column" ? 3 : 2).map((post) => (
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
  );
}
