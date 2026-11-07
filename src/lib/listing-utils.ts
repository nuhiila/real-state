import type { Listing } from '@/payload-types'

export function listingHref(listing: Pick<Listing, 'transaction' | 'slug'>) {
  const prefix = `${listing.transaction}-`
  const cleanSlug = listing.slug.startsWith(prefix)
    ? listing.slug.slice(prefix.length)
    : listing.slug
  return `/${listing.transaction}/${cleanSlug}`
}

export function formatPrice(price: number, transaction: string) {
  const value = new Intl.NumberFormat('fr-MA').format(price)
  return transaction === 'location' ? `${value} MAD / mois` : `${value} MAD`
}
