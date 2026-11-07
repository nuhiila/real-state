import Link from 'next/link'

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/15 text-white">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Link className="flex items-center gap-3" href="/" aria-label="Atlas Immo, accueil">
          <span className="grid size-10 place-items-center border border-white/50 font-serif text-lg">
            AI
          </span>
          <span className="text-lg font-semibold tracking-[0.14em]">ATLAS IMMO</span>
        </Link>
        <nav
          className="hidden items-center gap-7 text-sm font-medium md:flex"
          aria-label="Navigation principale"
        >
          <Link href="/biens">Acheter</Link>
          <Link href="/biens?transaction=location">Louer</Link>
          <Link href="/confier-mon-bien">Vendre</Link>
          <Link href="/#agence">L&apos;agence</Link>
        </nav>
        <Link
          className="border border-white/50 px-4 py-2 text-sm font-semibold transition hover:bg-white hover:text-[#14213D]"
          href="/confier-mon-bien"
        >
          Confier mon bien
        </Link>
      </div>
    </header>
  )
}

export function DarkHeader() {
  return (
    <div className="relative h-20 bg-[#14213D]">
      <Header />
    </div>
  )
}

export function Footer() {
  return (
    <>
      <footer className="bg-[#14213D] px-5 pb-28 pt-16 text-white md:px-10 md:pb-12">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl">Atlas Immo</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              Votre agence immobilière indépendante à Casablanca, pour acheter, vendre et louer en
              toute confiance.
            </p>
          </div>
          <div className="text-sm leading-7">
            <p className="font-semibold text-[#E9DCC3]">Navigation</p>
            <Link className="block" href="/biens">
              Nos biens
            </Link>
            <Link className="block" href="/confier-mon-bien">
              Confier mon bien
            </Link>
            <Link className="block" href="/admin">
              Espace équipe
            </Link>
          </div>
          <address className="not-italic text-sm leading-7 text-white/75">
            <p className="font-semibold text-[#E9DCC3]">Atlas Immo Casablanca</p>
            18, Boulevard d&apos;Anfa, Casablanca 20050
            <br />
            <a href="tel:+212522221840">+212 522 22 18 40</a>
            <br />
            bonjour@atlasimmo.ma
          </address>
        </div>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-black/10 bg-white p-2 md:hidden">
        <a
          className="grid min-h-12 place-items-center font-semibold text-[#14213D]"
          href="tel:+212522221840"
        >
          Appeler
        </a>
        <a
          className="grid min-h-12 place-items-center bg-[#C8553D] font-semibold text-white"
          href="https://wa.me/212522221840"
        >
          WhatsApp
        </a>
      </div>
    </>
  )
}

export function ContactStrip() {
  return (
    <section className="bg-[#E9DCC3] px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C8553D]">
            Un projet à Casablanca ?
          </p>
          <h2 className="max-w-2xl font-serif text-3xl text-[#14213D] md:text-5xl">
            Parlons de votre prochain lieu de vie.
          </h2>
        </div>
        <a
          className="bg-[#14213D] px-6 py-4 font-semibold text-white"
          href="https://wa.me/212522221840"
        >
          Écrire sur WhatsApp
        </a>
      </div>
    </section>
  )
}
