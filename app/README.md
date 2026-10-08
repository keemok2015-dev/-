# كورة لايف

An Arabic, right-to-left football match dashboard. It features a dark navy and emerald interface, current and upcoming fixtures from ESPN for major world leagues (Saudi Pro League, Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, MLS, Brazilian Serie A, Liga MX), team crests, Arabic dates and times, league filters, search, and session-only favorites. Fully responsive for iPhone, Android, and Web with bottom navigation on mobile.

## Technologies

React 19, TypeScript, TanStack Start and Router, Vite, Tailwind CSS 4 with custom responsive CSS, and Lucide icons. TanStack server functions fetch provider data without browser CORS dependencies. Netlify's TanStack Start Vite integration handles deployment, and Netlify Image CDN optimizes team crests. IBM Plex Sans Arabic is loaded from Google Fonts, with a sans-serif fallback.

## Run locally

Use Node.js 22 and pnpm. Install dependencies with `pnpm install`, then run `netlify dev --port 8889` to access the project at `http://localhost:8889`. The Netlify CLI uses the configured Vite development command internally.

## Scope of this version

Fixtures, scores, match status, kickoff times, and available crests are fetched from the ESPN soccer scoreboard service at request time. The server queries the current date, nearby dates, and up to three upcoming matchdays from each league's calendar within the next 30 days. Results are deduplicated and sorted, live matches first. Completed, cancelled, postponed, suspended, and past scheduled fixtures are excluded. A rolling four-hour live-match window also prevents stale in-progress events lingering indefinitely.

The dashboard refreshes every 60 seconds while visible, refreshes when the user returns to it, and offers manual refresh. Source failures appear explicitly, with partial-league warnings or empty/error states; old sample fixtures are never a fallback. ESPN is a third-party public data service without a guaranteed availability or update cadence for this project. A provider delay can affect live scores. This is polling, not a real-time streaming connection.

Dates and times use Arabic digits and Arabic morning/evening indicators through Intl.DateTimeFormat. Saudi Arabia time is the explicit default; users can switch to their device's time zone. Kickoff dates are displayed rather than labelling future matches as today. Unconfirmed kickoff times are clearly marked. Known club names have Arabic translations; unknown names remain as supplied by the provider.

Team logos are taken from provider data and allowlisted to ESPN's crest CDN. Netlify Image CDN is tried first, then the original image; a labelled shield fallback appears if the crest is unavailable. Channel names are shown only if supplied and may refer to a different broadcast region. Channel buttons display information, not a video stream or an invented viewing link. No payment processor, authentication, or actual push notification service is connected.

Favorites, notification toggles, and the subscription preview are intentionally temporary UI state and reset when the page reloads. There is no persistent user data or database connection in this version. Any future persistent preferences must use Netlify Database rather than browser storage or local files.

## Structure

- `src/routes/index.tsx`: route loader, dashboard, polling, filtering, preferences, and dialogs.
- `src/components/MatchCard.tsx`: team crests, scores, Arabic kickoff dates/times, and match actions.
- `src/components/TeamBadge.tsx`: crest delivery and accessible image-error fallback.
- `src/lib/matches.ts`: shared types, league configuration, Arabic formatting, and current-match filtering.
- `src/server/matches.functions.ts`: validated server function wrapper.
- `src/server/matches.server.ts`: bounded provider requests, normalization, translation, deduplication, and status filtering.
- `src/routes/__root.tsx`: Arabic document shell, product metadata, font, and favicon.
- `src/styles.css`: visual theme, responsive layout, focus states, and reduced-motion support.
- `public/favicon.svg`: product favicon.
- `netlify.toml`: deployment and local development configuration.

The deployment platform runs the production build automatically. No local build, development server, or test command was run during implementation.


## لوحة المالك والأرباح

تمت إضافة دخول خاص بالمالك ولوحة أرباح محاكاة. قبل النشر اضبط متغير البيئة `ADMIN_PASSWORD` على Netlify/الخادم بقيمة قوية. لا تضع كلمة المرور داخل `VITE_*` ولا داخل كود الواجهة.

لوحة الأرباح تجريبية ولا تنفذ تحويلات بنكية حقيقية.
