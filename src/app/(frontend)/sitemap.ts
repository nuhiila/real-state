import type { MetadataRoute } from 'next'
import { listingHref } from '@/lib/listing-utils'
import { getListings } from '@/lib/listings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const listings = await getListings()
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/biens`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/confier-mon-bien`, changeFrequency: 'monthly', priority: 0.7 },
    ...listings.map((listing) => ({
      url: `${base}${listingHref(listing)}`,
      lastModified: new Date(listing.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
