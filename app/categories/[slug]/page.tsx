import { client } from "@/sanity/lib/client";
import { categoryBySlugQuery, postsByCategoryQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostCard from "@/app/components/PostCard";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await client.fetch(categoryBySlugQuery, { slug });

  if (!category) {
    notFound();
  }

  const posts = await client.fetch(postsByCategoryQuery, {
    categoryId: category._id,
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm mb-8 hover:opacity-60 transition-opacity"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ← カテゴリ一覧に戻る
      </Link>

      <h1
        className="text-3xl md:text-4xl font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {category.title}
      </h1>
      {category.description && (
        <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
          {category.description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {posts.length > 0 ? (
          posts.map((post: any, index: number) => (
            <PostCard key={post._id} post={post} index={index} />
          ))
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>
            このカテゴリにはまだ記事がありません。
          </p>
        )}
      </div>
    </div>
  );
}
