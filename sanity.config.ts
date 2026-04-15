'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'
import {schemaTypes} from '@/sanity/schemaTypes'
import {structure} from '@/sanity/structure'

const homeLocation = {title: 'Home', href: '/'} satisfies DocumentLocation

function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      return undefined
  }
}

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'sadowara navi — Studio',
  projectId,
  dataset,
  apiVersion,
  schema: {types: schemaTypes},
  plugins: [
    presentationTool({
      previewUrl: {
        previewMode: {enable: '/api/draft-mode/enable'},
      },
      resolve: {
        mainDocuments: defineDocuments([
          {route: '/', filter: `_type == "settings" && _id == "siteSettings"`},
          {route: '/:slug', filter: `_type == "page" && slug.current == $slug || _id == $slug`},
          {route: '/posts/:slug', filter: `_type == "post" && slug.current == $slug || _id == $slug`},
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {name: 'name', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.name || 'Untitled', href: resolveHref('page', doc?.slug)!},
              ],
            }),
          }),
          post: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                {title: doc?.title || 'Untitled', href: resolveHref('post', doc?.slug)!},
                homeLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({structure}),
    unsplashImageAsset(),
    assist(),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
