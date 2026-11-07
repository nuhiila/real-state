import type { CollectionConfig, PayloadRequest } from 'payload'

const isAdmin = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === 'admins'

const refreshRelatedListings = async ({
  doc,
  req,
}: {
  doc: { id: string }
  req: PayloadRequest
}) => {
  const { revalidateTag } = await import('next/cache')
  const related = await req.payload.find({
    collection: 'listings',
    overrideAccess: true,
    depth: 0,
    limit: 100,
    where: { photos: { contains: doc.id } },
  })
  revalidateTag('listings', 'max')
  for (const listing of related.docs) {
    if (listing.slug) revalidateTag(`listing:${listing.slug}`, 'max')
  }
}

export const PropertyPhotos: CollectionConfig = {
  slug: 'property-photos',
  labels: { singular: 'Photo', plural: 'Photos' },
  admin: {
    group: 'Immobilier',
    useAsTitle: 'alt',
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [refreshRelatedListings],
    afterDelete: [refreshRelatedListings],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return headers
    },
  },
}
