import path from 'path'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr as adminLanguage } from '@payloadcms/translations/languages/fr'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Listings } from './collections/Listings'
import { Leads } from './collections/Leads'
import { PropertyPhotos } from './collections/PropertyPhotos'

const databaseUrl = process.env.DATABASE_URL || ''
const usePostgres = /^postgres(ql)?:\/\//.test(databaseUrl)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-.env-please-use-a-long-random-string',
  // Local dev: SQLite file. Production (Vercel): set DATABASE_URL to a postgres:// URL.
  db: usePostgres
    ? postgresAdapter({ pool: { connectionString: databaseUrl }, push: true })
    : sqliteAdapter({ client: { url: databaseUrl || 'file:./atlas-immo.db' } }),
  editor: lexicalEditor(),
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr: adminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, PropertyPhotos, Listings, Leads],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'ar', label: 'العربية', rtl: true },
    ],
    fallback: true,
    defaultLocale: 'fr',
  },
  storage: [
    // Uploaded images go to Vercel Blob in production (Vercel has no persistent disk).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, 'property-photos': true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
