'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Listing } from '@/payload-types'
import PropertyCard from '@/components/PropertyCard'

export default function ListingsCatalogue({ listings }: { listings: Listing[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const transaction = params.get('transaction') ?? ''
  const type = params.get('type') ?? ''
  const neighborhood = params.get('quartier') ?? ''
  const rooms = Number(params.get('pieces') ?? 0)
  const budget = Number(params.get('budget') ?? 15000000)
  const sort = params.get('tri') ?? 'recent'
  const view = params.get('vue') ?? 'liste'

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(`/biens?${next.toString()}`, { scroll: false })
  }

  const filtered = useMemo(() => {
    const result = listings.filter(
      (item) =>
        (!transaction || item.transaction === transaction) &&
        (!type || item.propertyType === type) &&
        (!neighborhood || item.neighborhood === neighborhood) &&
        (!rooms || item.rooms >= rooms) &&
        item.price <= budget,
    )
    return [...result].sort((a, b) =>
      sort === 'prix-croissant'
        ? a.price - b.price
        : sort === 'prix-decroissant'
          ? b.price - a.price
          : b.createdAt.localeCompare(a.createdAt),
    )
  }, [listings, transaction, type, neighborhood, rooms, budget, sort])

  const neighborhoods = [...new Set(listings.map((item) => item.neighborhood))].sort()

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit border border-[#14213D]/15 bg-white p-5 lg:sticky lg:top-5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Filtres</h2>
            <button className="text-sm underline" onClick={() => router.replace('/biens')}>
              Effacer
            </button>
          </div>
          <div className="space-y-5">
            <label>
              Transaction
              <select
                className="form-input"
                value={transaction}
                onChange={(e) => update('transaction', e.target.value)}
              >
                <option value="">Toutes</option>
                <option value="vente">Achat</option>
                <option value="location">Location</option>
              </select>
            </label>
            <label>
              Type de bien
              <select
                className="form-input"
                value={type}
                onChange={(e) => update('type', e.target.value)}
              >
                <option value="">Tous</option>
                <option value="appartement">Appartement</option>
                <option value="villa">Villa</option>
                <option value="terrain">Terrain</option>
                <option value="bureau">Bureau</option>
              </select>
            </label>
            <label>
              Quartier
              <select
                className="form-input"
                value={neighborhood}
                onChange={(e) => update('quartier', e.target.value)}
              >
                <option value="">Casablanca — tous</option>
                {neighborhoods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Budget maximum{' '}
              <span className="block text-sm font-normal text-[#14213D]/60">
                {new Intl.NumberFormat('fr-MA').format(budget)} MAD
              </span>
              <input
                className="mt-3 w-full accent-[#C8553D]"
                type="range"
                min="5000"
                max="15000000"
                step="50000"
                value={budget}
                onChange={(e) => update('budget', e.target.value)}
              />
            </label>
            <label>
              Pièces minimum
              <select
                className="form-input"
                value={rooms || ''}
                onChange={(e) => update('pieces', e.target.value)}
              >
                <option value="">Indifférent</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </label>
          </div>
        </aside>
        <section>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#14213D]/15 pb-5">
            <p>
              <strong>{filtered.length}</strong> biens à Casablanca
            </p>
            <div className="flex items-center gap-3">
              <select
                className="border border-[#14213D]/20 bg-transparent px-3 py-2 text-sm"
                value={sort}
                onChange={(e) => update('tri', e.target.value)}
                aria-label="Trier les résultats"
              >
                <option value="recent">Plus récents</option>
                <option value="prix-croissant">Prix croissant</option>
                <option value="prix-decroissant">Prix décroissant</option>
              </select>
              <div className="flex border border-[#14213D]/20">
                <button
                  className={`px-3 py-2 text-sm ${view === 'liste' ? 'bg-[#14213D] text-white' : ''}`}
                  onClick={() => update('vue', 'liste')}
                >
                  Liste
                </button>
                <button
                  className={`px-3 py-2 text-sm ${view === 'carte' ? 'bg-[#14213D] text-white' : ''}`}
                  onClick={() => update('vue', 'carte')}
                >
                  Carte
                </button>
              </div>
            </div>
          </div>
          {view === 'carte' ? (
            <div className="relative min-h-[620px] overflow-hidden rounded-[24px] bg-[#E9DCC3]">
              <iframe
                className="absolute inset-0 h-full w-full border-0 grayscale-[20%]"
                title="Carte des biens Atlas Immo à Casablanca"
                loading="lazy"
                src="https://www.google.com/maps?q=Casablanca%2C%20Morocco&z=12&output=embed"
              />
              <div className="absolute bottom-5 left-5 max-w-sm bg-white p-5 shadow-xl">
                <strong>{filtered.length} biens</strong>
                <p className="mt-1 text-sm text-[#14213D]/65">
                  Affinez les filtres pour explorer les quartiers de Casablanca.
                </p>
              </div>
            </div>
          ) : filtered.length ? (
            <div className="grid gap-x-7 gap-y-12 md:grid-cols-2">
              {filtered.map((item) => (
                <PropertyCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#14213D]/30 p-12 text-center">
              <h2 className="font-serif text-3xl">Aucun bien ne correspond</h2>
              <p className="mt-3 text-[#14213D]/65">
                Élargissez votre budget ou retirez un filtre.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
