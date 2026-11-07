import Link from 'next/link'

/**
 * Custom not-found page for the frontend.
 * This renders when `notFound()` is called from any page in the (frontend) route group.
 *
 * Customize this component to match your app's design and provide helpful navigation.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-8 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8553D]">Erreur 404</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight">Cette adresse n&apos;existe pas.</h1>
      <p className="mt-4 text-zinc-600">
        Le bien que vous recherchez n&apos;est plus disponible ou la page a été déplacée.
      </p>
      <Link className="mt-8 bg-[#14213D] px-6 py-3 font-medium text-white" href="/biens">
        Voir tous les biens
      </Link>
    </main>
  )
}
