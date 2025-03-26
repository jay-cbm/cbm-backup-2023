import CoverImage from "@/app/_components/cover-image";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  slug,
}: Props) {
  return (
    <section className="mb-16">
      <Link href={`/posts/${slug}`} className="group block">
        <div className="relative rounded-xl overflow-hidden">
          <div className="aspect-[16/9] md:aspect-[21/9] transform group-hover:scale-105 transition-transform duration-300">
            <CoverImage title={title} src={coverImage} slug={slug} priority={true} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-red-600 text-white text-sm font-medium px-4 py-1.5 rounded-md">FEATURED</span>
                <span className="text-gray-200 text-sm">
                  <DateFormatter dateString={date} />
                </span>
              </div>
              <h3 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight group-hover:text-red-500 transition-colors">
                {title}
              </h3>
              <p className="text-gray-200 text-lg line-clamp-2 md:line-clamp-3 opacity-90 group-hover:opacity-100 transition-opacity">
                {excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
