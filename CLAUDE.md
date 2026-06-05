# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

心跳飞行棋 (Heartbeat Ludo) — a mobile-first interactive two-player board game web app. Chinese-language UI. Live at https://cpfly.top/

## Commands

```bash
npm install        # install dependencies (pnpm also works)
npm run dev        # dev server at localhost:5173
npm run build      # production build → dist/
npm run lint       # ESLint (flat config, .ts/.tsx)
npm run typecheck  # tsc --noEmit -p tsconfig.app.json
```

No test framework is configured.

## Architecture

**Stack:** React 18 + TypeScript (strict) + Vite 5 + Tailwind CSS 3.4

**State management:** Single custom hook `useGameState` (`src/hooks/useGameState.ts`) holds all app state via `useState<GameState>`. Mutations exposed via `useCallback`. State auto-persists to localStorage via `useEffect`. No Redux/Zustand/Context.

**Routing:** No router library. The `GameState.view` field (`'home' | 'game' | 'themes'`) controls which view renders. CSS `translate-x` transitions animate view switches.

**Modals:** Six modals managed by boolean/string state in `App.tsx`. All state and callbacks are props-drilled from `App.tsx` downward — no Context API.

**Game logic** (`src/utils/gameLogic.ts`):
- 7×7 grid (49 tiles) with a spiral path from top-left to center
- `generateSpiralPath()` computes coordinates; `generateBoardMap()` randomly assigns 16 lucky + 16 trap tiles
- Tile types: `blank` (normal), `lucky` (task for opponent), `trap` (task for you)
- Collision (same tile as opponent) sends rejected player back to start
- Win at step 48 (center)

**Types:** All in `src/types/index.ts` — `GameState`, `Player`, `Theme`, `TileType`, `PlayerRole`, `TaskEventData`

**AI import** (`src/components/modals/AiImportModal.tsx`): No API calls. Copies a prompt to clipboard for external AI, then user pastes JSON response back for parsing.

**Styling:** Dark theme, iOS-inspired glass morphism (`.ios-glass`, `.ios-card`), 3D CSS dice, max-width 430px container. Male accent: `#0A84FF`, female accent: `#FF375F`.

**Default content:** 5 themes × 36 tasks each in `src/data/defaultThemes.ts` (Chinese-language couple interaction tasks).

## Notes

- `@supabase/supabase-js` is in package.json but unused — leftover from scaffolding
- Mobile-first design with haptic feedback (`navigator.vibrate`)
- Scaffolded via Bolt.new (see `.bolt/config.json`)
