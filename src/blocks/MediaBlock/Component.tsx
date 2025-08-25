import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption: any
  let mediaUrl: string | undefined
  let mimeType: string | undefined

  if (media && typeof media === 'object') {
    caption = media.caption
    // Assumes your Payload media object has `url` and `mimeType`
    mediaUrl = (media as any)?.url
    mimeType = (media as any)?.mimeType
  }

  const isPDF = mimeType === 'application/pdf' || (mediaUrl?.toLowerCase()?.endsWith('.pdf'))

  return (
    <div
    className={cn(
      '',
      {
        container: enableGutter,
      },
      className,
    )}
    >
    {(media || staticImage) && (
      <>
      {isPDF && mediaUrl ? (
        <div className="w-full border border-border rounded-[0.8rem] overflow-hidden">
        <embed
        src={mediaUrl}
        type="application/pdf"
        className="w-full h-[80vh]"
        />
        </div>
      ) : (
        <Media
        imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
        resource={media}
        src={staticImage}
        />
      )}
      </>
    )}

    {caption && (
      <div
      className={cn(
        'mt-6',
        {
          container: !disableInnerContainer,
        },
        captionClassName,
      )}
      >
      <RichText data={caption} enableGutter={false} />
      </div>
    )}
    </div>
  )
}
