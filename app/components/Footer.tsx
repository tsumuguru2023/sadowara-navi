import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              sadowara navi
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-md">
              宮崎県・佐土原のローカル情報。
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
              Browse
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  記事一覧
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:underline">
                  カテゴリ
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
              Site
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <a
                  href="/studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Studio
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>© 2026 sadowara navi</span>
          <span className="hidden md:inline">Miyazaki · Japan</span>
        </div>
      </div>
    </footer>
  )
}
