# staff-on-time-web

Single Next.js 15 (App Router) + React 19 + TypeScript full-stack app for the "staffontime" staffing agency. One process serves frontend pages and `/api/*` routes. Package manager is npm.

## Cursor Cloud specific instructions

Dependencies (`npm install`) are refreshed automatically by the startup update script; you do not need to reinstall them.

### Services

- Single service: the Next.js dev server. Start with `npm run dev` (serves http://localhost:3000, frontend + API routes). Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`).

### Non-obvious caveats

- Linting: `npm run lint` (bare `eslint`) FAILS under ESLint 9 because the repo still uses a legacy `.eslintrc.json` (flat config is now the default). Run lint with `ESLINT_USE_FLAT_CONFIG=false npx eslint .` instead. This is a repo config quirk, not an environment problem.
- External secrets are required for the full backend flows and are NOT part of dependency setup. Set them in `.env.local`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_ADMIN_NOTIFY`, `ADMIN_PASSWORD`. Without them the marketing site (`/`, `/impressum`) and the candidate form UI (`/bewerbung`) render and accept input, but interview slot loading spins forever (needs Supabase) and final submit fails (needs Supabase + Resend). The admin dashboard (`/admin`) also needs `ADMIN_PASSWORD` + Supabase.
- Static media under `/assets/*` (hero videos, OG image) is referenced but not committed, so those requests 404 locally — harmless.
