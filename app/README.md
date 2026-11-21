# Dream Life (Expo app)

iOS, Android and web from one codebase. Expo SDK 58, TypeScript, Expo Router.

## Run it

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `w` for the web version.

## Where things live

- `src/theme/tokens.ts`: brand colors, fonts, radii, score colors
- `src/components/ui/`: Card, PillButton, Chip, Tile, Eyebrow, Headline, Ticker
- `src/lib/areas.ts`: the 10 areas of life
- `src/app/`: screens (Expo Router, every file is a route)

## Checks

```bash
npm run typecheck
```

## Expo notes

- Add native libraries with `npx expo install <package>` so versions match the SDK.
- Never hand-edit `ios/` or `android/`. Configure them through `app.json`.
- Expo changes every SDK release. Check https://docs.expo.dev/llms.txt before relying on memory.
