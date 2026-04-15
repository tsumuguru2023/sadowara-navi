import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-paper">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link
              href="/"
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink"
            >
              sadowara<span className="text-accent">.</span>navi
            </Link>
            <p className="mt-5 text-sm text-mute max-w-sm leading-relaxed">
              宮崎県・佐土原の暮らし、グルメ、地域のリアル。
              <br />
              ローカルから届ける、ささやかな読み物。
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Browse</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="link-underline">記事一覧</Link></li>
              <li><Link href="/categories" className="link-underline">カテゴリ</Link></li>
              <li><Link href="/about" className="link-underline">About</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Connect</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="link-underline">お問い合わせ</Link></li>
              <li><Link href="/studio" className="link-underline">Studio</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-line flex items-center justify-between text-xs text-mute">
          <span className="font-mono tracking-widest">© 2026 SADOWARA NAVI</span>
          <span className="font-mono tracking-widest hidden md:inline">MIYAZAKI · JAPAN</span>
        </div>
      </div>
    </footer>
  );
}
