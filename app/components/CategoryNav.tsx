'use client'

import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'

type Child = {
  _id: string
  title: string | null
  slug: string | null
}

type Category = {
  _id: string
  title: string | null
  slug: string | null
  children: Child[] | null
}

function CategoryItem({category}: {category: Category}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  const hasChildren = (category.children?.length ?? 0) > 0

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      <span className="inline-flex items-center gap-1">
        <Link href={`/categories/${category.slug}`} className="hover:underline">
          {category.title}
        </Link>
        {hasChildren && (
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            aria-label={`${category.title} のサブカテゴリ`}
            onClick={() => setOpen((v) => !v)}
            className="p-1 -m-1"
          >
            <svg
              className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </span>

      {open && hasChildren && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
          <div className="min-w-[200px] rounded-sm border border-gray-100 bg-white shadow-lg p-3 font-sans">
            <ul className="space-y-1">
              {category.children!.map((child) => (
                <li key={child._id}>
                  <Link
                    href={`/categories/${child.slug}`}
                    onClick={() => setOpen(false)}
                    className="block px-2 py-1.5 text-sm text-gray-700 rounded-sm hover:bg-gray-50 hover:text-brand"
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}

export default function CategoryNav({categories}: {categories: Category[]}) {
  return (
    <>
      {categories.map((cat) => (
        <CategoryItem key={cat._id} category={cat} />
      ))}
    </>
  )
}
