# Connect accounts and saving (Supabase)

About 10 minutes. You only do this once.

## 1. Create the project
1. Go to https://supabase.com and sign in (GitHub login is easiest).
2. New project. Name: `dream-life`. Pick a strong database password and save it in your password manager. Region: East US (closest to Austin).
3. Wait about 2 minutes for it to finish setting up.

## 2. Create the tables
1. In the left sidebar: **SQL Editor**, then **New query**.
2. Open `supabase/migrations/0001_init.sql` from this repo, copy all of it, paste it in, click **Run**.
3. You should see "Success. No rows returned."

This creates every table (profiles, daily check-ins, monthly scores, weekly resets, goals, wins, highlights, the dump, dream boards) and locks each one so people can only ever see their own data.

## 3. Auth settings
**Authentication > Sign In / Providers > Email**
- Keep **Email** on.
- **Confirm email**: turn it **off** while you test with friends (people get straight in). Turn it back **on** before the public launch.
- Minimum password length: 8.

**Authentication > URL Configuration**
- Site URL: `https://dream-life-prototype.vercel.app` for now (the password reset link opens here). Change it when the app has its real web address.

## 4. Give the app its keys
1. **Project Settings > API**. Copy the **Project URL** and the **anon public** key.
2. In the `app/` folder, copy `.env.example` to `.env` and paste them in:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Restart `npx expo start`.

The anon key is designed to live inside the app. It can only do what the row level security rules allow. Never put the **service_role** key in the app.

`.env` is git-ignored, so the keys never land in GitHub. For cloud builds later (EAS), the same two values go into Expo's environment variables.

## 5. Check it works
1. Open the app, take the tour, create an account.
2. Today tab: tap a few areas, **Save today**.
3. In Supabase: **Table Editor > days**. Your row is there.
4. Log out, log back in. Your check-in is still selected.
