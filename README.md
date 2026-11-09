# LinguaTube

LinguaTube is a full-stack language-learning SaaS MVP that turns YouTube videos into interactive study sessions. Users can validate and load a YouTube URL, follow a synchronized transcript, seek by transcript line, reveal translations, customize the reading experience, and explore a complete Free/Pro demo flow.

The project works without paid APIs by using clearly labeled mock transcript and translation providers.

## Technology stack

- React 19, Vite, strict TypeScript, Tailwind CSS
- React Router, Framer Motion, Lucide React, Zustand, React Hot Toast
- Node.js, Express, Zod, Pino, Helmet, CORS, rate limiting
- Prisma/PostgreSQL-ready schema
- Redis-ready cache interface with an in-memory development implementation
- Vitest and Supertest
- npm workspaces and `concurrently`

## Workspace structure

```text
.
├── client/
│   ├── src/components/       Reusable UI and responsive layout
│   ├── src/features/         Video, transcript, auth, suggestions, subscription
│   ├── src/lib/              API client and pure utilities
│   ├── src/pages/            Routed pages
│   ├── src/store/            Focused Zustand stores
│   └── src/styles/           Semantic design tokens and global styles
├── server/
│   ├── prisma/               PostgreSQL-ready Prisma schema
│   ├── src/controllers/      HTTP request handlers
│   ├── src/middleware/       Validation, identity, errors, rate limiting
│   ├── src/providers/        Mock and real-provider abstractions
│   ├── src/routes/           `/api/v1` route modules
│   ├── src/services/         Application business logic
│   └── tests/                Unit and API integration tests
├── shared/
│   └── src/                  Shared API types and Zod contracts
└── package.json              Workspace scripts
```

## Installation

Requirements:

- Node.js 20.19 or newer
- npm 10 or newer

```bash
npm install
cp .env.example server/.env
npm run dev
```

Local services:

- Frontend: <http://127.0.0.1:5173>
- Backend: <http://127.0.0.1:4000>
- Health: <http://127.0.0.1:4000/api/v1/health>

Vite proxies `/api` requests to the Express server in development.

## Commands

```bash
npm run dev        # Build shared contracts and start client + server
npm run build      # Build all three workspaces
npm run test       # Run frontend, backend, and API tests
npm run lint       # Lint client and server
npm run typecheck  # Strict TypeScript validation
npm run format     # Format source files with Prettier
```

The repository includes a scoped `.npmrc` setting because npm 10.9 can crash while resolving Vitest's optional browser peer graph. Runtime peer versions remain explicitly declared and compatible.

## Environment configuration

See `.env.example` and `server/.env.example`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `CLIENT_URL` | `http://127.0.0.1:5173` | Allowed browser origin; comma-separate multiple origins |
| `PORT` | `4000` | Express API port |
| `NODE_ENV` | `development` | Runtime environment |
| `LOG_LEVEL` | `info` | Structured Pino log level |
| `TRANSCRIPT_PROVIDER` | `mock` | `mock` or a future `real` provider |
| `TRANSLATION_PROVIDER` | `mock` | `mock` or a future `real` provider |
| `FREE_DAILY_VIDEO_LIMIT` | `3` | Server-authoritative Free allowance |
| `YOUTUBE_API_KEY` | empty | Reserved for metadata/provider integrations |
| `DEEPL_API_KEY` | empty | Reserved for a real translation provider |
| `DATABASE_URL` | example PostgreSQL URL | Prisma integration target |
| `REDIS_URL` | empty | Future distributed cache target |
| `JWT_SECRET` | development fallback | Future JWT authentication secret |

Never expose server credentials through `VITE_*` variables.

## Product behavior

### YouTube player

The client supports `youtube.com/watch`, `youtu.be`, `/embed/`, and `/shorts/` URLs. Both client and server validate the URL and 11-character video ID. The player uses the official YouTube IFrame Player API for play/pause state, time tracking, duration, and seeking.

Internet access and an embeddable YouTube video are required for playback. Videos that disable embedding show a clear link to YouTube.

### Transcript synchronization

- Active transcript selection uses binary search rather than scanning every line.
- Playback updates highlight the active line.
- Auto-scroll occurs only when the active line changes.
- Clicking or keyboard-activating a line seeks the player.
- Arrow keys move focus between transcript lines.
- Typography, theme, opacity, content, and scrolling preferences persist through Zustand/localStorage.

