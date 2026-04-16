import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {eventBySlugQuery, eventMetaBySlugQuery, eventPagesSlugs} from '@/sanity/lib/queries'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: eventPagesSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: event} = await sanityFetch({
    query: eventMetaBySlugQuery,
    params,
    stega: false,
  })
  return {
    title: event?.title,
    description: event?.summary ?? event?.description ?? undefined,
  }
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

function formatJapaneseDate(dateString: string | null | undefined) {
  if (!dateString) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString)
  if (!m) return dateString
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const weekday = WEEKDAY_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
  return `${year}年${month}月${day}日（${weekday}）`
}

type Adjacent = {title: string | null; slug: string | null; date: string | null}

function NavCard({
  event,
  direction,
}: {
  event: Adjacent | null
  direction: 'prev' | 'next'
}) {
  const isPrev = direction === 'prev'
  const label = isPrev ? '← 前のイベント' : '次のイベント →'
  const emptyLabel = isPrev ? '前のイベントはありません' : '次のイベントはありません'
  const align = isPrev ? '' : 'text-right'

  if (!event?.slug) {
    return (
      <div className={`rounded-sm border border-dashed border-gray-200 p-5 ${align}`}>
        <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
          {emptyLabel}
        </p>
      </div>
    )
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group block rounded-sm border border-gray-200 bg-white p-5 transition-colors hover:border-brand ${align}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      {event.date && (
        <p className="font-mono text-xs text-gray-500 mb-1">{formatJapaneseDate(event.date)}</p>
      )}
      <p className="text-base font-medium text-gray-900 transition-colors group-hover:text-brand">
        {event.title}
      </p>
    </Link>
  )
}

export default async function EventPage(props: Props) {
  const params = await props.params
  const {data: event} = await sanityFetch({
    query: eventBySlugQuery,
    params,
  })

  if (!event?._id) return notFound()

  const timeRange = [event.startTime, event.endTime].filter(Boolean).join(' – ')
  const backHref = event.date
    ? `/events?year=${event.date.slice(0, 4)}&month=${Number(event.date.slice(5, 7))}`
    : '/events'

  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <Link
              href={backHref}
              className="inline-block font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-brand mb-6 transition-colors"
            >
              ← イベントカレンダーへ戻る
            </Link>
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">Event</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.2]">
              {event.title}
            </h1>
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <aside className="space-y-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                  日時
                </p>
                <p className="text-gray-900 text-lg">{formatJapaneseDate(event.date)}</p>
                {timeRange && <p className="text-gray-700 font-mono text-sm mt-1">{timeRange}</p>}
              </div>
              {event.location && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                    場所
                  </p>
                  <p className="text-gray-900">{event.location}</p>
                </div>
              )}
              {event.categories && event.categories.length > 0 && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                    カテゴリ
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {event.categories.map((cat) => (
                      <li key={cat._id}>
                        <Link
                          href={`/categories/${cat.slug}`}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-mono text-gray-700 transition-colors hover:bg-brand hover:text-white"
                        >
                          {cat.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            <article className="space-y-8">
              {event.image?.asset?._ref && (
                <Image
                  id={event.image.asset._ref}
                  alt={event.image.alt || event.title || ''}
                  className="w-full rounded-sm"
                  width={1024}
                  height={576}
                  mode="cover"
                  hotspot={event.image.hotspot}
                  crop={event.image.crop}
                />
              )}
              {event.summary && (
                <p className="text-lg text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {event.summary}
                </p>
              )}
              {event.description && (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              )}
            </article>
          </div>

          {(event.previous || event.next) && (
            <nav aria-label="前後のイベント" className="mt-16 grid gap-4 sm:grid-cols-2">
              <NavCard event={event.previous} direction="prev" />
              <NavCard event={event.next} direction="next" />
            </nav>
          )}

          <div className="mt-12">
            <Link
              href={backHref}
              className="inline-block font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-brand transition-colors"
            >
              ← イベントカレンダーへ戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
