import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          sadowara navi
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm hover:opacity-60 transition-opacity"
            style={{ color: 'var(--color-text-muted)' }}
          >
            記事一覧
          </Link>
          <Link
            href="/categories"
            className="text-sm hover:opacity-60 transition-opacity"
            style={{ color: 'var(--color-text-muted)' }}
          >
            カテゴリ
          </Link>
          <Link
            href="/about"
            className="text-sm hover:opacity-60 transition-opacity"
            style={{ color: 'var(--color-text-muted)' }}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
