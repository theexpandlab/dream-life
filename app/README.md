# Dream Life (Expo app)

iOS, Android and web from one codebase. Expo SDK 58, TypeScript, Expo Router.

## Run it

```bash
cd app
npm install
cp .env.example .env   # then add your Supabase keys, see ../SUPABASE_SETUP.md
npx expo start
```

Without the keys the app still runs, and the account screens say accounts are not connected yet.

Scan the QR code with Expo Go on your phone, or press `w` for the web version.

## Where things live

- `src/theme/tokens.ts`: brand colors, fonts, radii, score colors
- `src/components/ui/`: Card, PillButton, Chip, Tile, Eyebrow, Headline, Ticker
- `src/lib/areas.ts`: the 10 areas of life
- `src/app/`: screens (Expo Router, every file is a route)
  - `index.tsx`: front door, sends people to the tour, sign up, or Home
  - `onboarding.tsx` + `src/onboarding/`: the 9-step interactive tour
  - `sign-up.tsx`, `sign-in.tsx`, `reset-password.tsx`: accounts
  - `(tabs)/`: Home, Today, Reflect, Wins, Dream
- `src/lib/supabase.ts`, `src/lib/auth.tsx`: Supabase client and login state
- `src/lib/data/`: reading and saving each kind of data
- `../supabase/migrations/`: database tables and privacy rules

## Checks

```bash
npm run typecheck
```

## Expo notes

- Add native libraries with `npx expo install <package>` so versions match the SDK.
- Never hand-edit `ios/` or `android/`. Configure them through `app.json`.
- Expo changes every SDK release. Check https://docs.expo.dev/llms.txt before relying on memory.
