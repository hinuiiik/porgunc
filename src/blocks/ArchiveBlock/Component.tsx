import type {
  ArchiveBlock as ArchiveBlockProps,
  Post,
  Poll,
} from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & { id?: string }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  const limit = limitFromProps || 3

  const payload = await getPayload({ config: configPromise })

  let docs: (Post | Poll)[] = []

  if (populateBy === 'collection') {
    const collection = relationTo || 'posts'

    const flattenedCategories = categories?.map((category) =>
      typeof category === 'object' ? category.id : category
    )

    const fetchedDocs = await payload.find({
      collection,
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
          where: {
            categories: {
              in: flattenedCategories,
            },
          },
        }
        : {}),
    })

    docs = fetchedDocs.docs
  } else if (populateBy === 'selection' && selectedDocs?.length) {
    docs = selectedDocs
      .map((item) => (typeof item.value === 'object' ? item.value : null))
      .filter(Boolean) as (Post | Poll)[]
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText
            className="ms-0 max-w-[48rem]"
            data={introContent}
            enableGutter={false}
          />
        </div>
      )}
      <CollectionArchive docs={docs} relationTo={relationTo || 'posts'} />
    </div>
  )
}
