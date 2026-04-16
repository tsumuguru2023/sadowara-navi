'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'

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

export default function MobileMenu({categories}: {categories: Category[]}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const drawer = (
    <div
      className={`fixed inset-0 z-[60] md:hidden ${open ? '' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        className={`absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl flex flex-col transition-transform duration-200 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 sm:h-20 px-6 border-b border-gray-100">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500">Menu</span>
          <button
            type="button"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center w-10 h-10"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-4 text-base tracking-tight">
            <li>
              <Link
                href="/events"
                onClick={() => setOpen(false)}
                className="block py-1 font-medium hover:text-brand"
              >
                イベント
              </Link>
            </li>
            {categories.map((cat) => {
              const hasChildren = (cat.children?.length ?? 0) > 0
              return (
                <li key={cat._id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="block py-1 font-medium hover:text-brand"
                  >
                    {cat.title}
                  </Link>
                  {hasChildren && (
                    <ul className="mt-2 pl-4 space-y-2 border-l border-gray-100">
                      {cat.children!.map((child) => (
                        <li key={child._id}>
                          <Link
                            href={`/categories/${child.slug}`}
                            onClick={() => setOpen(false)}
                            className="block py-1 text-sm text-gray-600 hover:text-brand"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="メニューを開く"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </div>
  )
}
