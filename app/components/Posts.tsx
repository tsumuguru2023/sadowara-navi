import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import Avatar from '@/app/components/Avatar'
import Image from '@/app/components/SanityImage'
import {dataAttr} from '@/sanity/lib/utils'

export const PostCard = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author, categories, coverImage} = post

  return (
    <article
      data-sanity={dataAttr({id: _id, type: 'post', path: 'title'}).toString()}
      key={_id}
      className="group border border-gray-200 rounded-sm overflow-hidden bg-white flex transition-colors hover:border-brand relative"
    >
      <Link className="hover:text-brand transition-colors" href={`/posts/${slug}`}>
        <span className="absolute inset-0 z-10" />
      </Link>
      <div className="w-32 sm:w-40 shrink-0 bg-gray-100 overflow-hidden">
        {coverImage?.asset?._ref ? (
          <Image
            id={coverImage.asset._ref}
            alt={coverImage.alt || title || ''}
            width={400}
            height={400}
            mode="cover"
            hotspot={coverImage.hotspot}
            crop={coverImage.crop}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1 min-w-0">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat.slug}`}
                className="relative z-20 inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 hover:border-brand hover:text-brand transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        )}
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 mb-2 line-clamp-2 group-hover:text-brand transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="line-clamp-2 text-xs sm:text-sm leading-5 text-gray-600">{excerpt}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          {author && author.firstName && author.lastName ? (
            <div className="flex items-center">
              <Avatar person={author} small={true} />
            </div>
          ) : (
            <span />
          )}
          <time className="text-gray-500 text-xs font-mono" dateTime={date}>
            <DateComponent dateString={date} />
          </time>
        </div>
      </div>
    </article>
  )
}

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && <h2 className="text-3xl text-gray-900 sm:text-4xl lg:text-5xl">{heading}</h2>}
    {subHeading && <p className="mt-2 text-lg leading-8 text-gray-600">{subHeading}</p>}
    <div className="pt-6 grid gap-6 sm:grid-cols-2">{children}</div>
  </div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: AllPostsQueryResult[number]) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async () => {
  const {data} = await sanityFetch({query: allPostsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Posts
      heading="Recent Posts"
      subHeading={`${data.length === 1 ? 'This blog post is' : `These ${data.length} blog posts are`} populated from your Sanity Studio.`}
    >
      {data.map((post: AllPostsQueryResult[number]) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Posts>
  )
}
