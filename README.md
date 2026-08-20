# Agriarche H1 2026 Board Paper (Web)

Confidential single-page board paper for Agriarche Limited's H1 2026 Performance Review.

## Setup

```bash
npm install
cp .env.example .env.local
# Set BOARD_PASSPHRASE
npm run dev
```

Open `http://localhost:3000` — unauthenticated requests are rewritten to the gate.

## Content updates

All copy and figures live in `content/board-paper.ts`. Update that file when H2 figures arrive.

**PDF reconciliation:** Prose and tables in `content/board-paper.ts` are reconciled against `Board_Paper.pdf` / `Board_Paper.md` (`DOC_VERSION = h1-2026-board-paper-pdf-v1`). Figures match the PDF; typo fixes applied per brief (Net Loss After Tax, volatility, Mitera, Zonkwa). YoY donut segment weights remain placeholders — the source deck uses a chart image without labelled percentages. Annex Impact Communities prose says "8 states" but lists nine — verify with client.

## Environment

| Variable | Purpose |
|---|---|
| `BOARD_PASSPHRASE` | Shared gate passphrase |
| `NEXT_PUBLIC_ANNOTATION_STORE` | `api` (default, shared), `local` (device-only), or `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for `/api/annotations` (preferred) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional fallback / direct client mode |

## Shared comments (backend)

With `NEXT_PUBLIC_ANNOTATION_STORE=api`, comments go through session-gated routes:

- `GET/POST /api/annotations`
- `PATCH/DELETE /api/annotations/[id]`

**Without Supabase**, the API stores comments in `data/annotations.json` on the server (shared for everyone using that same running instance).

**With Supabase** (recommended for production / multi-host):

1. Create a Supabase project
2. Run `supabase/migrations/20260820120000_annotations.sql` in the SQL editor
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
4. Restart the app

Only users who pass the board passphrase can read or write comments.

## Security — honest caveat

Crawler blocking (`robots.txt`, `X-Robots-Tag`, user-agent blocklist, honeypot, rate limits) stops **compliant** crawlers and casual scraping. It does **not** stop a determined scraper with a browser and credentials.

The **passphrase gate** is the real control. Treat all other measures as defence in depth.

## Tokens invented (Figma silent)

Signed-off additions documented in `styles/tokens.css`:

- **Brand palette:** `--color-brand-orange` (#F49425), `--color-brand-green` (#008850), `--color-brand-rust` (#E05206), `--color-brand-gold` (#FCD116), `--color-brand-brown` (#673B07), `--color-brand-gray` (#76777A)
- **Revenue ring:** brand SVG at `public/brand/revenue-ring.svg` — used as the H1 YoY pie chart
- **Variance:** favourable/unfavourable use brand green and rust — variance figures and arrows only
- **Annotations:** cool blue family (`--color-highlight-fill`, etc.)
- **TOC active:** brand green highlight — no pill
- Interaction states, layout chrome, gate, watermark, print overrides
