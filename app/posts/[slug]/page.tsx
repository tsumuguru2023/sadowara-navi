import { client } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableTextRenderer from "@/app/components/PortableTextRenderer";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  if (!post) notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="pb-32">
      {/* Hero */}
      <header className="max-w-[1100px] mx-auto px-6 md:px-10 pt-12 md:pt-20">
        <Link href="/" className="eyebrow link-underline">
          ← Back to Journal
        </Link>

        <div className="mt-12 md:mt-20 max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            {post.categories?.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug.current}`}
                className="eyebrow text-accent link-underline"
              >
                {cat.title}
              </Link>
            ))}
            <span className="rule-vertical" />
            <time className="font-mono text-xs text-mute">{date}</time>
          </div>

          <h1 className="animate-fade-in font-display font-bold text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.025em]">
            {post.title}
          </h1>

          {post.author && (
            <div
              className="animate-fade-in flex items-center gap-3 mt-10"
              style={{ animationDelay: "0.1s" }}
            >
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(80).height(80).url()}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="eyebrow">Words by</p>
                <p className="font-display text-base font-bold mt-0.5">
                  {post.author.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cover */}
      {post.mainImage && (
        <div
          className="animate-fade-in max-w-[1280px] mx-auto px-6 md:px-10 mt-14 md:mt-20"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-paper">
            <Image
              src={urlFor(post.mainImage).width(1600).height(900).url()}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div
        className="animate-fade-in max-w-[680px] mx-auto px-6 md:px-0 mt-16 md:mt-24 prose"
        style={{ animationDelay: "0.2s" }}
      >
        {post.body && <PortableTextRenderer value={post.body} />}
      </div>

      {/* Footer nav */}
      <div className="max-w-[680px] mx-auto px-6 md:px-0 mt-24 pt-10 border-t border-line flex items-center justify-between">
        <Link href="/" className="eyebrow link-underline">
          ← Back to Journal
        </Link>
        <Link href="/categories" className="eyebrow link-underline text-accent">
          Browse Topics →
        </Link>
      </div>
    </article>
  );
}
