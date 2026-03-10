# Instagram Audit Tool — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Instagram audit tool with score calculation, lead capture, and 3 result routes.
**Architecture:** Next.js 15 App Router + Hexagonal Architecture + Vertical Slices UI with Aurora UI components.
**Tech Stack:** Next.js, TypeScript, Tailwind, Aurora UI, Supabase, Apify, N8N/HubSpot, Framer Motion.

---

## File Structure

### Domain Layer
- `src/features/audit/domain/interfaces/audit.ts` — Core types (AuditResult, Score, Metrics, etc.)
- `src/features/audit/domain/interfaces/lead.ts` — Lead types
- `src/features/audit/domain/interfaces/benchmark.ts` — Benchmark types by sector
- `src/features/audit/domain/services/score-calculator.ts` — Pure score calculation logic
- `src/features/audit/domain/services/health-signals.ts` — 5 health signal calculations
- `src/features/audit/domain/services/route-resolver.ts` — Determine which route to show
- `src/features/audit/domain/constants/benchmarks.ts` — Benchmark data by sector
- `src/features/audit/domain/constants/levels.ts` — Score level definitions

### Application Layer
- `src/features/audit/application/use-cases/run-audit.ts` — Orchestrate audit flow
- `src/features/audit/application/use-cases/capture-lead.ts` — Lead capture flow
- `src/features/audit/application/use-cases/get-evolution.ts` — Before/after comparison
- `src/features/audit/application/ports/instagram-port.ts` — Instagram data port
- `src/features/audit/application/ports/storage-port.ts` — Storage port
- `src/features/audit/application/ports/crm-port.ts` — CRM/webhook port

### Infrastructure Layer
- `src/features/audit/infrastructure/adapters/apify-adapter.ts` — Apify API calls
- `src/features/audit/infrastructure/adapters/supabase-adapter.ts` — Supabase operations
- `src/features/audit/infrastructure/adapters/n8n-adapter.ts` — N8N webhook calls

### API Routes
- `src/app/api/audit/route.ts` — POST endpoint for audit
- `src/app/api/lead/route.ts` — POST endpoint for lead capture

### UI Layer (Vertical Slices)
- `src/features/audit/ui/input/components/` — Landing page components
- `src/features/audit/ui/loading/components/` — Loading screen components
- `src/features/audit/ui/capture/components/` — Blurred score + form
- `src/features/audit/ui/results/components/` — Ruta Diagnóstico blocks
- `src/features/audit/ui/results-arranque/components/` — Ruta Arranque blocks
- `src/features/audit/ui/results-evolucion/components/` — Modo Evolución blocks
- `src/features/audit/ui/_shared/components/` — Shared audit UI components

### Pages
- `src/app/page.tsx` — Landing/input page
- `src/app/audit/[username]/page.tsx` — Audit results page (all routes)

### i18n
- `src/locales/es/common.json` — Shared Spanish translations
- `src/locales/es/audit.json` — Audit-specific translations
- `src/locales/pt/common.json` — Shared Portuguese translations
- `src/locales/pt/audit.json` — Audit-specific translations

---

## Task 1: Domain Types & Interfaces

**Files:**
- Create: `src/features/audit/domain/interfaces/audit.ts`
- Create: `src/features/audit/domain/interfaces/lead.ts`
- Create: `src/features/audit/domain/interfaces/benchmark.ts`

- [ ] **Step 1:** Define core audit types — InstagramProfile, PostData, AuditMetrics (ER, CR, RVR), HealthSignals (frequency, formatMix, recency, consistency, trend), ScoreLevel enum, AuditResult, AuditRoute enum
- [ ] **Step 2:** Define lead types — LeadData (name, email, phone), LeadResponse
- [ ] **Step 3:** Define benchmark types — SectorBenchmark, Sector enum
- [ ] **Step 4:** Commit

---

## Task 2: Constants — Benchmarks & Score Levels

**Files:**
- Create: `src/features/audit/domain/constants/benchmarks.ts`
- Create: `src/features/audit/domain/constants/levels.ts`

- [ ] **Step 1:** Define benchmark data per sector (Belleza, Bienestar, Fitness, Salud, General) with ER, CR, RVR values
- [ ] **Step 2:** Define score level ranges (Crítico 0-40, Regular 41-60, Bueno 61-80, Excelente 81-100) with colors and messages
- [ ] **Step 3:** Commit

---

## Task 3: Score Calculator Service

