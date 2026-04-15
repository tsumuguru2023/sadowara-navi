import {CogIcon, TagIcon, FolderIcon, DocumentsIcon, ImagesIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const DISABLED_TYPES = ['settings', 'assist.instruction.context', 'category']

const categoryTree = (S: StructureBuilder) =>
  S.listItem()
    .title('Categories')
    .icon(TagIcon)
    .child(
      S.list()
        .title('Categories')
        .items([
          S.listItem()
            .title('All Categories')
            .icon(DocumentsIcon)
            .child(
              S.documentTypeList('category')
                .title('All Categories')
                .filter('_type == "category"'),
            ),
          S.divider(),
          S.listItem()
            .title('Tree View')
            .icon(FolderIcon)
            .child(
              S.documentList()
                .title('Root Categories')
                .filter('_type == "category" && !defined(parent)')
                .defaultOrdering([{field: 'title', direction: 'asc'}])
                .child((parentId) =>
                  S.list()
                    .title('Category')
                    .items([
                      S.listItem()
                        .title('Edit Category')
                        .icon(TagIcon)
                        .child(S.document().schemaType('category').documentId(parentId)),
                      S.listItem()
                        .title('Child Categories')
                        .icon(FolderIcon)
                        .child(
                          S.documentList()
                            .title('Child Categories')
                            .filter('_type == "category" && parent._ref == $parentId')
                            .params({parentId})
                            .defaultOrdering([{field: 'title', direction: 'asc'}]),
                        ),
                      S.listItem()
                        .title('Posts in Category')
                        .icon(DocumentsIcon)
                        .child(
                          S.documentList()
                            .title('Posts')
                            .filter('_type == "post" && references($parentId)')
                            .params({parentId})
                            .defaultOrdering([{field: 'date', direction: 'desc'}]),
                        ),
                    ]),
                ),
            ),
        ]),
    )

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      ...S.documentTypeListItems()
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),
      categoryTree(S),
      S.listItem()
        .title('Media Library')
        .icon(ImagesIcon)
        .child(
          S.documentTypeList('sanity.imageAsset')
            .title('All Images')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
