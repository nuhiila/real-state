import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === 'admins'

const refreshListingCaches = async ({
  doc,
  previousDoc,
}: {
  doc?: { slug?: string | null }
  previousDoc?: { slug?: string | null }
}) => {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('listings', 'max')
  if (doc?.slug) revalidateTag(`listing:${doc.slug}`, 'max')
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    revalidateTag(`listing:${previousDoc.slug}`, 'max')
  }
}

export const Listings: CollectionConfig = {
  slug: 'listings',
  labels: { singular: 'Bien', plural: 'Biens' },
  admin: {
    group: 'Immobilier',
    useAsTitle: 'title',
    defaultColumns: ['title', 'transaction', 'neighborhood', 'price', '_status'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) =>
      req.user?.collection === 'admins'
        ? true
        : {
            _status: { equals: 'published' },
          },
    update: isAdmin,
  },
  hooks: {
    afterChange: [refreshListingCaches],
    afterDelete: [refreshListingCaches],
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'slug',
      useAsSlug: 'title',
    },
    {
      name: 'transaction',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Vente', value: 'vente' },
        { label: 'Location', value: 'location' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'propertyType',
      label: 'Type de bien',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Appartement', value: 'appartement' },
        { label: 'Villa', value: 'villa' },
        { label: 'Terrain', value: 'terrain' },
        { label: 'Bureau', value: 'bureau' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'availability',
      label: 'Disponibilité',
      type: 'select',
      required: true,
      defaultValue: 'disponible',
      options: [
        { label: 'Disponible', value: 'disponible' },
        { label: 'Vendu', value: 'vendu' },
        { label: 'Loué', value: 'loue' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'city', type: 'text', required: true, defaultValue: 'Casablanca', index: true },
    { name: 'neighborhood', label: 'Quartier', type: 'text', required: true, index: true },
    { name: 'address', type: 'text', required: true },
    { name: 'price', label: 'Prix (MAD)', type: 'number', required: true, min: 0, index: true },
    { name: 'area', label: 'Surface (m²)', type: 'number', required: true, min: 1 },
    { name: 'rooms', label: 'Pièces', type: 'number', required: true, min: 0, index: true },
    { name: 'bedrooms', label: 'Chambres', type: 'number', min: 0 },
    { name: 'bathrooms', label: 'Salles de bain', type: 'number', min: 0 },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'features',
      label: 'Équipements',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true, localized: true }],
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'property-photos',
      hasMany: true,
      required: true,
    },
    { name: 'featured', label: 'À la une', type: 'checkbox', defaultValue: false },
    { name: 'latitude', type: 'number', defaultValue: 33.5731 },
    { name: 'longitude', type: 'number', defaultValue: -7.5898 },
    { name: 'agentName', label: 'Conseiller', type: 'text', defaultValue: 'Yasmine El Mansouri' },
    {
      name: 'agentPhone',
      label: 'Téléphone conseiller',
      type: 'text',
      defaultValue: '+212 522 22 18 40',
    },
    {
      name: 'metaTitle',
      label: 'Titre SEO',
      type: 'text',
      localized: true,
    },
    {
      name: 'metaDescription',
      label: 'Description SEO',
      type: 'textarea',
      localized: true,
    },
  ],
}
