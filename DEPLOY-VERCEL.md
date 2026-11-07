# Deploy to Vercel with GitHub Actions

1. Database: create a free Postgres on https://neon.tech (or Supabase). Copy the connection string (postgres://...).
2. Vercel: https://vercel.com -> Add New Project -> import the GitHub repo.
   - Storage tab -> create a **Blob** store and connect it (adds BLOB_READ_WRITE_TOKEN).
   - Settings -> Environment Variables (Production):
       DATABASE_URL        = your Postgres connection string
       PAYLOAD_SECRET      = long random text
       NEXT_PUBLIC_SITE_URL= https://your-project.vercel.app  (optional)
3. Get IDs: in the project folder run  `npx vercel link`  then open `.vercel/project.json`
   -> copy "orgId" and "projectId".
4. Token: https://vercel.com/account/tokens -> create a token.
5. GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret:
       VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
6. Push to `main`. The workflow in .github/workflows/deploy.yml builds and deploys.
7. Open https://your-project.vercel.app/admin and create your admin account.

Tip: in Vercel -> Settings -> Git, disconnect automatic Git deployments so only
GitHub Actions deploys (avoids double deploys).
