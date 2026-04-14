import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableTextRenderer from "@/app/components/PortableTextRenderer";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) {
    notFound();
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-60 transition-opacity"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ← 記事一覧に戻る
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        {post.categories?.map((cat: any) => (
          <Link
            key={cat._id}
            href={`/categories/${cat.slug.current}`}
            className="text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
            style={{
              background: 'var(--color-accent-light)',
              color: 'var(--color-accent)',
            }}
          >
            {cat.title}
          </Link>
        ))}
        <time className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {date}
        </time>
      </div>

      {/* Title */}
      <h1
        className="text-3xl md:text-4xl font-bold leading-tight tracking-tight animate-fade-in-up"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {post.title}
      </h1>

      {/* Author */}
      {post.author && (
        <div className="flex items-center gap-3 mt-6 mb-8">
          {post.author.image && (
            <Image
              src={urlFor(post.author.image).width(40).height(40).url()}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <span className="text-sm font-medium">{post.author.name}</span>
        </div>
      )}

      {/* Main Image */}
      {post.mainImage && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl my-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Body */}
      <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {post.body && <PortableTextRenderer value={post.body} />}
      </div>

      {/* Bottom nav */}
      <div
        className="mt-16 pt-8"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm hover:opacity-60 transition-opacity"
          style={{ color: 'var(--color-accent)' }}
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </article>
  );
}
