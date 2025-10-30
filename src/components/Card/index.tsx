'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'
import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts' | 'polls'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo = 'posts', showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <Link
      href={href}
      ref={link.ref}
      className={cn(
        'group block rounded-xl overflow-hidden transition-all duration-200 border border-border/60 hover:shadow-md hover:-translate-y-0.5',
        metaImage
          ? 'bg-card'
          : 'bg-muted/70 dark:bg-muted/40 backdrop-blur-sm',
        'hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      {metaImage && typeof metaImage !== 'string' && (
        <div className="relative w-full">
          <Media resource={metaImage} size="33vw" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3">
        {showCategories && hasCategories && (
          <div className="uppercase text-xs text-muted-foreground tracking-wide">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const titleFromCategory = category.title || 'Untitled category'
                const isLast = index === categories.length - 1
                return (
                  <Fragment key={index}>
                    {titleFromCategory}
                    {!isLast && <>,&nbsp;</>}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}

        {titleToUse && (
          <h3 className="text-lg font-semibold leading-snug group-hover:underline">
            {titleToUse}
          </h3>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">{sanitizedDescription}</p>
        )}
      </div>
    </Link>
  )
}
