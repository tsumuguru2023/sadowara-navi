import { client } from "@/sanity/lib/client";
import { categoryBySlugQuery, postsByCategoryQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostCard from "@/app/components/PostCard";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await client.fetch(categoryBySlugQuery, { slug });
  if (!category) notFound();

  const posts = await client.fetch(postsByCategoryQuery, { categoryId: category._id });

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-32">
      <section className="pt-12 md:pt-20 pb-12 md:pb-16 border-b border-line">
        <Link href="/categories" className="eyebrow link-underline">
          ← All topics
        </Link>

        <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="eyebrow text-accent">Topic</span>
            <h1 className="mt-4 font-display font-bold text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-[-0.025em]">
              {category.title}
            </h1>
            {category.description && (
              <p className="mt-6 text-base md:text-lg text-mute max-w-xl leading-[1.95]">
                {category.description}
              </p>
            )}
          </div>
          <div className="md:col-span-4 md:text-right">
            <span className="font-mono text-xs text-mute">
              {String(posts.length).padStart(2, "0")} entries
            </span>
          </div>
        </div>
      </section>

      {posts.length > 0 ? (
        <div className="mt-4">
          {posts.map((post: any, i: number) => (
            <PostCard key={post._id} post={post} index={i} variant="list" />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-mute">このカテゴリにはまだ記事がありません。</p>
      )}
    </div>
  );
}
