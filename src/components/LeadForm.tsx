'use client'

import { useActionState } from 'react'
import { submitListingLead, submitOwnerLead, type LeadState } from '@/app/(frontend)/actions'

const initialState: LeadState = { success: false, message: '' }

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-red-700">{message}</p> : null
}

export function ListingLeadForm({ listingId, title }: { listingId: string; title: string }) {
  const [state, action, pending] = useActionState(submitListingLead, initialState)
  if (state.success)
    return (
      <div className="border-l-4 border-[#C8553D] bg-[#E9DCC3]/50 p-5 font-medium text-[#14213D]">
        {state.message}
      </div>
    )
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="listing" value={listingId} />
      <p className="text-sm text-[#14213D]/65">À propos de : {title}</p>
      <label>
        Nom complet
        <input className="form-input" name="name" required autoComplete="name" />
      </label>
      <FieldError message={state.errors?.name} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label>
            Téléphone
            <input
              className="form-input"
              name="phone"
              required
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <FieldError message={state.errors?.phone} />
        </div>
        <div>
          <label>
            E-mail
            <input className="form-input" name="email" type="email" autoComplete="email" />
          </label>
          <FieldError message={state.errors?.email} />
        </div>
      </div>
      <label>
        Message
        <textarea
          className="form-input min-h-28"
          name="message"
          defaultValue={`Bonjour, je souhaite recevoir plus d'informations sur ${title}.`}
        />
      </label>
      {state.message && (
        <p className="text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}
      <button
        className="w-full bg-[#C8553D] px-5 py-4 font-semibold text-white disabled:opacity-60"
        disabled={pending}
      >
        {pending ? 'Envoi en cours…' : 'Je suis intéressé'}
      </button>
    </form>
  )
}

export function OwnerLeadForm() {
  const [state, action, pending] = useActionState(submitOwnerLead, initialState)
  if (state.success)
    return (
      <div className="border-l-4 border-[#C8553D] bg-white p-7 text-lg font-medium text-[#14213D]">
        {state.message}
      </div>
    )
  return (
    <form action={action} className="grid gap-5 bg-white p-6 md:grid-cols-2 md:p-10" noValidate>
      <div>
        <label>
          Nom complet
          <input className="form-input" name="name" required />
        </label>
        <FieldError message={state.errors?.name} />
      </div>
      <div>
        <label>
          Téléphone
          <input className="form-input" name="phone" required inputMode="tel" />
        </label>
        <FieldError message={state.errors?.phone} />
      </div>
      <div className="md:col-span-2">
        <label>
          E-mail
          <input className="form-input" name="email" type="email" />
        </label>
        <FieldError message={state.errors?.email} />
      </div>
      <div>
        <label>
          Type de bien
          <select className="form-input" name="propertyType" defaultValue="">
            <option value="" disabled>
              Choisir
            </option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
            <option value="bureau">Bureau</option>
          </select>
        </label>
        <FieldError message={state.errors?.propertyType} />
      </div>
      <div>
        <label>
          Surface (m²)
          <input className="form-input" name="area" type="number" min="1" />
        </label>
        <FieldError message={state.errors?.area} />
      </div>
      <div className="md:col-span-2">
        <label>
          Adresse du bien
          <input className="form-input" name="address" />
        </label>
        <FieldError message={state.errors?.address} />
      </div>
      <div className="md:col-span-2">
        <label>
          Prix souhaité (MAD)
          <input className="form-input" name="expectedPrice" type="number" min="1" />
        </label>
        <FieldError message={state.errors?.expectedPrice} />
      </div>
      <div className="md:col-span-2">
        <label>
          Photos (8 maximum, 8 Mo chacune)
          <input
            className="form-input"
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
          />
        </label>
        <FieldError message={state.errors?.photos} />
      </div>
      <div className="md:col-span-2">
        <label>
          Informations complémentaires
          <textarea className="form-input min-h-28" name="message" />
        </label>
      </div>
      {state.message && (
        <p className="text-sm text-red-700 md:col-span-2" role="alert">
          {state.message}
        </p>
      )}
      <button
        className="bg-[#C8553D] px-6 py-4 font-semibold text-white disabled:opacity-60 md:col-span-2"
        disabled={pending}
      >
        {pending ? 'Envoi en cours…' : 'Demander une estimation'}
      </button>
    </form>
  )
}
