# Getting Dream Life onto phones

## Today: web link
https://dream-life-app-two.vercel.app

Open it on your phone, log in to Vercel when asked (testers can't get in until it's made public), then Share > Add to Home Screen. Accounts and saving work once Supabase is connected (step 1 below).

## Step 1: Supabase (accounts and saving), 10 minutes
Follow `SUPABASE_SETUP.md`. Then add the two keys in two places:
- **GitHub**: repo Settings > Secrets and variables > Actions > New repository secret
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Vercel**: dream-life-app project > Settings > Environment Variables, same two names. Then Redeploy.

## Step 2: Expo account (free), 5 minutes
1. Sign up at https://expo.dev
2. Account settings > Access tokens > Create token. Name it `github`.
3. GitHub repo Settings > Secrets and variables > Actions > New repository secret: `EXPO_TOKEN`, paste the token.

## Step 3: Android install link, about 20 minutes (mostly waiting)
1. GitHub repo > Actions > **Build app** > Run workflow. Platform: `android`, profile: `preview`.
2. When it finishes, open expo.dev > dream-life > Builds. Open the build on your Android phone and tap Install.
3. Share that same link with Android testers.

## Step 4: iPhone via TestFlight
1. Apple Developer account at https://developer.apple.com/programs ($99/yr).
   - As The Expand Lab LLC: needs a D-U-N-S number (free, can take 1 to 2 weeks). Recommended, the store listing shows your company name.
   - As yourself: usually approved in 1 to 2 days.
2. In App Store Connect, create the app: name Dream Life, bundle ID `com.theexpandlab.dreamlife`.
3. iPhone builds need Apple signing set up once, interactively. Run this on your computer (it asks for your Apple login), or ask Claude to walk you through it:
   ```
   cd app
   npx eas-cli@latest build --platform ios --profile production
   npx eas-cli@latest submit --platform ios
   ```
4. In App Store Connect > TestFlight, add testers by email. They get an invite to install.

After the first iPhone build, the **Build app** button in GitHub works for iPhone too.

## Step 5: The stores (later)
- Google Play developer account ($25 once).
- App Store Small Business Program (15% fee instead of 30%).
- Privacy policy and terms, store screenshots and description.
