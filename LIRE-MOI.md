# Atlas Immo - run locally (Windows)

1. Install Node.js 22 or newer and pnpm (`npm.cmd install -g pnpm`).
2. In this folder:  `pnpm install`  then  `pnpm dev`
3. Site:  http://localhost:3000     Admin:  http://localhost:3000/admin
   (first visit to /admin: create your admin account)

Database = local file `atlas-immo.db` (created automatically). Settings are in `.env`.
Change PAYLOAD_SECRET in `.env` to your own long random text.
