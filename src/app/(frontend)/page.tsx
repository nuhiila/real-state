import Image from 'next/image'
import Link from 'next/link'
import { Header, ContactStrip } from '@/components/SiteChrome'
import PropertyCard from '@/components/PropertyCard'
import { getListings } from '@/lib/listings'

export default async function HomePage() {
  const listings = await getListings()
  const featured = listings.filter((item) => item.featured).slice(0, 3)
  const heroPhoto = typeof listings[0]?.photos?.[0] === 'object' ? listings[0].photos[0] : null
  return (
    <main>
      <section className="relative flex min-h-[760px] items-end overflow-hidden bg-[#14213D] px-5 pb-16 pt-32 text-white md:min-h-[820px] md:px-10 md:pb-20">
        <Header />
        {heroPhoto?.url && (
          <Image
            src={heroPhoto.url}
            alt="Vue architecturale d'une résidence à Casablanca"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] via-[#14213D]/20 to-[#14213D]/35" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#E9DCC3]">
            L&apos;immobilier, avec justesse
          </p>
          <h1 className="max-w-4xl font-serif text-[clamp(3.2rem,8vw,7.4rem)] leading-[0.92]">
            Votre adresse à Casablanca.
          </h1>
          <form
            action="/biens"
            className="mt-10 grid bg-[#FAF8F4] p-3 text-[#14213D] shadow-2xl md:grid-cols-[1fr_1fr_1.2fr_auto] md:gap-2"
          >
            <label className="border-b border-[#14213D]/15 px-4 py-3 md:border-b-0 md:border-r">
              Projet
              <select
                className="mt-1 block w-full bg-transparent py-1 font-normal"
                name="transaction"
              >
                <option value="vente">Acheter</option>
                <option value="location">Louer</option>
              </select>
            </label>
            <label className="border-b border-[#14213D]/15 px-4 py-3 md:border-b-0 md:border-r">
              Ville
              <select className="mt-1 block w-full bg-transparent py-1 font-normal" name="quartier">
                <option value="">Casablanca — tous les quartiers</option>
                <option>Maarif</option>
                <option>Anfa</option>
                <option>Gauthier</option>
                <option>Ain Diab</option>
                <option>Bouskoura</option>
              </select>
            </label>
            <label className="px-4 py-3">
              Budget maximum
              <input
                className="mt-1 block w-full bg-transparent py-1 font-normal"
                name="budget"
                type="number"
                placeholder="Ex. 3 000 000 MAD"
              />
            </label>
            <button className="bg-[#C8553D] px-7 py-4 font-semibold text-white">Rechercher</button>
          </form>
        </div>
      </section>

      <section id="agence" className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8553D]">
            Atlas Immo · Casablanca
          </p>
          <div>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              Une connaissance intime de la ville. Un conseil franc à chaque étape.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#14213D]/65">
              Agence indépendante, Atlas Immo réunit expertise locale, sélection exigeante et
              accompagnement personnel. Nous ne cherchons pas simplement un bien : nous trouvons
              l&apos;adresse qui correspond à votre vie.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#14213D] px-5 py-20 text-white md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-px bg-white/15 md:grid-cols-3">
            {[
              [
                '01',
                'Acheter',
                'Une sélection claire et des visites ciblées, du premier échange à la remise des clés.',
                '/biens?transaction=vente',
              ],
              [
                '02',
                'Vendre',
                'Une estimation juste, une présentation soignée et un suivi transparent.',
                '/confier-mon-bien',
              ],
              [
                '03',
                'Louer',
                'Des adresses vérifiées et une installation sereine dans le bon quartier.',
                '/biens?transaction=location',
              ],
            ].map(([n, title, copy, href]) => (
              <Link
                key={title}
                href={href}
                className="bg-[#14213D] p-8 transition hover:bg-white/5 md:p-12"
              >
                <span className="text-xs text-[#E9DCC3]">{n}</span>
                <h3 className="mt-16 font-serif text-4xl">{title}</h3>
                <p className="mt-4 leading-7 text-white/60">{copy}</p>
                <span className="mt-8 inline-block border-b border-[#C8553D] pb-1 text-sm">
                  Découvrir
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#C8553D]">
                Notre sélection
              </p>
              <h2 className="font-serif text-4xl md:text-6xl">Biens à la une</h2>
            </div>
            <Link className="hidden border-b border-[#14213D] pb-1 text-sm md:block" href="/biens">
              Voir tous les biens
            </Link>
          </div>
          <div className="grid gap-x-7 gap-y-12 md:grid-cols-3">
            {featured.map((item) => (
              <PropertyCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E9DCC3]/60 px-5 py-24 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#C8553D]">
            Vivre Casablanca
          </p>
          <h2 className="font-serif text-4xl md:text-6xl">Cinq quartiers, cinq façons de vivre.</h2>
          <div className="mt-12 grid gap-px bg-[#14213D]/15 md:grid-cols-5">
            {['Maarif', 'Anfa', 'Gauthier', 'Ain Diab', 'Bouskoura'].map((name, i) => (
              <Link
                key={name}
                className="group flex min-h-48 flex-col justify-between bg-[#FAF8F4] p-6 transition hover:bg-[#14213D] hover:text-white"
                href={`/biens?quartier=${encodeURIComponent(name)}`}
              >
                <span className="text-xs text-[#C8553D]">0{i + 1}</span>
                <span className="font-serif text-2xl">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C8553D]">
            Ils nous ont fait confiance
          </p>
          <blockquote className="mt-8 font-serif text-3xl leading-snug md:text-5xl">
            “Atlas Immo a compris notre projet avant même que nous sachions l&apos;exprimer. Une
            écoute rare et un accompagnement impeccable.”
          </blockquote>
          <p className="mt-8 text-sm font-semibold">Nadia & Karim · Installation à Anfa</p>
        </div>
      </section>
      <ContactStrip />
    </main>
  )
}
