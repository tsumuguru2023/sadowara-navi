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
  featured?: boolean;
  variant?: "grid" | "list";
};

export default function PostCard({
  post,
  index = 0,
  featured = false,
  variant = "grid",
}: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const number = String(index + 1).padStart(2, "0");

  if (featured) {
    return (
      <article
        className="animate-fade-in group grid md:grid-cols-12 gap-8 md:gap-12 items-center"
        style={{ animationDelay: `${index * 0.06}s` }}
      >
        <Link
          href={`/posts/${post.slug.current}`}
          className="md:col-span-7 block relative overflow-hidden bg-paper aspect-[4/3] md:aspect-[5/4]"
        >
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(1400).height(1120).url()}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-soft to-line" />
          )}
          <span className="absolute top-5 left-5 eyebrow bg-paper/90 px-3 py-1.5">
            Featured
          </span>
        </Link>

        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-xs text-accent">{number}</span>
            <span className="rule-vertical" />
            {post.categories?.[0] && (
              <span className="eyebrow text-accent">
                {post.categories[0].title}
              </span>
            )}
          </div>

          <Link href={`/posts/${post.slug.current}`}>
            <h2 className="font-display text-3xl md:text-[2.6rem] font-bold leading-[1.15] tracking-tight text-ink transition-colors group-hover:text-accent">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="mt-5 text-[0.95rem] text-mute leading-[1.95] line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4 text-xs text-mute font-mono">
            <time>{date}</time>
            {post.author && (
              <>
                <span className="rule-vertical" />
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "list") {
    return (
      <article
        className="animate-fade-in group border-t border-line py-8 md:py-10"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <Link href={`/posts/${post.slug.current}`} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-3 md:gap-2">
            <span className="font-mono text-xs text-accent">{number}</span>
            <time className="font-mono text-xs text-mute">{date}</time>
          </div>
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              {post.categories?.[0] && (
                <span className="eyebrow text-accent">{post.categories[0].title}</span>
              )}
            </div>
            <h2 className="font-display text-2xl md:text-[1.7rem] font-bold leading-tight tracking-tight transition-colors group-hover:text-accent">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-sm text-mute leading-[1.95] line-clamp-2">{post.excerpt}</p>
            )}
          </div>
          <div className="md:col-span-3 relative aspect-[4/3] overflow-hidden bg-paper">
            {post.mainImage ? (
              <Image
                src={urlFor(post.mainImage).width(600).height(450).url()}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-accent-soft to-line" />
            )}
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className="animate-fade-in group"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <Link href={`/posts/${post.slug.current}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-paper mb-6">
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage).width(900).height(675).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-soft to-line" />
          )}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-accent">{number}</span>
          <span className="rule-vertical" />
          {post.categories?.[0] && (
            <span className="eyebrow text-accent">{post.categories[0].title}</span>
          )}
        </div>

        <h2 className="font-display text-xl md:text-[1.55rem] font-bold leading-[1.3] tracking-tight transition-colors group-hover:text-accent">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-3 text-sm text-mute leading-[1.9] line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 text-xs text-mute font-mono">
          <time>{date}</time>
          {post.author && (
            <>
              <span className="rule-vertical" />
              <span>{post.author.name}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  );
}
