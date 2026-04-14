import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-card-bg)' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              sadowara navi
            </Link>
            <p
              className="mt-2 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              佐土原の暮らしと情報を届けるブログ
            </p>
          </div>
          <nav className="flex gap-8">
            <Link href="/" className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
              記事一覧
            </Link>
            <Link href="/categories" className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
              カテゴリ
            </Link>
            <Link href="/about" className="text-sm hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
              About
            </Link>
          </nav>
        </div>
        <div
          className="mt-10 pt-6 text-xs text-center"
          style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          © {new Date().getFullYear()} sadowara navi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