**Files:**
- Create: `src/features/audit/domain/services/score-calculator.ts`
- Create: `src/features/audit/domain/services/__tests__/score-calculator.test.ts`

- [ ] **Step 1:** Write failing tests — calculateER, calculateCR, calculateRVR, normalizeMetric, calculateFinalScore, handleNoReels redistribution
- [ ] **Step 2:** Run tests, verify they fail
- [ ] **Step 3:** Implement score-calculator with all formulas from spec
- [ ] **Step 4:** Run tests, verify they pass
- [ ] **Step 5:** Commit

---

## Task 4: Health Signals Service

**Files:**
- Create: `src/features/audit/domain/services/health-signals.ts`
- Create: `src/features/audit/domain/services/__tests__/health-signals.test.ts`

- [ ] **Step 1:** Write failing tests — calculateFrequency, calculateFormatMix, calculateRecency, calculateConsistency, calculateTrend
- [ ] **Step 2:** Run tests, verify they fail
- [ ] **Step 3:** Implement health signals calculations
- [ ] **Step 4:** Run tests, verify they pass
- [ ] **Step 5:** Commit

---

## Task 5: Route Resolver Service

**Files:**
- Create: `src/features/audit/domain/services/route-resolver.ts`
- Create: `src/features/audit/domain/services/__tests__/route-resolver.test.ts`

- [ ] **Step 1:** Write failing tests — resolveRoute returns DIAGNOSTICO for ≥10 posts, ARRANQUE for <10 posts, EVOLUCION for previous audit >30 days
- [ ] **Step 2:** Run tests, verify they fail
- [ ] **Step 3:** Implement route resolver
- [ ] **Step 4:** Run tests, verify they pass
- [ ] **Step 5:** Commit

---

## Task 6: Application Ports

**Files:**
- Create: `src/features/audit/application/ports/instagram-port.ts`
- Create: `src/features/audit/application/ports/storage-port.ts`
- Create: `src/features/audit/application/ports/crm-port.ts`

- [ ] **Step 1:** Define InstagramPort interface — fetchProfile(username: string): Promise<InstagramProfile>
- [ ] **Step 2:** Define StoragePort interface — saveAudit, getLastAudit, saveLead
- [ ] **Step 3:** Define CrmPort interface — sendLead(lead, audit): Promise<void>
- [ ] **Step 4:** Commit

---

## Task 7: Infrastructure Adapters

**Files:**
- Create: `src/features/audit/infrastructure/adapters/apify-adapter.ts`
- Create: `src/features/audit/infrastructure/adapters/supabase-adapter.ts`
- Create: `src/features/audit/infrastructure/adapters/n8n-adapter.ts`

- [ ] **Step 1:** Implement ApifyAdapter — POST to Apify Instagram Profile Scraper, parse response to InstagramProfile
- [ ] **Step 2:** Implement SupabaseAdapter — create client, saveAudit (insert), getLastAudit (query by username), saveLead (insert)
- [ ] **Step 3:** Implement N8nAdapter — POST webhook with lead + audit data
- [ ] **Step 4:** Commit

---

## Task 8: Use Cases

**Files:**
- Create: `src/features/audit/application/use-cases/run-audit.ts`
- Create: `src/features/audit/application/use-cases/capture-lead.ts`
- Create: `src/features/audit/application/use-cases/get-evolution.ts`

- [ ] **Step 1:** Implement RunAudit — fetch profile via port, validate, calculate score + health signals, check previous audit, determine route, save to storage, return AuditResult
- [ ] **Step 2:** Implement CaptureLead — validate form data, save lead, trigger CRM webhook
- [ ] **Step 3:** Implement GetEvolution — fetch current + previous audit, calculate deltas
- [ ] **Step 4:** Commit

---

## Task 9: API Routes

**Files:**
- Create: `src/app/api/audit/route.ts`
- Create: `src/app/api/lead/route.ts`

- [ ] **Step 1:** Implement POST /api/audit — parse username, instantiate adapters, run use case, return JSON, handle errors (private profile, not found, timeout)
- [ ] **Step 2:** Implement POST /api/lead — parse form data, validate GDPR consent, save lead, return success
- [ ] **Step 3:** Add rate limiting logic (5/IP/hour)
- [ ] **Step 4:** Commit

---

## Task 10: i18n Setup & Translations

