import type {Metadata} from 'next'
import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {eventsInRangeQuery} from '@/sanity/lib/queries'
import type {EventsInRangeQueryResult} from '@/sanity.types'

export const metadata: Metadata = {
  title: 'イベントカレンダー',
  description: '佐土原で開催されるイベントをカレンダーで探す。',
}

type Props = {
  searchParams: Promise<{year?: string; month?: string}>
}

type EventItem = EventsInRangeQueryResult[number]

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatMonthDay(dateString: string) {
  const d = new Date(`${dateString}T00:00:00+09:00`)
  if (Number.isNaN(d.getTime())) return dateString
  const weekday = WEEKDAY_LABELS[d.getDay()]
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekday}）`
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${pad2(month)}-${pad2(day)}`
}

function resolveMonth(raw: {year?: string; month?: string}) {
  const now = new Date()
  const year = Number(raw.year)
  const month = Number(raw.month)
  const safeYear = Number.isFinite(year) && year >= 1900 && year <= 2999 ? year : now.getFullYear()
  const safeMonth =
    Number.isFinite(month) && month >= 1 && month <= 12 ? month : now.getMonth() + 1
  return {year: safeYear, month: safeMonth}
}

function shiftMonth(year: number, month: number, delta: number) {
  const base = new Date(year, month - 1 + delta, 1)
  return {year: base.getFullYear(), month: base.getMonth() + 1}
}

function buildCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1)
  const leadingBlanks = firstDay.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7

  return Array.from({length: totalCells}, (_, i) => {
    const dayNumber = i - leadingBlanks + 1
    if (dayNumber < 1 || dayNumber > daysInMonth) return null
    return {day: dayNumber, weekday: i % 7, key: toDateKey(year, month, dayNumber)}
  })
}

function groupByDate(events: EventsInRangeQueryResult) {
  const map = new Map<string, EventItem[]>()
  for (const ev of events) {
    if (!ev.date) continue
    const bucket = map.get(ev.date) ?? []
    bucket.push(ev)
    map.set(ev.date, bucket)
  }
  return map
}

