# Dream Life App

Context for Claude Code. Read this first, then `docs/PRODUCT_BRIEF.md`, then look at `design/` and `prototype/`.

## What this is

A faith-rooted life tracker and dream-life visualization app, created by Hannah Andersen (Founder & CEO, The Expand Lab, Austin TX). It started as a web dashboard prototype and is being turned into a real iOS and Android app to sell by subscription.

The core promise: see who you are becoming, track whether you are actually showing up for it, and celebrate the proof along the way.

## Copy and voice rules (strict)

- Never use em dashes in any copy, UI text, docs, or commit messages. Use commas, periods, colons or "to".
- Voice: warm, playful, lowercase serif headlines ("your life, at a glance."), short sentences, encouraging, never preachy.
- Faith is woven in naturally (a "Where I saw God move" prompt, a KJV verse in The Dump), not forced.
- Hannah prefers direct, copy-paste-ready outputs and wants you to attempt tasks rather than over-explain.

## Brand / design system

Modeled on the visibilityexpander.com look.

| Token | Value | Use |
|---|---|---|
| cream | `#FEFFEC` | app background |
| paper | `#FFFFF6` | cards |
| ink | `#272725` | text, borders, dark hero cards |
| lime | `#B1E287` | primary accent, buttons, highlights, chart fill |
| yellow | `#F3EC9E` | "okay" scores (5 to 7) |
| pink | `#F2C2B3` | "needs love" scores (4 and below) |
| good | `#3B7A1E` | positive change text |
| bad | `#B4432E` | negative change text, errors |

- Headings: Instrument Serif (Google Font), weight 400, lowercase, one italic word with a lime highlighter band behind it.
- Body: Helvetica Neue / system sans.
- Labels, eyebrows, buttons: monospace, uppercase, letter-spaced (ui-monospace / Droid Sans Mono).
- Cards: square corners, 1px ink border. Buttons and chips: pill shape (radius 300px), 1px ink border, lime fill for primary.
- Signature element: a lime scrolling ticker banner, "SHOWING UP FOR YOUR LIFE IS FUN :)  ✦". Hannah loves it, keep it.
- Respect reduced motion for the ticker and the breathing circle.

## The 10 areas of life

`career` Career, `finance` Finance, `health` Health & Fitness, `family` Family & Friends, `romance` Romance, `fun` Fun & Adventure, `growth` Learning & Growth, `spirituality` Spirituality, `home` Home & Environment, `contribution` Contribution & Giving.

## Features (all working in the prototype)

1. **Overview**: life score (latest monthly average), all-time life score, change vs last month, daily streak, days checked in this month, "showing up" rate, latest weekly score, strongest area, area that needs love, wheel of life radar chart (latest month vs previous dashed), life score trend line.
2. **Daily check-in** (30 seconds): tap chips for each area you showed up for today, energy 1 to 5, today's win, one gratitude. Month calendar shaded by how many areas were checked off; tap a day to edit. Per-area bars: days showed up this month.
3. **Weekly reset**: pick any day in the week (normalized to Monday), score "Did I do what I set out to do?" 1 to 10, win of the week, what got in the way, top 3 for next week. Grid of that week's daily check-offs. Weekly score trend (last 12).
4. **Monthly check-in**: score all 10 areas 1 to 10, biggest win, "Where I saw God move", focus for next month. History table color-coded (8+ lime, 5 to 7 yellow, 4 or below pink). Latest reflections.
5. **Goals**: one goal and one next action per area, with the latest score and change.
6. **Win board**: add wins (text, optional area, date). Daily, weekly and monthly wins are pulled in automatically. "Tough day? Remember this one" random win card with shuffle. Counts: total and this month.
7. **Highlights**: photo + what happened + why it made me happy, grouped by month.
8. **The dump**: things that no longer serve me, plus what I'm choosing instead. "Let it go ✦" moves an item to Released. Counts for each. 1 Peter 5:7 (KJV).
9. **Dream you** (premium preview): locked card, unlock with your name, then "welcome, {name}. Welcome to Dream Life Activation" hero with a breathing circle, and 1 / 3 / 5 year vision boards (up to 12 photos each, who I am, how I feel, a day in my life, my first step this month). Teaser list of full-app features: guided voice visualizations, AI-built path to each vision, inspiration library, daily reminders.

