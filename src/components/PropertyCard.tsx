import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/payload-types'
import { formatPrice, listingHref } from '@/lib/listing-utils'

export default function PropertyCard({ listing }: { listing: Listing }) {
  const photo =
    Array.isArray(listing.photos) && typeof listing.photos[0] === 'object'
      ? listing.photos[0]
      : null
  return (
    <article className="group">
      <Link href={listingHref(listing)} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#E9DCC3]">
          {photo?.url && (
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          )}
          <span className="absolute left-4 top-4 bg-[#FAF8F4] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14213D]">
            {listing.transaction === 'vente' ? 'À vendre' : 'À louer'}
          </span>
        </div>
        <div className="pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8553D]">
            {listing.neighborhood}, Casablanca
          </p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-[#14213D]">{listing.title}</h3>
          <div className="mt-4 flex items-center justify-between border-t border-[#14213D]/15 pt-4">
            <p className="font-semibold text-[#14213D]">
              {formatPrice(listing.price, listing.transaction)}
            </p>
            <p className="text-sm text-[#14213D]/65">
              {listing.area} m² · {listing.rooms} pièces
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}
