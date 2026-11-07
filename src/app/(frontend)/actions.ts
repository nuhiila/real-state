'use server'

import { getPayloadClient } from '@/lib/payload'

export type LeadState = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

const initialError = (message: string, errors?: Record<string, string>): LeadState => ({
  success: false,
  message,
  errors,
})

function text(data: FormData, key: string, max = 1000) {
  const value = data.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function validateContact(name: string, phone: string, email: string) {
  const errors: Record<string, string> = {}
  if (name.length < 2) errors.name = 'Indiquez votre nom complet.'
  if (!/^[+()\d\s-]{8,20}$/.test(phone)) errors.phone = 'Indiquez un numéro de téléphone valide.'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Indiquez une adresse e-mail valide.'
  return errors
}

export async function submitListingLead(_state: LeadState, data: FormData): Promise<LeadState> {
  const name = text(data, 'name', 120)
  const phone = text(data, 'phone', 30)
  const email = text(data, 'email', 160)
  const message = text(data, 'message', 2000)
  const listing = text(data, 'listing', 80)
  const errors = validateContact(name, phone, email)
  if (!listing) errors.listing = 'Le bien sélectionné est introuvable.'
  if (Object.keys(errors).length) return initialError('Vérifiez les champs indiqués.', errors)

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'leads',
      overrideAccess: false,
      data: { kind: 'listing', name, phone, email: email || undefined, message, listing },
    })
    return { success: true, message: 'Merci. Un conseiller vous rappelle sous peu.' }
  } catch {
    return initialError("Votre demande n'a pas pu être envoyée. Appelez-nous au +212 522 22 18 40.")
  }
}

export async function submitOwnerLead(_state: LeadState, data: FormData): Promise<LeadState> {
  const name = text(data, 'name', 120)
  const phone = text(data, 'phone', 30)
  const email = text(data, 'email', 160)
  const propertyType = text(data, 'propertyType', 40)
  const address = text(data, 'address', 240)
  const area = Number(text(data, 'area', 12))
  const expectedPrice = Number(text(data, 'expectedPrice', 16))
  const message = text(data, 'message', 2000)
  const errors = validateContact(name, phone, email)
  if (!['appartement', 'villa', 'terrain', 'bureau'].includes(propertyType))
    errors.propertyType = 'Choisissez un type de bien.'
  if (address.length < 5) errors.address = "Indiquez l'adresse du bien."
  if (!Number.isFinite(area) || area <= 0) errors.area = 'Indiquez une surface valide.'
  if (!Number.isFinite(expectedPrice) || expectedPrice <= 0)
    errors.expectedPrice = 'Indiquez un prix souhaité valide.'
  if (Object.keys(errors).length) return initialError('Vérifiez les champs indiqués.', errors)

  try {
    const payload = await getPayloadClient()
    const photoIds: string[] = []
    const files = data
      .getAll('photos')
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, 8)
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8_000_000) {
        return initialError(
          'Chaque photo doit être au format JPG, PNG ou WebP et peser moins de 8 Mo.',
          { photos: 'Format ou taille non autorisé.' },
        )
      }
      const photo = await payload.create({
        collection: 'property-photos',
        overrideAccess: false,
        data: { alt: `Photo du bien confié par ${name}` },
        file: {
          data: Buffer.from(await file.arrayBuffer()),
          mimetype: file.type,
          name: file.name.replace(/[^a-zA-Z0-9._-]/g, '-'),
          size: file.size,
        },
      })
      photoIds.push(photo.id)
    }
    await payload.create({
      collection: 'leads',
      overrideAccess: false,
      data: {
        kind: 'owner',
        name,
        phone,
        email: email || undefined,
        propertyType,
        address,
        area,
        expectedPrice,
        message,
        photos: photoIds,
      },
    })
    return {
      success: true,
      message: 'Votre bien nous a bien été confié. Notre équipe vous contacte sous 24 h.',
    }
  } catch {
    return initialError("Votre demande n'a pas pu être envoyée. Appelez-nous au +212 522 22 18 40.")
  }
}
