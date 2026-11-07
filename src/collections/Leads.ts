import type { CollectionConfig, FieldAccess } from 'payload'

const isAdmin = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === 'admins'

const adminFieldAccess: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Demande', plural: 'Boîte de réception' },
  admin: {
    group: 'Prospects',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'phone', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'kind',
      label: 'Origine',
      type: 'select',
      required: true,
      options: [
        { label: 'Intérêt pour un bien', value: 'listing' },
        { label: 'Confier mon bien', value: 'owner' },
      ],
    },
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'phone', label: 'Téléphone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea' },
    { name: 'listing', label: 'Bien concerné', type: 'relationship', relationTo: 'listings' },
    { name: 'propertyType', label: 'Type de bien', type: 'text' },
    { name: 'address', label: 'Adresse', type: 'text' },
    { name: 'area', label: 'Surface (m²)', type: 'number', min: 0 },
    { name: 'expectedPrice', label: 'Prix souhaité (MAD)', type: 'number', min: 0 },
    {
      name: 'photos',
      label: 'Photos du propriétaire',
      type: 'upload',
      relationTo: 'property-photos',
      hasMany: true,
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'nouveau',
      access: {
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
      options: [
        { label: 'Nouveau', value: 'nouveau' },
        { label: 'Contacté', value: 'contacte' },
        { label: 'Clos', value: 'clos' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
