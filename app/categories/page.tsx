import type {Metadata} from 'next'
import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {categoriesQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'カテゴリから記事を探す',
}

export default async function CategoriesPage() {
  const {data: categories} = await sanityFetch({query: categoriesQuery})

  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">
              Index
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              Categories
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              興味のあるカテゴリから、佐土原のもうひとつの物語を辿る。
            </p>
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          {categories && categories.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group block rounded-sm border border-gray-200 bg-white p-6 transition-colors hover:border-brand"
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 group-hover:text-brand transition-colors">
                        {cat.title}
                      </h2>
                      <span className="font-mono text-xs text-gray-500">
                        {cat.postCount} {cat.postCount === 1 ? 'post' : 'posts'}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-sm leading-6 text-gray-600 line-clamp-3 mb-4">
                        {cat.description}
                      </p>
                    )}
                    {cat.children && cat.children.length > 0 && (
                      <div className="pt-4 mt-auto border-t border-gray-100">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                          Sub-categories
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {cat.children.map((child) => (
                            <li key={child._id}>
                              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                                {child.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">カテゴリがまだありません。</p>
          )}
        </div>
      </section>
    </>
  )
}