## Scoring logic

- Monthly life score = mean of the 10 area scores for that month, rounded to 1 decimal.
- All-time life score = mean of all monthly life scores.
- Change = latest month minus previous month.
- Strongest / needs love = highest / lowest area score in the latest month (first in area order on ties).
- Streak = consecutive days with a daily check-in, counting back from today (or yesterday if today isn't logged yet).
- Showing-up rate = checked-off areas this month / (days logged this month x 10).
- Wins feed = win-board entries + daily `win` + weekly `win` + monthly `win`, newest first.

Reference implementations: the `dash.calc(...)` blocks in `prototype/lg-core.js`.

## Data model (per user)

| Collection | Doc id | Fields |
|---|---|---|
| checkins | `YYYY-MM` | month, 10 area scores (1 to 10), win, god, focus, savedAt |
| days | `YYYY-MM-DD` | date, 10 area booleans, energy (1 to 5), win, note (gratitude), savedAt |
| weeks | Monday `YYYY-MM-DD` | week, score (1 to 10), win, blocker, next, savedAt |
| goals | area key | area, label, goal, action |
| wins | auto id | text, area (optional), date, savedAt |
| memories | auto id | date, title, note, imageId |
| letgo | auto id | text, instead, date, released (bool), releasedOn |
| dream | `state`, `y1`, `y3`, `y5` | state: unlocked, name, unlockedOn. y*: horizon, photos (image ids, max 12), who, feel, day, step, savedAt |

## The prototype

`prototype/` is the original dashboard. It was built for Claude's artifact runtime, so `shim.js` fakes that runtime (`dash.data`, `dash.calc`, `dash.draw`, `dash.onData`) with the sample data in `sample.js`. To view it:

```
cd prototype && python3 -m http.server 8000
# open http://localhost:8000
```

Saving does not work in the prototype (no backend). Treat it as the visual and behavioral spec, not code to ship. `design/` has phone-size screenshots of every tab.

## Target stack (recommended, confirm with Hannah)

- Expo (React Native + TypeScript) for iOS and Android from one codebase, with Expo Router.
- Supabase for auth (email + Apple + Google sign-in), Postgres, row-level security per user, and Storage for photos.
- RevenueCat for subscriptions (free tier + premium).
- react-native-svg (or Victory Native) for the radar and line charts.
- Expo Notifications for daily check-in reminders.
- EAS Build and Submit for the App Store and Google Play.

## Free vs premium (draft)

- Free: daily check-in, monthly life score, overview, goals, win board.
- Premium: Dream You boards, highlights with photos, weekly reset insights, AI review queue (type what happened, AI suggests area and a plus or minus, you approve), guided visualizations, AI path to your vision.

## Build order (suggested first tasks)

1. Scaffold Expo + TypeScript + Expo Router; add design tokens and fonts (Instrument Serif via expo-google-fonts).
2. Build the shared UI kit: Card, PillButton, Chip, Tile, Eyebrow, Headline (with highlighted italic word), Ticker.
3. Supabase schema + RLS for the tables above; auth screens.
4. Screens in order: Daily check-in, Overview, Monthly check-in, Goals, Win board, Weekly, Highlights, The dump, Dream you.
5. Port the scoring logic into tested pure functions (`/lib/scores.ts`) with unit tests.
6. Charts: wheel of life radar, trend lines, calendar heat map.
7. RevenueCat paywall on premium features; Dream You unlock flow.
8. Notifications, onboarding ("what should we call you?"), App Store assets.

Keep every screen mobile-first, large tap targets, and test on a 390px-wide iPhone layout.
