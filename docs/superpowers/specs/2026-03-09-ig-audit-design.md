# Instagram Audit Tool — Technical Design

> **Status:** Approved (product definition complete)
> **Source:** Definicion_IG_Audit_completa.docx

## Goal

Build a public web tool that analyzes Instagram business profiles, calculates a 0-100 score against sector benchmarks, captures leads via gated results, and converts users to BeweOS 15-day free trials.

## Architecture

Next.js 15 App Router with server-side API routes protecting external API keys (Apify, Supabase, HubSpot/N8N). Frontend uses Hexagonal Architecture per feature with Vertical Slices UI pattern. All UI built with Aurora UI (HeroUI proxy) + Tailwind CSS following BeweOS design system.

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **UI:** @beweco/aurora-ui, @heroui/react, Tailwind CSS 3.4, Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Data:** Apify Instagram Profile Scraper
- **CRM:** HubSpot via N8N webhooks
- **Deploy:** Vercel
- **Fonts:** Inter (primary), Merriweather (secondary)
- **Icons:** Solar Icon Set (Outline, 1.5px, 24x24)

## Feature Structure (Hexagonal + Vertical Slices)

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              → Landing/Input screen
│   ├── audit/
│   │   └── [username]/
│   │       └── page.tsx      → Loading → Capture → Results
│   └── api/
│       ├── audit/route.ts    → Apify call + score calculation + Supabase
│       └── lead/route.ts     → Lead capture → Supabase + N8N/HubSpot
├── features/
│   └── audit/
│       ├── domain/           → Interfaces, types, score calculation logic
│       ├── application/      → Use cases (runAudit, captureLead, getEvolution)
│       ├── infrastructure/   → Apify adapter, Supabase adapter, N8N adapter
│       └── ui/
│           ├── _shared/      → Shared audit components
│           ├── input/        → Username input + landing
│           ├── loading/      → Animated loading screen
│           ├── capture/      → Blurred score + unlock form
│           ├── results/      → Ruta Diagnóstico (6 blocks)
│           ├── results-arranque/  → Ruta Arranque (3 blocks)
│           └── results-evolucion/ → Modo Evolución (5 blocks)
├── shared/
│   └── ui/
│       ├── components/       → Generic reusable components
│       ├── providers/        → HeroUI provider
│       ├── hooks/            → Shared hooks
│       └── styles/           → Global styles
└── locales/
    ├── es/                   → Spanish translations
    └── pt/                   → Portuguese translations
```

## User Flow (4 Screens)

1. **Landing** → Input username → POST /api/audit
2. **Loading** → 10-30s animated, adaptive messages
3. **Capture** → Blurred score + visible level badge + form (name, email, phone)
4. **Results** → Route based on data sufficiency:
   - ≥10 posts + previous audit >30 days → Modo Evolución
   - ≥10 posts, no previous → Ruta Diagnóstico
   - <10 posts → Ruta Arranque

## Score System

- **ER** (40%): (likes + comments of last 10 posts) / followers × 100
- **CR** (35%): avg(comments/likes) per post
- **RVR** (25%): sum(video views) / followers × 100
- Normalize each vs sector benchmark, cap at 1.0, multiply by weight, scale to 100
- No Reels → ER: 57%, CR: 43%

## API Routes

- `POST /api/audit` → Receives username, calls Apify, calculates score, stores in Supabase, returns audit data
- `POST /api/lead` → Receives form data, stores lead in Supabase, triggers N8N webhook for HubSpot

## Security & Constraints

- Rate limiting: 5 audits/IP/hour
- 1 audit/email/30 days
- All API keys server-side only (env vars)
- GDPR consent text on form
- 45s timeout on Apify calls
