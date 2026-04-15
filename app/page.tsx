import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import PostCard from "./components/PostCard";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const posts = await client.fetch(postsQuery);
  const issue = String(new Date().getFullYear()).slice(-2) + "·" + String(new Date().getMonth() + 1).padStart(2, "0");

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10">
      {/* Masthead */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-20 border-b border-line">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <span className="eyebrow">Vol. {issue} — Local Journal</span>
          <span className="eyebrow hidden md:inline">Miyazaki / Sadowara</span>
        </div>

        <h1 className="font-display font-black text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.035em]">
          The
          <br />
          <span className="italic font-normal">sadowara</span>
          <span className="text-accent">.</span>
          <br />
          Journal
        </h1>

        <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-8 items-end">
          <p className="md:col-span-7 text-base md:text-lg text-mute leading-[1.95] max-w-xl">
            佐土原の暮らしと地域の物語を、ゆっくり、丁寧に。
            グルメ、イベント、暮らしのリアル — ローカルから届ける読み物。
          </p>
          <div className="md:col-span-5 md:text-right">
            <Link href="/categories" className="eyebrow link-underline">
              Browse all topics →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      {posts.length > 0 ? (
        <>
          <section className="py-16 md:py-24 border-b border-line">
            <div className="flex items-center gap-4 mb-10">
              <span className="font-mono text-xs text-accent">— 01</span>
              <span className="eyebrow">This Week's Read</span>
            </div>
            <PostCard post={posts[0]} index={0} featured />
          </section>

          {/* Grid */}
          {posts.length > 1 && (
            <section className="py-16 md:py-24">
              <div className="flex items-center justify-between mb-10 md:mb-14">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-accent">— 02</span>
                  <span className="eyebrow">Latest Stories</span>
                </div>
                <span className="font-mono text-xs text-mute">
                  {String(posts.length - 1).padStart(2, "0")} entries
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {posts.slice(1).map((post: any, index: number) => (
                  <PostCard key={post._id} post={post} index={index + 1} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="py-32 text-center">
          <p className="eyebrow mb-6">Coming soon</p>
          <p className="font-display text-3xl md:text-4xl text-ink mb-8">
            まだ記事がありません。
          </p>
          <Link
            href="/studio"
            className="inline-block eyebrow border-b border-accent pb-1 text-accent"
          >
            Studio で記事を作成 →
          </Link>
        </section>
      )}
    </div>
  );
}
