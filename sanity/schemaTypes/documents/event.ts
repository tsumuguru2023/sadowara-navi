import {CalendarIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'
import type {Event} from '../../../sanity.types'

export const event = defineType({
  name: 'event',
  title: 'Event',
  icon: CalendarIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: '開催日',
      type: 'date',
      options: {dateFormat: 'YYYY-MM-DD'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: '開始時刻',
      description: 'HH:MM 形式（例: 10:00）',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'HH:MM'}).error('HH:MM 形式で入力してください'),
    }),
    defineField({
      name: 'endTime',
      title: '終了時刻',
      description: 'HH:MM 形式（例: 17:00）',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'HH:MM'}).error('HH:MM 形式で入力してください'),
    }),
    defineField({
      name: 'location',
      title: '開催場所',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: '概要',
      description: 'カード・一覧で使う短いリード文（1〜2文程度）',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'description',
      title: '説明文',
      description: '詳細ページの本文',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'image',
      title: '画像',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {imageDescriptionField: 'alt'},
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '代替テキスト',
          description: 'SEOとアクセシビリティのために重要です。',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const document = context.document as Event
              if (document?.image?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'カテゴリ',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      options: {layout: 'tags'},
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      startTime: 'startTime',
      location: 'location',
      media: 'image',
    },
    prepare({title, date, startTime, location, media}) {
      const subtitles = [
        date && format(parseISO(date), 'yyyy/MM/dd'),
        startTime,
        location,
      ].filter(Boolean)
      return {title, media, subtitle: subtitles.join(' · ')}
    },
  },
})