### Mock providers

`MockTranscriptProvider` returns a deterministic learning transcript for development. It is deliberately labeled as demo content and is **not claimed to be extracted from the selected video**.

`MockTranslationProvider` returns curated French, Spanish, and Arabic translations for the sample transcript. Other supported targets return an explicit `[Mock Language]` result. Translations are cached through the cache-service abstraction.

### Free and Pro demo

Free users receive:

- Three unique video loads per UTC day
- Full original transcripts
- Five unlocked translation lines
- Basic transcript controls

Pro demo users receive unlimited loads, all translations, and advanced transcript controls. No payment is performed. The pricing and upgrade interfaces are functional product demos ready to be connected to Stripe later.

### Mock authentication

The login endpoint accepts a name and email and returns a deterministic mock user. State is persisted locally. An email ending in `@pro.demo` creates a Pro demo profile.

This identity mechanism and the `x-mock-*` headers are intentionally insecure and must be replaced before production.

## API

All responses use:

```json
{ "success": true, "data": {}, "error": null }
```

or:

```json
{
  "success": false,
  "data": null,
  "error": { "code": "VALIDATION_ERROR", "message": "Invalid request" }
}
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Service and provider health |
| `POST` | `/api/v1/video/parse` | Validate a YouTube URL, enforce limits, return metadata |
| `GET` | `/api/v1/transcript/:videoId` | Return normalized transcript lines |
| `POST` | `/api/v1/translate` | Translate and cache one line |
| `GET` | `/api/v1/suggestions` | Return curated video suggestions |
| `GET` | `/api/v1/user/limits` | Return server-side usage limits |
| `POST` | `/api/v1/auth/login` | Create a mock development identity |

The API includes Zod validation, strict CORS, Helmet headers, request rate limiting, structured logs, centralized errors, and appropriate status codes.

## Integrating real providers

### Transcript provider

1. Implement `TranscriptProvider` in `server/src/providers/transcript/`.
2. Retrieve captions through a legitimate provider or supported integration.
3. Normalize results into shared `TranscriptLine` records using seconds.
4. Preserve provider metadata for manual/automatic captions when available.
5. Select the implementation in `server/src/providers/index.ts`.

The YouTube IFrame API does not expose arbitrary transcript extraction. Any real integration must respect YouTube terms, copyright, and privacy requirements.

### Translation provider

1. Implement `TranslationProvider` in `server/src/providers/translation/`.
2. Keep credentials on the server.
3. Map provider errors into `AppError` codes.
4. Reuse the existing cache interface.
5. Configure selection through `TRANSLATION_PROVIDER`.

For Redis, implement `CacheService` and replace `MemoryCacheService` in the translation service.

## Database and production identity

The Prisma schema includes initial `User`, `UsageEvent`, and `TranslationCache` models. To activate it:

1. Set `DATABASE_URL`.
2. Run `npx prisma migrate dev` from the server workspace.
3. Replace the in-memory usage service with a transactional repository.
4. Replace mock login with an identity provider or secure password/JWT flow.
5. Derive subscription status from trusted database/payment records, never request headers.

## Adding feature pages

Speaking, Writing, Shadowing, and Pronunciation are intentionally honest placeholder routes. Add a lazy page under `client/src/pages`, isolate its logic under `client/src/features`, and register it in `App.tsx` and the shared navigation configuration.

## Testing

The suite covers:

- All supported YouTube URL formats and invalid hosts/IDs
- Binary active-line lookup and timestamp gaps
- Free/Pro translation visibility
- Settings persistence
- Daily limit enforcement, duplicate loads, reset behavior, and Pro limits
- Transcript, translation, authentication, validation, health, and error endpoints
- Translation caching and clear mock-provider labeling

## Known MVP limitations

- Mock transcripts are demo content rather than video-specific captions.
- Real transcript/translation integrations still require legitimate providers and credentials.
- Usage records and translation cache are in memory and reset when the API restarts.
- Mock identity and plan headers are not secure.
- Prisma models are prepared but not connected to runtime repositories.
- Payments, email verification, password authentication, and Stripe webhooks are not implemented.
- Word-level highlighting is disabled until a transcript provider supplies word timestamps.
