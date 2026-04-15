import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/75 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[1.5rem] md:text-[1.7rem] font-bold tracking-tight leading-none text-ink"
        >
          sadowara<span className="text-accent">.</span>navi
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="eyebrow link-underline">Journal</Link>
          <Link href="/categories" className="eyebrow link-underline">Topics</Link>
          <Link href="/about" className="eyebrow link-underline">About</Link>
        </nav>

        <Link
          href="/categories"
          className="md:hidden eyebrow"
        >
          Menu
        </Link>
      </div>
    </header>
  );
}
