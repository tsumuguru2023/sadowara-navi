import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/lib/live'
import {
  categoryBySlugQuery,
  categoryPagesSlugs,
  postsByCategoryQuery,
} from '@/sanity/lib/queries'
import DateComponent from '@/app/components/Date'
import Avatar from '@/app/components/Avatar'

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
          <Link
            href="/categories"
            className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:underline"
          >
            ← All categories
          </Link>
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
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          {posts && posts.length > 0 ? (
            <ul className="space-y-6">
              {posts.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group block rounded-sm border border-gray-200 bg-white p-6 transition-colors hover:border-brand"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-brand transition-colors mb-3">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm leading-6 text-gray-600 line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {post.author?.firstName && post.author?.lastName ? (
                        <Avatar person={post.author} small />
                      ) : (
                        <span />
                      )}
                      <time className="text-gray-500 text-xs font-mono" dateTime={post.date}>
                        <DateComponent dateString={post.date} />
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">このカテゴリにはまだ記事がありません。</p>
          )}
        </div>
      </section>
    </>
  )
}
