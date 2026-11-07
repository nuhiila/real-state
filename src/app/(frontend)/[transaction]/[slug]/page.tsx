import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DarkHeader } from '@/components/SiteChrome'
import { ListingLeadForm } from '@/components/LeadForm'
import PropertyCard from '@/components/PropertyCard'
import { formatPrice, listingHref } from '@/lib/listing-utils'
import { getListing, getListings } from '@/lib/listings'

type Props = { params: Promise<{ transaction: string; slug: string }> }

async function resolveListing(params: Props['params']) {
  const { transaction, slug } = await params
  if (!['vente', 'location'].includes(transaction)) return null
  return getListing(`${transaction}-${slug}`)
}

export async function generateStaticParams() {
  const listings = await getListings()
  return listings.map((item) => {
    const prefix = `${item.transaction}-`
    return {
      transaction: item.transaction,
      slug: item.slug.startsWith(prefix) ? item.slug.slice(prefix.length) : item.slug,
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await resolveListing(params)
  if (!listing) return { title: 'Bien introuvable | Atlas Immo' }
  const photo = typeof listing.photos?.[0] === 'object' ? listing.photos[0] : null
  return {
    title: listing.metaTitle || `${listing.title} | Atlas Immo`,
    description: listing.metaDescription || listing.description.slice(0, 155),
    openGraph: photo?.url ? { images: [photo.url] } : undefined,
  }
}

export default async function PropertyPage({ params }: Props) {
  const listing = await resolveListing(params)
  if (!listing) notFound()
  const allListings = await getListings()
  const similar = allListings
    .filter(
      (item) =>
        item.id !== listing.id &&
        (item.neighborhood === listing.neighborhood || item.propertyType === listing.propertyType),
    )
    .slice(0, 3)
  const photos = (listing.photos ?? []).filter((photo) => typeof photo === 'object')
  const phoneDigits = (listing.agentPhone || '+212522221840').replace(/\D/g, '')
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `${site}${listingHref(listing)}`,
    image: photos.map((photo) => `${site}${photo.url}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: 'Casablanca',
      addressCountry: 'MA',
    },
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: 'MAD',
      availability: 'https://schema.org/InStock',
    },
  }
  return (
    <main>
      <DarkHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-[1280px] px-5 pb-12 pt-8 md:px-10 md:pt-12">
        <nav className="mb-7 text-sm text-[#14213D]/55">
          <Link href="/">Accueil</Link> / <Link href="/biens">Biens</Link> / {listing.neighborhood}
        </nav>
        <div className="grid gap-3 md:grid-cols-[1.6fr_0.8fr]">
          {photos[0]?.url ? (
            <a
              href="#photo-1"
              className="relative block min-h-[420px] overflow-hidden rounded-[24px] md:min-h-[640px]"
            >
              <Image
                src={photos[0].url}
                alt={photos[0].alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 70vw"
                className="object-cover"
              />
              <span className="absolute bottom-5 left-5 bg-white px-4 py-2 text-sm font-semibold">
                Agrandir la photo
              </span>
            </a>
          ) : (
            <div className="min-h-[420px] rounded-[24px] bg-[#E9DCC3]" />
          )}
          <div className="grid gap-3">
            {photos.slice(1, 3).map((photo, index) => (
              <a
                key={photo.id}
                href={`#photo-${index + 2}`}
                className="relative min-h-52 overflow-hidden rounded-[20px]"
              >
                <Image
                  src={photo.url!}
                  alt={photo.alt}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </a>
            ))}
            <div className="flex min-h-52 items-end rounded-[20px] bg-[#E9DCC3] p-7">
              <p className="font-serif text-3xl">Une visite privée, à votre rythme.</p>
            </div>
          </div>
        </div>
      </section>

      {photos.map((photo, index) => (
        <div
          id={`photo-${index + 1}`}
          key={photo.id}
          className="fixed inset-0 z-[80] hidden bg-[#14213D]/95 p-5 target:grid target:place-items-center"
        >
          <Link
            href="#"
            className="absolute right-6 top-6 border border-white/40 px-4 py-2 text-white"
          >
            Fermer
          </Link>
          <div className="relative h-[80vh] w-full max-w-6xl">
            <Image src={photo.url!} alt={photo.alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      ))}

      <section className="mx-auto grid max-w-[1180px] gap-12 px-5 py-14 md:px-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8553D]">
            {listing.transaction === 'vente' ? 'À vendre' : 'À louer'} · {listing.neighborhood}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">{listing.title}</h1>
          <p className="mt-5 text-2xl font-semibold">
            {formatPrice(listing.price, listing.transaction)}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-px bg-[#14213D]/15 sm:grid-cols-4">
            <Fact label="Surface" value={`${listing.area} m²`} />
            <Fact label="Pièces" value={String(listing.rooms)} />
            <Fact label="Chambres" value={String(listing.bedrooms ?? '—')} />
            <Fact label="Salles de bain" value={String(listing.bathrooms ?? '—')} />
          </div>
          <div className="mt-14 border-t border-[#14213D]/15 pt-10">
            <h2 className="font-serif text-3xl">Le bien</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#14213D]/70">
              {listing.description}
            </p>
          </div>
          <div className="mt-12">
            <h2 className="font-serif text-3xl">Caractéristiques</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {(listing.features ?? []).map((feature) => (
                <li key={feature.id} className="border-b border-[#14213D]/15 pb-3">
                  ✓ {feature.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-14 overflow-hidden rounded-[22px]">
            <iframe
              title={`Carte de ${listing.neighborhood}, Casablanca`}
              loading="lazy"
              className="h-[380px] w-full border-0"
              src={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}&z=14&output=embed`}
            />
          </div>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
          <div className="bg-[#14213D] p-7 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-[#E9DCC3]">Votre conseillère</p>
            <h2 className="mt-3 font-serif text-3xl">{listing.agentName}</h2>
            <p className="mt-3 text-sm text-white/60">Spécialiste Casablanca centre & littoral</p>
            <div className="mt-7 grid grid-cols-2 gap-2">
              <a
                className="border border-white/35 px-4 py-3 text-center text-sm font-semibold"
                href={`tel:${listing.agentPhone}`}
              >
                Appeler
              </a>
              <a
                className="bg-[#C8553D] px-4 py-3 text-center text-sm font-semibold"
                href={`https://wa.me/${phoneDigits}`}
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="border border-[#14213D]/15 bg-white p-7">
            <h2 className="font-serif text-3xl">Je suis intéressé</h2>
            <div className="mt-6">
              <ListingLeadForm listingId={listing.id} title={listing.title} />
            </div>
          </div>
        </aside>
      </section>
      {similar.length > 0 && (
        <section className="bg-[#E9DCC3]/45 px-5 py-20 md:px-10">
          <div className="mx-auto max-w-[1280px]">
            <h2 className="font-serif text-4xl md:text-5xl">Biens similaires</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {similar.map((item) => (
                <PropertyCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#FAF8F4] p-5">
      <span className="block text-xs uppercase tracking-wider text-[#14213D]/50">{label}</span>
      <strong className="mt-2 block text-lg">{value}</strong>
    </div>
  )
}
