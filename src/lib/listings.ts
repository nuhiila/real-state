import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

export const getListings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'listings',
      overrideAccess: false,
      depth: 1,
      limit: 100,
      locale: 'fr',
      sort: '-featured,-createdAt',
      where: {
        and: [{ _status: { equals: 'published' } }, { availability: { equals: 'disponible' } }],
      },
    })
    return result.docs
  },
  ['atlas-listings'],
  { tags: ['listings'] },
)

export async function getListing(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'listings',
        overrideAccess: false,
        depth: 1,
        limit: 1,
        locale: 'fr',
        where: {
          and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
        },
      })
      return result.docs[0] ?? null
    },
    ['atlas-listing', slug],
    { tags: ['listings', `listing:${slug}`] },
  )()
}
