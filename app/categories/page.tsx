import { client } from "@/sanity/lib/client";
import { categoriesQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await client.fetch(categoriesQuery);

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 pb-32">
      <section className="pt-16 md:pt-24 pb-16 md:pb-24 border-b border-line">
        <span className="eyebrow">— Index</span>
        <h1 className="mt-6 font-display font-black text-[clamp(2.5rem,8vw,6rem)] leading-[1] tracking-[-0.03em]">
          Topics<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-mute leading-[1.95]">
          興味のあるカテゴリから、佐土原のもうひとつの物語を辿る。
        </p>
      </section>

      {categories.length > 0 ? (
        <ul className="mt-4">
          {categories.map((cat: any, i: number) => (
            <li
              key={cat._id}
              className="animate-fade-in border-b border-line"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Link
                href={`/categories/${cat.slug.current}`}
                className="group grid md:grid-cols-12 gap-6 items-baseline py-8 md:py-12 transition-colors hover:bg-paper -mx-6 px-6 md:-mx-10 md:px-10"
              >
                <span className="md:col-span-1 font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="md:col-span-7 font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] transition-colors group-hover:text-accent">
                  {cat.title}
                </h2>
                <p className="md:col-span-3 text-sm text-mute leading-[1.85]">
                  {cat.description ?? "—"}
                </p>
                <span className="md:col-span-1 md:text-right eyebrow group-hover:text-accent transition-colors">
                  View →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-mute">カテゴリがまだありません。</p>
      )}
    </div>
  );
}
