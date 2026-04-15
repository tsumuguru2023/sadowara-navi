import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'parent',
      title: '親カテゴリ',
      description: '上位カテゴリを指定すると、このカテゴリは子カテゴリになります。',
      type: 'reference',
      to: [{type: 'category'}],
      options: {
        filter: ({document}) => ({
          filter: '_id != $self && !defined(parent)',
          params: {self: document._id.replace(/^drafts\./, '')},
        }),
      },
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description', parentTitle: 'parent.title'},
    prepare({title, subtitle, parentTitle}) {
      return {
        title,
        subtitle: parentTitle ? `↳ ${parentTitle} / ${subtitle ?? ''}` : subtitle,
      }
    },
  },
})