export default async function EventsPage({searchParams}: Props) {
  const {year, month} = resolveMonth(await searchParams)
  const from = toDateKey(year, month, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const to = toDateKey(year, month, daysInMonth)

  const {data: events} = await sanityFetch({
    query: eventsInRangeQuery,
    params: {from, to},
  })

  const eventsByDate = groupByDate(events ?? [])
  const cells = buildCalendarCells(year, month)
  const prev = shiftMonth(year, month, -1)
  const next = shiftMonth(year, month, 1)
  const today = new Date()
  const todayKey = toDateKey(today.getFullYear(), today.getMonth() + 1, today.getDate())

  return (
    <>
      <section className="bg-white">
        <div className="container py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="font-mono uppercase text-xs tracking-widest text-gray-500 mb-5">
              Events
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 leading-[1.05]">
              イベントカレンダー
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              佐土原で開催されるイベントを、カレンダーから探せます。
            </p>
          </div>
        </div>
        <div className="border-b border-gray-100" />
      </section>

      <section className="bg-gray-50">
        <div className="container py-16 sm:py-20">
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/events?year=${prev.year}&month=${prev.month}`}
              className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-brand transition-colors"
              aria-label="前の月"
            >
              ← {prev.year}.{pad2(prev.month)}
            </Link>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              {year}年{month}月
            </h2>
            <Link
              href={`/events?year=${next.year}&month=${next.month}`}
              className="font-mono text-xs uppercase tracking-widest text-gray-600 hover:text-brand transition-colors"
              aria-label="次の月"
            >
              {next.year}.{pad2(next.month)} →
            </Link>
          </div>

          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
            <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={`px-2 py-3 text-center font-mono text-[11px] uppercase tracking-widest ${
                    i === 0 ? 'text-red-600' : i === 6 ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((cell, i) => {
                if (!cell) {
                  return (
                    <div
                      key={`blank-${i}`}
                      className="min-h-[96px] sm:min-h-[120px] border-r border-b border-gray-100 bg-gray-50/40 last:border-r-0 [&:nth-child(7n)]:border-r-0"
                    />
                  )
                }
                const dayEvents = eventsByDate.get(cell.key) ?? []
                const isToday = cell.key === todayKey
                const weekdayColor =
                  cell.weekday === 0
                    ? 'text-red-600'
                    : cell.weekday === 6
                      ? 'text-blue-600'
                      : 'text-gray-700'
                return (
                  <div
                    key={cell.key}
                    className="min-h-[96px] sm:min-h-[120px] border-r border-b border-gray-100 p-2 last:border-r-0 [&:nth-child(7n)]:border-r-0"
                  >
                    <div
                      className={`mb-1 inline-flex h-6 w-6 items-center justify-center font-mono text-xs ${
                        isToday ? 'rounded-full bg-brand text-white' : weekdayColor
                      }`}
                    >
                      {cell.day}
                    </div>
                    {dayEvents.length > 0 && (
                      <ul className="space-y-1">
                        {dayEvents.map((ev) => {
                          const label = [ev.startTime, ev.title, ev.location]
                            .filter(Boolean)
                            .join(' · ')
                          return (
                            <li key={ev._id}>
                              {ev.slug ? (
                                <Link
                                  href={`/events/${ev.slug}`}
                                  title={label}
                                  className="group block truncate rounded-sm bg-brand/10 px-1.5 py-0.5 text-[11px] leading-tight text-gray-800 transition-colors hover:bg-brand hover:text-white"
                                >
                                  {ev.startTime && (
                                    <span className="font-mono text-gray-500 mr-1 group-hover:text-white/80">
                                      {ev.startTime}
                                    </span>
                                  )}
                                  {ev.title}
                                </Link>
                              ) : (
                                <span
                                  title={label}
                                  className="block truncate rounded-sm bg-brand/10 px-1.5 py-0.5 text-[11px] leading-tight text-gray-800"
                                >
                                  {ev.startTime && (
                                    <span className="font-mono text-gray-500 mr-1">
                                      {ev.startTime}
                                    </span>
                                  )}
                                  {ev.title}
                                </span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {(!events || events.length === 0) && (
            <p className="mt-8 text-center text-sm text-gray-500">
              この月のイベントはまだ登録されていません。
            </p>
          )}

          {events && events.length > 0 && (
            <div className="mt-16">
              <div className="flex items-baseline justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
                  今月のイベント
                </h3>
                <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </p>
              </div>
              <ul className="divide-y divide-gray-200 overflow-hidden rounded-sm border border-gray-200 bg-white">
                {events.map((ev) => (
                  <li key={ev._id}>
                    {ev.slug ? (
                      <Link
                        href={`/events/${ev.slug}`}
                        className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-baseline sm:gap-6"
                      >
                        <div className="flex items-baseline gap-3 shrink-0 sm:w-48">
                          <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                            {ev.date && formatMonthDay(ev.date)}
                          </span>
                          {ev.startTime && (
                            <span className="font-mono text-xs text-gray-400">
                              {ev.startTime}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-base text-gray-900 font-medium transition-colors group-hover:text-brand">
                            {ev.title}
                          </p>
                          {ev.location && (
                            <p className="mt-0.5 text-sm text-gray-500">{ev.location}</p>
                          )}
                        </div>
                        {ev.categories && ev.categories.length > 0 && (
                          <ul className="flex flex-wrap gap-1.5 shrink-0">
                            {ev.categories.map((cat) => (
                              <li
                                key={cat._id}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-mono text-gray-600"
                              >
                                {cat.title}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Link>
                    ) : (
                      <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                        <div className="flex items-baseline gap-3 shrink-0 sm:w-48">
                          <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                            {ev.date && formatMonthDay(ev.date)}
                          </span>
                          {ev.startTime && (
                            <span className="font-mono text-xs text-gray-400">
                              {ev.startTime}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-base text-gray-900 font-medium">{ev.title}</p>
                          {ev.location && (
                            <p className="mt-0.5 text-sm text-gray-500">{ev.location}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
