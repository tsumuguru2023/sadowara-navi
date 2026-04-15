import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/lib/live'
import {
  categoryBySlugQuery,
  categoryPagesSlugs,
  postsByCategoryQuery,
} from '@/sanity/lib/queries'
import {PostCard} from '@/app/components/Posts'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: categoryPagesSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const {slug} = await props.params
  const {data: category} = await sanityFetch({
    query: categoryBySlugQuery,
    params: {slug},
    stega: false,
  })
  return {
    title: category?.title,
    description: category?.description,
  }
}

export default async function CategoryPage(props: Props) {
  const {slug} = await props.params
  const {data: category} = await sanityFetch({
    query: categoryBySlugQuery,
    params: {slug},
  })

  if (!category?._id) return notFound()

  const {data: posts} = await sanityFetch({
    query: postsByCategoryQuery,
    params: {categoryId: category._id},
  })

  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20">
          <nav className="font-mono text-xs uppercase tracking-widest text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/categories" className="hover:underline">
              All categories
            </Link>
            {category.parent && (
              <>
                <span className="text-gray-300">/</span>
                <Link
                  href={`/categories/${category.parent.slug}`}
                  className="hover:underline"
                >
                  {category.parent.title}
                </Link>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="text-gray-700">{category.title}</span>
          </nav>
          <div className="mt-10 max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-brand mb-4">
              Category
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              {category.title}
            </h1>
            {category.description && (
              <p className="mt-6 text-lg text-gray-600 max-w-xl">{category.description}</p>
            )}
          </div>

          {category.children && category.children.length > 0 && (
            <div className="mt-12">
              <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-4">
                Sub-categories
              </p>
              <ul className="flex flex-wrap gap-3">
                {category.children.map((child) => (
                  <li key={child._id}>
                    <Link
                      href={`/categories/${child.slug}`}
                      className="inline-flex items-baseline gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-brand hover:text-brand"
                    >
                      <span>{child.title}</span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {child.postCount}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          {posts && posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">このカテゴリにはまだ記事がありません。</p>
          )}
        </div>
      </section>
    </>
  )
}
