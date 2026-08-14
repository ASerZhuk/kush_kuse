# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Kosh Kusé** — a Next.js pet food subscription PWA (Russian market, mobile-first). UI tokens and design synced with Figma.

## Stack & Commands

- **Runtime**: Node.js 20+, Next.js 16.3 (App Router, React 19)
- **Styling**: Tailwind CSS v4 with custom `@theme` tokens in `app/globals.css`
- **Dev server**: `npm run dev` (localhost:3000; LAN access configured for IP 192.168.0.108 in `next.config.ts`)
- **Build**: `npm run build` + `npm start`
- **Lint**: `npm run lint` (ESLint, no tests yet)

## Architecture

### Page Structure

- **Root layout** (`app/layout.tsx`): wraps all pages with `SubscriptionProvider` (in-memory state stub), installs PWA prompt, sets fonts/viewport/metadata
- **Tab-based nav** (`app/(tabs)/layout.tsx`): 5-tab bottom nav (`BottomNav`), prefetches all routes on mount
  - Routes: `/home`, `/ration`, `/health`, `/chat`, `/profile`
- **Onboarding**: `/invite/*` (pet name, profile form, ration picker) → `/checkout`
- **Checkout** (`app/checkout/page.tsx`): single client component, enum-based step state (Address → Card → Review → Success), no sub-routes
- **Chat** (`app/(tabs)/chat/page.tsx`): single client component, mocked conversation with "miss Kusé" — no backend. Bot messages arrive after a delay via a messenger-style typing indicator (`TypingBubble`); sending a message or a suggestion chip, or clicking "Пригласить специалиста", triggers the same typing → canned-reply flow. All state is local `useState`, reset on refresh.

### UI Kit & Components

**Location**: `components/ui/`, `components/icons/`, `components/*` (see README §Компоненты for full catalog)

**Core pattern**: unified `Button` API
- `variant`: `primary` (liquid glass, no fill) | `secondary` (flat, `bg-grey`) | `ghost` (borderless)
- Accepts `href` (renders as `Link`), `iconOnly`, `fullWidth`, `subtitle`

**Custom effects**:
- **Liquid glass** (`GlassLayer.tsx`): SVG displacement map + blur fallback (Safari/Firefox). Utilities in `globals.css`: `.backdrop-glass`, `.backdrop-glass-sm`, `.backdrop-glass-grey`, `.backdrop-glass-clear`
- **Bottom sheets** (`BottomSheet.tsx`): portal-based drawer, render-props API with `open`/`close`, used by `CourierSheet`, `SubscriptionSheet`, `RecipeSheet`
- **Story modal** (`StoryModal.tsx`): full-screen overlay, gradient-300 bg, cubic-bezier scale+fade

**Typography**: `SF Pro Text` (<20px) / `SF Pro Display` (≥20px), loaded via `app/fonts.ts`; use `text-h1` through `text-caption-s` classes

### State Management

- **SubscriptionContext** (`components/SubscriptionContext.tsx`): client-only in-memory context (no backend yet)
  - `active: boolean`, `activate()` method
  - Lives in memory across navigation, resets on page refresh
  - Used by `RationSubscriptionSection`, `ActiveSubscriptionCard`, checkout flow
- All other state: component-local (`useState`)

### Key Architectural Decisions

1. **Liquid glass is not raw CSS `backdrop-filter: blur()`** — uses `GlassLayer` SVG filter for refraction effect, with graceful blur fallback. Critical for visual fidelity.
2. **Checkout is a single component, not split routes** — simpler state management, unified progress UI (3 dots in header).
3. **BottomNav prefetches all tabs** on first mount to avoid prefetch waterfall on each tab click.
4. **Gradient-300 is manually tuned**, not auto-exported from Figma (Figma loses ellipse rotation on export; far stop at 250% keeps center grey-white).
5. **No tests yet** — focus is on polish and shipping.

## File Ignores

When reading code, skip:
- `node_modules/`, `.next/`, `.git/`, `dist/`, `build/`, `coverage/`

## Important Notes

- **Fonts**: `app/fonts.ts` imports SF Pro via `next/font`. Don't break font loading.
- **Mobile first**: `width: device-width, initialScale: 1, viewportFit: cover` in viewport config is deliberate (iOS Safari fix).
- **Tailwind v4**: uses CSS variables in `@theme` block; custom scales for colors, gradients, shadows. Check `globals.css` before adding new utility tokens.
- **Path alias**: `@/*` maps to repo root.
- **SVG icons**: React components in `components/icons/*`, static SVG assets in `app/assets/*.svg` (imported via `next/image`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