**Files:**
- Create: `src/locales/es/common.json`
- Create: `src/locales/es/audit.json`
- Create: `src/locales/pt/common.json`
- Create: `src/locales/pt/audit.json`
- Create: `src/shared/ui/hooks/useTranslation.ts`

- [ ] **Step 1:** Create Spanish common translations (buttons, fields, placeholders, validations)
- [ ] **Step 2:** Create Spanish audit translations (all screen texts, loading messages, error messages, level messages, block titles, CTA texts)
- [ ] **Step 3:** Create Portuguese equivalents
- [ ] **Step 4:** Create useTranslation hook
- [ ] **Step 5:** Commit

---

## Task 11: UI — Landing / Input Screen

**Files:**
- Create: `src/features/audit/ui/input/components/LandingHero.tsx`
- Create: `src/features/audit/ui/input/components/UsernameInput.tsx`
- Create: `src/features/audit/ui/input/components/index.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1:** Build LandingHero — H1 "Descubre si tu Instagram está funcionando", subtitle, BeweOS logo
- [ ] **Step 2:** Build UsernameInput — full-rounded input with placeholder "@tunegocio", "Analizar" button, validation (empty, format), social proof text
- [ ] **Step 3:** Wire page.tsx — form submission navigates to /audit/[username]
- [ ] **Step 4:** Verify visually — bg #CCFBF1, Inter Bold 32px H1, centered layout
- [ ] **Step 5:** Commit

---

## Task 12: UI — Loading Screen

**Files:**
- Create: `src/features/audit/ui/loading/components/LoadingScreen.tsx`
- Create: `src/features/audit/ui/loading/components/LoadingMessages.tsx`
- Create: `src/features/audit/ui/loading/components/index.ts`

- [ ] **Step 1:** Build LoadingScreen — gradient animated loader (Primary 400 + Secondary 400), profile avatar, @username
- [ ] **Step 2:** Build LoadingMessages — rotating messages every 4-5s, adaptive (≥10 posts vs <10 posts vs returning user)
- [ ] **Step 3:** Add Framer Motion entrance animations
- [ ] **Step 4:** Commit

---

## Task 13: UI — Capture Screen (Blurred Score + Form)

**Files:**
- Create: `src/features/audit/ui/capture/components/BlurredScore.tsx`
- Create: `src/features/audit/ui/capture/components/LevelBadge.tsx`
- Create: `src/features/audit/ui/capture/components/UnlockForm.tsx`
- Create: `src/features/audit/ui/capture/components/index.ts`

- [ ] **Step 1:** Build BlurredScore — Merriweather Bold ~96px with CSS blur(10px), white card with shadow
- [ ] **Step 2:** Build LevelBadge — visible pill badge with semantic color (Crítico red, Regular orange, Bueno blue, Excelente green). Variant for <10 posts: "Perfil en crecimiento"
- [ ] **Step 3:** Build UnlockForm — title, 3 fields (name, email, phone) with Aurora UI inputs, "Ver mi resultado" button, GDPR consent, support text
- [ ] **Step 4:** Wire form submission to POST /api/lead → on success, reveal results
- [ ] **Step 5:** Commit

---

## Task 14: UI — Results: Ruta Diagnóstico (Blocks 1-3)

**Files:**
- Create: `src/features/audit/ui/results/components/ScoreBlock.tsx`
- Create: `src/features/audit/ui/results/components/MetricsBlock.tsx`
- Create: `src/features/audit/ui/results/components/HealthSignals.tsx`
- Create: `src/features/audit/ui/results/components/SectorRanking.tsx`

- [ ] **Step 1:** Build ScoreBlock — deblurred score with Merriweather Bold, semantic color, benchmark text, posts analyzed info
- [ ] **Step 2:** Build MetricsBlock — 3 metric cards (ER, CR, RVR) with progress bars vs benchmark + level labels
- [ ] **Step 3:** Build HealthSignals — 5 indicators (frequency, format mix, recency, consistency, trend) as icon + value + label
- [ ] **Step 4:** Build SectorRanking — percentile card with Primary 100 bg, consequence phrase
- [ ] **Step 5:** Commit

---

## Task 15: UI — Results: Ruta Diagnóstico (Blocks 4-6)

**Files:**
- Create: `src/features/audit/ui/results/components/CriticalPoints.tsx`
- Create: `src/features/audit/ui/results/components/LindaSolutions.tsx`
- Create: `src/features/audit/ui/results/components/ActionPlan.tsx`
- Create: `src/features/audit/ui/results/components/TrialCTA.tsx`
- Create: `src/features/audit/ui/results/components/index.ts`

- [ ] **Step 1:** Build CriticalPoints — 3 cards with weakest indicators (problem name + business meaning + real consequence)
- [ ] **Step 2:** Build LindaSolutions — comparative table "Sin BeweOS" vs "Con Linda IA" per critical point
- [ ] **Step 3:** Build ActionPlan — 4-week plan adapted to score level (Crítico/Regular/Bueno/Excelente)
- [ ] **Step 4:** Build TrialCTA — dark bg #0A2540, H1 white, primary CTA "Comenzar mi prueba gratis" + secondary "Ya tengo cuenta BeweOS"
- [ ] **Step 5:** Commit

---

## Task 16: UI — Ruta Arranque

**Files:**
- Create: `src/features/audit/ui/results-arranque/components/ProfileStatus.tsx`
- Create: `src/features/audit/ui/results-arranque/components/GrowthMetrics.tsx`
- Create: `src/features/audit/ui/results-arranque/components/StartupPlan.tsx`
- Create: `src/features/audit/ui/results-arranque/components/index.ts`

- [ ] **Step 1:** Build ProfileStatus — "Perfil en construcción" badge, available data (followers, posts, recency), honest explanation of no score
- [ ] **Step 2:** Build GrowthMetrics — 3 educational metric cards (ER, CR, RVR) explaining what they measure + how Linda helps
- [ ] **Step 3:** Build StartupPlan — 4-week plan table (Activate base → Build consistency → Generate data → Ready for audit)
- [ ] **Step 4:** Add TrialCTA (reuse from Task 15)
- [ ] **Step 5:** Commit

---

## Task 17: UI — Modo Evolución

**Files:**
- Create: `src/features/audit/ui/results-evolucion/components/ScoreComparison.tsx`
- Create: `src/features/audit/ui/results-evolucion/components/MetricsComparison.tsx`
- Create: `src/features/audit/ui/results-evolucion/components/Achievements.tsx`
- Create: `src/features/audit/ui/results-evolucion/components/ShareCTA.tsx`
- Create: `src/features/audit/ui/results-evolucion/components/NextSteps.tsx`
- Create: `src/features/audit/ui/results-evolucion/components/index.ts`

- [ ] **Step 1:** Build ScoreComparison — two circles "Antes" vs "Ahora" with green growth arrow
- [ ] **Step 2:** Build MetricsComparison — side-by-side ER/CR/RVR + health signals with % increment in green
- [ ] **Step 3:** Build Achievements — 3 cards showing biggest advances connected to Linda IA
- [ ] **Step 4:** Build ShareCTA — "Compartir mi resultado" (generates Stories image) + "Volver a auditar en 30 días"
- [ ] **Step 5:** Build NextSteps — tips variant A (score improved) or B (score didn't improve)
- [ ] **Step 6:** Commit

---

## Task 18: Audit Results Page (Router)

**Files:**
- Create: `src/app/audit/[username]/page.tsx`
- Create: `src/features/audit/ui/_shared/components/AuditPageController.tsx`

- [ ] **Step 1:** Build AuditPageController — client component that manages state machine: LOADING → CAPTURE → RESULTS
- [ ] **Step 2:** Wire loading → calls /api/audit → receives data → shows capture screen
- [ ] **Step 3:** Wire capture → form submit → calls /api/lead → reveals results based on route (Diagnóstico/Arranque/Evolución)
- [ ] **Step 4:** Build server page.tsx that renders AuditPageController with username param
- [ ] **Step 5:** Commit

---

## Task 19: Error States

**Files:**
- Create: `src/features/audit/ui/_shared/components/ErrorCard.tsx`

- [ ] **Step 1:** Build ErrorCard — centered card with Solar lock icon, message text, retry input/button
- [ ] **Step 2:** Handle 3 error states: private profile, username not found, timeout/server error
- [ ] **Step 3:** Integrate into AuditPageController
- [ ] **Step 4:** Commit

---

## Task 20: Responsive & Final Polish

- [ ] **Step 1:** Verify all screens responsive (xl: 4 cols → xs: 1 col)
- [ ] **Step 2:** Verify all design tokens match spec (colors, fonts, spacing)
- [ ] **Step 3:** Verify accessibility (htmlFor, aria-labels, contrast)
- [ ] **Step 4:** Final build verification — `next build` passes
- [ ] **Step 5:** Commit
