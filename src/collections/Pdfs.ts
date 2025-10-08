import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Pdfs: CollectionConfig = {
  slug: 'pdfs',
  labels: {
    singular: 'PDF',
    plural: 'PDFs',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/pdfs'),
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category', // will probably remove this at some point
      type: 'relationship',
      relationTo: 'categories',
      required: false,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
