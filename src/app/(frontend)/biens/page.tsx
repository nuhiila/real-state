import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DarkHeader } from '@/components/SiteChrome'
import ListingsCatalogue from '@/components/ListingsCatalogue'
import { getListings } from '@/lib/listings'

export const metadata: Metadata = {
  title: 'Biens à vendre et à louer à Casablanca | Atlas Immo',
  description:
    'Découvrez nos appartements, villas, terrains et bureaux à vendre ou à louer dans les meilleurs quartiers de Casablanca.',
}

export default async function ListingsPage() {
  const listings = await getListings()
  return (
    <main>
      <DarkHeader />
      <section className="bg-[#E9DCC3]/45 px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C8553D]">Casablanca</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl md:text-7xl">
            Trouver le bien qui vous ressemble.
          </h1>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1280px] animate-pulse px-5 py-16">
            <div className="h-96 bg-[#E9DCC3]/50" />
          </div>
        }
      >
        <ListingsCatalogue listings={listings} />
      </Suspense>
    </main>
  )
}
