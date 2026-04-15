/**
 * WordPress → Sanity migration
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> npm run migrate:wp
 *
 * 冪等です。同じ WP ID に対して常に同じ Sanity _id を発行するので、
 * 何度実行しても重複ドキュメントを作りません（createOrReplace）。
 */
import {config as dotenvConfig} from 'dotenv'
import {resolve} from 'node:path'

dotenvConfig({path: resolve(process.cwd(), '.env.local')})
dotenvConfig({path: resolve(process.cwd(), '.env')})

import {createClient} from '@sanity/client'
import {htmlToBlocks} from '@sanity/block-tools'
import {Schema} from '@sanity/schema'
import {JSDOM} from 'jsdom'
import slugify from 'slugify'

import {apiVersion, dataset, projectId} from '../sanity/lib/api'

const WP_BASE = 'https://sadowara-navi.com/wp-json/wp/v2'
const AUTHOR_DOC_ID = 'wp-author-default'
const AUTHOR_FIRST_NAME = 'Sadowara'
const AUTHOR_LAST_NAME = 'Navi'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN env var (write permission required).')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

// ---------- Schema for block-tools ----------

const compiled = Schema.compile({
  name: 'default',
  types: [
    {
      type: 'object',
      name: 'tmp',
      fields: [
        {
          title: 'Content',
          name: 'content',
          type: 'array',
          of: [{type: 'block'}, {type: 'image'}],
        },
      ],
    },
  ],
})
const blockContentType = compiled.get('tmp').fields.find((f: any) => f.name === 'content').type

// ---------- WP fetch ----------

type WPCategory = {id: number; name: string; slug: string; parent: number}
type WPPost = {
  id: number
  date_gmt: string
  slug: string
  title: {rendered: string}
  excerpt: {rendered: string}
  content: {rendered: string}
  categories: number[]
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{source_url: string; alt_text?: string}>
  }
}

async function fetchAll<T>(path: string): Promise<T[]> {
  const res = await fetch(`${WP_BASE}/${path}`)
  if (!res.ok) throw new Error(`WP fetch failed: ${path} (${res.status})`)
  return (await res.json()) as T[]
}

// ---------- Helpers ----------

const decodeHtml = (s: string) => {
  const dom = new JSDOM(`<!doctype html><body>${s}</body>`)
  return dom.window.document.body.textContent ?? ''
}

const toAsciiSlug = (s: string) =>
  slugify(s, {lower: true, strict: true, remove: /[*+~.()'"!:@]/g}) || `post-${Date.now()}`

const wpCategoryId = (id: number) => `wp-cat-${id}`
const wpPostId = (id: number) => `wp-post-${id}`

async function uploadImage(url: string, alt = ''): Promise<{_type: 'image'; asset: {_type: 'reference'; _ref: string}; alt?: string}> {
  console.log(`  ↓ uploading: ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image fetch failed: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const filename = url.split('/').pop()?.split('?')[0] ?? 'image'
  const asset = await client.assets.upload('image', buf, {filename})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}, alt}
}

// ---------- Migration steps ----------

async function migrateAuthor() {
  console.log('▶ Author')
  await client.createIfNotExists({
    _id: AUTHOR_DOC_ID,
    _type: 'person',
    firstName: AUTHOR_FIRST_NAME,
    lastName: AUTHOR_LAST_NAME,
  } as any)
}

async function migrateCategories(): Promise<Map<number, string>> {
  console.log('▶ Categories')
  const cats = await fetchAll<WPCategory>('categories?per_page=100')
  // 親→子 の順に作る（参照解決のため）
  const sorted = [...cats].sort((a, b) => (a.parent === 0 ? -1 : 1) - (b.parent === 0 ? -1 : 1))
  const idMap = new Map<number, string>()
  for (const c of sorted) {
    const _id = wpCategoryId(c.id)
    idMap.set(c.id, _id)
    const doc: any = {
      _id,
      _type: 'category',
      title: decodeHtml(c.name),
      slug: {_type: 'slug', current: c.slug || toAsciiSlug(c.name)},
    }
    if (c.parent && c.parent !== 0) {
      doc.parent = {_type: 'reference', _ref: wpCategoryId(c.parent)}
    }
    await client.createOrReplace(doc)
    console.log(`  · ${doc.title} (${c.slug})${c.parent ? ` → parent=${c.parent}` : ''}`)
  }
  return idMap
}

async function convertContent(html: string): Promise<any[]> {
  // 1) 本文中の <img> を全部アップロードして src→_ref マップを作る
  const dom = new JSDOM(`<!doctype html><body>${html}</body>`)
  const imgs = Array.from(dom.window.document.querySelectorAll('img'))
  const srcToRef = new Map<string, string>()
  for (const img of imgs) {
    const src = img.getAttribute('src')
    if (!src || srcToRef.has(src)) continue
    const alt = img.getAttribute('alt') ?? ''
    const uploaded = await uploadImage(src, alt)
    srcToRef.set(src, uploaded.asset._ref)
  }

  // 2) HTML → Portable Text、img は image ブロックへ
  const blocks = htmlToBlocks(html, blockContentType as any, {
    parseHtml: (h: string) => new JSDOM(h).window.document as any,
    rules: [
      {
        deserialize(el: any, _next: any, block: any) {
          if (el.tagName && el.tagName.toLowerCase() === 'img') {
            const src = el.getAttribute('src')
            const alt = el.getAttribute('alt') ?? ''
            const ref = src ? srcToRef.get(src) : undefined
            if (!ref) return undefined
            return block({
              _type: 'image',
              alt,
              asset: {_type: 'reference', _ref: ref},
            })
          }
          return undefined
        },
      },
    ],
  })
  return blocks
}

async function migratePosts(catMap: Map<number, string>) {
  console.log('▶ Posts')
  const posts = await fetchAll<WPPost>('posts?per_page=100&_embed')
  for (const p of posts) {
    const title = decodeHtml(p.title.rendered)
    console.log(`\n· [${p.id}] ${title}`)

    // Cover
    let coverImage: any | undefined
    const featured = p._embedded?.['wp:featuredmedia']?.[0]
    if (featured?.source_url) {
      coverImage = await uploadImage(featured.source_url, featured.alt_text ?? title)
    }

    // Body
    const content = await convertContent(p.content.rendered)

    // Excerpt
    const excerpt = decodeHtml(p.excerpt.rendered).trim()

    // Slug — WP slug は URL エンコードされた日本語なので英字化
    const slug = toAsciiSlug(title) + `-${p.id}`

    const doc: any = {
      _id: wpPostId(p.id),
      _type: 'post',
      title,
      slug: {_type: 'slug', current: slug},
      content,
      excerpt: excerpt || undefined,
      coverImage,
      date: new Date(p.date_gmt + 'Z').toISOString(),
      author: {_type: 'reference', _ref: AUTHOR_DOC_ID},
      categories: p.categories
        .map((id) => catMap.get(id))
        .filter((v): v is string => Boolean(v))
        .map((ref) => ({_type: 'reference', _ref: ref, _key: ref})),
    }
    await client.createOrReplace(doc)
    console.log(`  ✓ saved /posts/${slug}`)
  }
}

// ---------- Main ----------

;(async () => {
  await migrateAuthor()
  const catMap = await migrateCategories()
  await migratePosts(catMap)
  console.log('\n✅ Migration complete')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
