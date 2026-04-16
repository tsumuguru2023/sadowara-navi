import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  "categories": categories[]->{_id, title, "slug": slug.current},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const categoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current) && !defined(parent)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && defined(slug.current) && references(^._id)]),
    "children": *[_type == "category" && defined(slug.current) && parent._ref == ^._id] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "postCount": count(*[_type == "post" && defined(slug.current) && references(^._id)])
    }
  }
`)

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "parent": parent->{_id, title, "slug": slug.current},
    "children": *[_type == "category" && defined(slug.current) && parent._ref == ^._id] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "postCount": count(*[_type == "post" && defined(slug.current) && references(^._id)])
    }
  }
`)

export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && references($categoryId)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const categoryPagesSlugs = defineQuery(`
  *[_type == "category" && defined(slug.current)]
  {"slug": slug.current}
`)

const eventCoreFields = /* groq */ `
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  date,
  startTime,
  endTime,
  location,
  "categories": categories[]->{_id, title, "slug": slug.current}
`

const eventAdjacent = /* groq */ `
  {
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    date
  }
`

export const eventsInRangeQuery = defineQuery(`
  *[_type == "event" && defined(slug.current) && defined(date) && date >= $from && date <= $to]
    | order(date asc, startTime asc) {
    ${eventCoreFields}
  }
`)

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    ${eventCoreFields},
    summary,
    description,
    image,
    "previous": *[
      _type == "event" && defined(slug.current) && _id != ^._id &&
      (date < ^.date || (date == ^.date && coalesce(startTime, "00:00") < coalesce(^.startTime, "00:00")))
    ] | order(date desc, coalesce(startTime, "00:00") desc)[0] ${eventAdjacent},
    "next": *[
      _type == "event" && defined(slug.current) && _id != ^._id &&
      (date > ^.date || (date == ^.date && coalesce(startTime, "00:00") > coalesce(^.startTime, "00:00")))
    ] | order(date asc, coalesce(startTime, "00:00") asc)[0] ${eventAdjacent}
  }
`)

export const eventMetaBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    "title": coalesce(title, "Untitled"),
    summary,
    description
  }
`)

export const eventPagesSlugs = defineQuery(`
  *[_type == "event" && defined(slug.current)]
  {"slug": slug.current}
`)
