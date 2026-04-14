import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import PostCard from "./components/PostCard";

export const revalidate = 60;

export default async function Home() {
  const posts = await client.fetch(postsQuery);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          sadowara navi
        </h1>
        <p
          className="mt-4 text-lg"
          style={{ color: 'var(--color-text-muted)' }}
        >
          佐土原の暮らしと情報を届けるブログ
        </p>
      </section>

      {/* Posts Grid */}
      <section className="pb-20">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post: any, index: number) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p style={{ color: 'var(--color-text-muted)' }}>
              まだ記事がありません。
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <a
                href="/studio"
                className="underline"
                style={{ color: 'var(--color-accent)' }}
              >
                Sanity Studio
              </a>
              から記事を作成してください。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
