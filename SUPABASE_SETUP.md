# Accounts and saving (Supabase)

## How it's set up
- Supabase was created through **Vercel > dream-life-app > Storage** (Free plan, $0/month). Vercel holds the keys; nothing secret is in GitHub.
- On every web deploy, `app/scripts/migrate.mjs` applies any new files in `supabase/migrations/` (once each, in order). To change the database, add a new numbered file such as `0002_add_reminders.sql` and push.
- The web build maps Vercel's `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the `EXPO_PUBLIC_` names the app reads (see `app/vercel.json`).

## Open the Supabase dashboard
Vercel > dream-life-app > Storage > your Supabase database > **Open in Supabase**.

## Recommended settings (in the Supabase dashboard)
**Authentication > Sign In / Providers > Email**
- **Confirm email**: off while friends test (they get straight in). Turn it back on before the public launch.

**Authentication > URL Configuration**
- Site URL: `https://dream-life-app-two.vercel.app` (where confirmation and password reset links land).

## Running the app on your computer with the real database
1. Supabase dashboard > Project Settings > API: copy the Project URL and the anon public key.
2. In `app/`, copy `.env.example` to `.env` and paste them in.
3. `npx expo start`.

The anon key is designed to live inside the app; it can only do what the row level security rules allow. Never put the service role or secret key in the app.

## Phone builds
Add the same two values as GitHub repository secrets `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` (see `GET_THE_APP.md`).

## Open test mode (current web link)
The web link runs in test mode (`EXPO_PUBLIC_TEST_MODE=1` in `app/vercel.json`): no login, the tour shows once, and each tester's data saves on their own device.

**Reading tester feedback:** Supabase dashboard > Table Editor > `feedback`. Newest at the bottom (sort by `created_at`).

**Turning logins back on:** remove `EXPO_PUBLIC_TEST_MODE=1` from the build command in `app/vercel.json` and push. Before that, set the Site URL and Redirect URLs above so confirmation and reset emails work.
