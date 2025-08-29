# AI Assistant Project Instructions

Purpose: Provide just enough project-specific context so an AI pair‑programmer can immediately make safe, idiomatic changes without cargo‑culting generic React patterns.

## Stack & Runtime
- React 18 + Vite (ESM, no CRA). Entry: `index.html` -> `src/main.jsx` -> `src/pages/App.jsx` (router) -> wrapped by `SiteShell`.
- Routing via `react-router-dom@6` using `<Routes>/<Route>`; all page components live in `src/pages`.
- Single global stylesheet: `src/styles/global.css` (large; central design tokens + component classes). Avoid scattering new ad‑hoc CSS files; extend with BEM‑like utility classes inside this file unless a truly isolated visual needs scoping.

## Key Domains / Systems
| Area | Files | Notes |
|------|-------|-------|
| Telemetry Streams | `components/EventStream.jsx`, `TelemetryTicker.jsx`, `LatencyHistogram.jsx`, `InterlockMatrix.jsx` | Synthetic stochastic data, accessibility roles (`log`, `group`). Maintain lightweight math (no heavy libs). |
| Performance Panel | `components/ThroughputPanel.jsx` | Mean‑reverting stochastic model (Ornstein–Uhlenbeck style). Scaling choices (15× baseline) are intentional—preserve relative ratios & burst logic. |
| Core Load Visualization | `components/CoreLoadVisualizer.jsx` | Uses state refs + timed loop; keep GC pressure low (reuse arrays / typed arrays if adding). |
| Snapshot Aggregation | `utils/snapshotBus.js`, `components/SystemSnapshots.jsx` | Register providers with `registerSnapshot(name, fn)`. Functions must be pure, sync, lightweight, and return JSON‑serializable objects. Signature uses WebCrypto SHA‑256 with FNV fallback—do not replace with heavier libs. |
| Download Utility | `utils/download.js` | Centralized JSON export; reuse instead of duplicating Blob logic. |
| Layout Shell | `ui/SiteShell.jsx`, `ui/nav/*`, `ui/HeroPanel.jsx`, `ui/Section.jsx` | Shell controls global nav, skip link, scroll lock for modals. Preserve a11y attributes. |
| Fonts / Branding | `/public/cyberdyne/*`, `/public/*.ttf`, CSS `@font-face` in `global.css` | Add new fonts by mirroring existing `font-display: swap` pattern. |

## Patterns & Conventions
- Component Style: Mostly function components + React hooks; side‑effect loops (telemetry) use `useEffect` + `setTimeout` or animation frames. Avoid introducing Redux / global state libs; prefer local state + snapshot bus if aggregation needed.
- Data Generation: All pseudo‑random telemetry is deterministic only per session; keep math simple (sine waves + noise + mean reversion). If extending, follow existing step functions & ensure bounded values.
- Snapshot Providers: Register once at module scope or inside a guarded effect; avoid re‑registering every render. Return minimal structural summary, not huge arrays.
- Accessibility: Every streaming/log style component should expose ARIA roles and `aria-live` where appropriate. Preserve `Skip to content` link and tab order.
- Styling: Use existing CSS custom properties (e.g., `--accent`, `--panel`). When adding new UI blocks, prefer existing class families (`.throughput-*`, `.snapshot-*`, `.tp-row`) as examples for naming. Keep font sizes in rem and letter‑spaced uppercase for headings.
- Performance: Avoid per‑tick object churn inside loops—reuse refs; update primitive numbers and derived arrays inline. No large external chart libs—ASCII / simple spans used intentionally for perf.
- Persistence: Use `localStorage` keys with a short namespace prefix (e.g., `btc:xpub`, existing filters). Always guard in environments without `window` if adding SSR later.

## Adding a New Telemetry Panel (Example Workflow)
1. Create `src/components/MyPanel.jsx` exporting a function component.
2. Inside, set up a `useRef` state object holding evolving metrics.
3. Use a `useEffect` loop with `setTimeout` or `requestAnimationFrame` to mutate the ref and trigger a lightweight `setTick(t=>t+1)`.
4. Render semantic markup: wrapper `role="group"`, header, rows with labels, bars using existing `.tp-row` style or similar.
5. (Optional) Register a snapshot: `registerSnapshot('myPanel', () => ({ /* distilled metrics */ }));` executed once.
6. Import and place inside a page (e.g., `Home.jsx` within a `Section`).

## Build & Dev
- Install: `npm install` (pure ESM). Dev: `npm run dev` (Vite default port 5173 unless occupied). Build: `npm run build`; Preview static build: `npm run preview`.
- Testing: `npm run test` (Vitest + @testing-library). Add tests under `src/components/__tests__/` using `*.test.jsx` pattern.
- No custom Vite plugins beyond React; if adding one, justify size and keep config minimal in `vite.config.js`.

## Common Gotchas
- Blank Screen: Usually a silent runtime error—check browser console; ensure newly added component imports use the correct relative path & `.jsx` extension (Vite ESM strictness).
- Snapshot Bus: Forgetting to import `registerSnapshot` from `../utils/snapshotBus.js` leads to provider absence (listed in SystemSnapshots panel). Providers must not throw; wrap risky code.
- Performance Loops: Don’t use `setInterval` with heavy work; current pattern uses recursive `setTimeout` with jitter to avoid lockstep artifacts.
- CSS Collision: Adding global element selectors may degrade existing feel—prefer class selectors under component naming.

## Safe Extension Checklist
Before committing a change:
- Does it keep loops lightweight and allocations minimal?
- Are ARIA roles consistent with similar components?
- If exporting data, is it serializable and small?
- Are new dependencies truly necessary (scrutinize bundle size)?

## When Unsure
Search similar pattern inside `src/components` (e.g., look at `ThroughputPanel.jsx` for metric rows, `SystemSnapshots.jsx` for control panels). Mirror structural semantics and naming.

---
Provide diffs only (no full file dumps) when editing. Ask for clarification only if a structural decision cannot be inferred from existing patterns.
