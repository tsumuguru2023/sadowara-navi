import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type PostCardProps = {
  post: {
    title: string;
    slug: { current: string };
    publishedAt: string;
    mainImage?: any;
    categories?: { _id: string; title: string; slug: { current: string } }[];
    author?: { name: string };
    excerpt?: string;
  };
  index?: number;
};

export default function PostCard({ post, index = 0 }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/posts/${post.slug.current}`}>
        <div
          className="overflow-hidden rounded-xl"
          style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
        >
          {post.mainImage && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={urlFor(post.mainImage).width(800).height(450).url()}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              {post.categories?.map((cat) => (
                <span
                  key={cat._id}
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: 'var(--color-accent-light)',
                    color: 'var(--color-accent)',
                  }}
                >
                  {cat.title}
                </span>
              ))}
              <time
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {date}
              </time>
            </div>
            <h2 className="text-lg font-bold leading-snug group-hover:opacity-70 transition-opacity">
              {post.title}
            </h2>
            {post.excerpt && (
              <p
                className="mt-2 text-sm line-clamp-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
