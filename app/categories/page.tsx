import { client } from "@/sanity/lib/client";
import { categoriesQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await client.fetch(categoriesQuery);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <h1
        className="text-3xl md:text-4xl font-bold tracking-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        カテゴリ
      </h1>
      <p className="mt-3" style={{ color: 'var(--color-text-muted)' }}>
        興味のあるカテゴリから記事を探す
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
        {categories.length > 0 ? (
          categories.map((cat: any, index: number) => (
            <Link
              key={cat._id}
              href={`/categories/${cat.slug.current}`}
              className="group block p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <h2 className="text-lg font-bold group-hover:opacity-70 transition-opacity">
                {cat.title}
              </h2>
              {cat.description && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {cat.description}
                </p>
              )}
            </Link>
          ))
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>
            カテゴリがまだありません。
          </p>
        )}
      </div>
    </div>
  );
}
