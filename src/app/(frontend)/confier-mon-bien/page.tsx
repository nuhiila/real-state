import type { Metadata } from 'next'
import { DarkHeader } from '@/components/SiteChrome'
import { OwnerLeadForm } from '@/components/LeadForm'

export const metadata: Metadata = {
  title: 'Confier mon bien à Casablanca | Atlas Immo',
  description:
    "Faites estimer et vendre ou louer votre bien à Casablanca avec l'accompagnement personnalisé d'Atlas Immo.",
}

export default function OwnerPage() {
  return (
    <main>
      <DarkHeader />
      <section className="bg-[#E9DCC3]/55 px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C8553D]">
              Vendre ou louer
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">
              Confiez-nous votre bien.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-[#14213D]/65">
              Nous vous répondons sous 24 heures avec une première lecture du marché et organisons
              une estimation confidentielle sur place.
            </p>
            <div className="mt-10 border-t border-[#14213D]/20 pt-7 text-sm leading-7">
              <strong>Atlas Immo</strong>
              <br />
              18, Boulevard d&apos;Anfa, Casablanca
              <br />
              +212 522 22 18 40
            </div>
          </div>
          <OwnerLeadForm />
        </div>
      </section>
    </main>
  )
}
