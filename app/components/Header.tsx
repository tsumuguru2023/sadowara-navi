import Link from 'next/link'

import {categoriesQuery, settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CategoryNav from '@/app/components/CategoryNav'
import MobileMenu from '@/app/components/MobileMenu'

export default async function Header() {
  const [{data: settings}, {data: categories}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: categoriesQuery}),
  ])

  return (
    <header className="fixed z-50 h-16 sm:h-20 inset-x-0 top-0 bg-white/80 flex items-center backdrop-blur-lg border-b border-gray-100">
      <div className="container py-3 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <span className="text-lg sm:text-2xl pl-2 font-semibold tracking-tight">
              {settings?.title || 'sadowara navi'}
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
            >
              <CategoryNav categories={categories ?? []} />
              <li>
                <Link href="/events" className="hover:underline">
                  イベント
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu categories={categories ?? []} />
        </div>
      </div>
    </header>
  )
}
