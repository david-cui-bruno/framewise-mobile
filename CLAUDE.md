# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Framewise Health is a React Native patient-facing mobile app for healthcare recovery programs. Patients watch educational videos, complete quizzes, track daily tasks, and interact with a Q&A interface. Built with Expo (managed workflow) and Supabase as the backend.

## Commands

```bash
npm run dev          # Start Expo dev server (cache cleared)
npm start            # Start Expo dev server
npm run ios          # Launch iOS simulator
npm run android      # Launch Android emulator
npm run web          # Launch web via Metro
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run prebuild     # Generate native ios/ and android/ folders
```

No test framework is configured.

## Environment Variables

Set in `.env.local` — all prefixed with `EXPO_PUBLIC_*` (inlined at build time by Metro):

- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — required
- `EXPO_PUBLIC_DEMO_MODE=true` / `EXPO_PUBLIC_DEMO_PASSWORD` — optional, enables demo login

## Tech Stack

- **Expo ~54** / React Native 0.81 / React 19 (New Architecture enabled)
- **Expo Router v6** — file-based routing with typed routes
- **NativeWind v4** — Tailwind CSS classes via `className` prop
- **Supabase JS v2** — backend, auth, database
- **expo-secure-store** — token persistence in device keychain
- **expo-av** — video playback
- **react-native-reanimated v4** / **react-native-gesture-handler** — animations
- **react-native-svg** — inline SVG icons (no icon library)
- **TypeScript 5.7** — strict mode, `@/*` path alias maps to project root

## Architecture

### Routing (`app/`)

Expo Router file-based routing with route groups:
- `(auth)/` — unauthenticated screens (login, verify)
- `(protected)/` — authenticated screens with auth guard in `_layout.tsx`
- `auth/callback.tsx` — magic link deep link handler

Auth guard in `(protected)/_layout.tsx` redirects: unauthenticated → `/login`, not onboarded → `/onboarding`.

### State Management

No global state library. Auth state flows through a single React Context:
- `hooks/useAuth.ts` — manages Supabase session + patient profile
- `components/auth/AuthProvider.tsx` — wraps the app, exposes `useAuthContext()`

### Data Fetching

Screens in `app/` fetch data and pass it as props. Components in `components/` are prop-driven with no internal data fetching.

### Styling Patterns

- Tailwind classes via NativeWind `className` prop (light mode only)
- Platform-aware shadows via `constants/theme.ts` `getShadow()` (NativeWind doesn't support `box-shadow` on native)
- Custom color tokens defined in `tailwind.config.js`: `primary` (teal), `secondary` (blue-grey), `neutral`, `success`, `warning`, `error`

### Telemetry (`lib/telemetry/eventQueue.ts`)

Singleton `telemetryQueue` buffers video playback events, auto-flushing at 10 events or every 30 seconds. Must be initialized with `telemetryQueue.initialize(supabase)`.

### Deep Link Auth

Magic link tokens extracted from URL fragments in two places: `app/_layout.tsx` (Linking listener) and `app/auth/callback.tsx` (callback route). Both call `supabase.auth.setSession()`.

## Code Conventions

- Named exports for all components (not default exports)
- Interfaces (not type aliases) for component props
- `@/` alias for all non-relative imports
- No barrel/index files — import components directly by path
- Inline SVG icon functions defined at the bottom of the file that uses them
