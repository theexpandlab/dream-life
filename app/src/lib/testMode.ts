/**
 * Open test mode: no accounts. Anyone with the link goes straight in,
 * the tour shows once (skippable), and data saves on the tester's own device.
 * Switched on for the web build in vercel.json. Turn off to bring logins back.
 */
export const TEST_MODE = process.env.EXPO_PUBLIC_TEST_MODE === '1';
