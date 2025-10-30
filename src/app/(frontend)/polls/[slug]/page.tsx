import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const polls = await payload.find({
    collection: 'polls',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = polls.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Poll({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/polls/' + slug
  const poll = await queryPostBySlug({ slug })

  if (!poll) return <PayloadRedirects url={url} />

  const pdfUrl =
    poll.pdf && typeof poll.pdf === 'object' && 'url' in poll.pdf
      ? (poll.pdf.url as string)
      : undefined

  return (
    <article className="pb-16 pt-8">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={poll} />

      <div className="flex flex-col items-center gap-4">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={poll.content} enableGutter={false} />

          {pdfUrl && (
            <div className="max-w-[52rem] mx-auto mt-12 border border-border rounded-[0.8rem] overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full aspect-[8.5/11]"
                title="PDF Viewer"
                allowFullScreen
              />
            </div>
          )}

          {poll.relatedPolls && poll.relatedPolls.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={poll.relatedPolls.filter((poll) => typeof poll === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const poll = await queryPostBySlug({ slug })

  return generateMeta({ doc: poll })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'polls',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
