import { Platform } from 'react-native';

/** Brand colors. Source of truth: CLAUDE.md "Brand / design system". */
export const colors = {
  cream: '#FEFFEC', // app background
  paper: '#FFFFF6', // cards
  ink: '#272725', // text, borders, dark hero cards
  lime: '#B1E287', // primary accent, buttons, highlights, chart fill
  yellow: '#F3EC9E', // "okay" scores (5 to 7)
  pink: '#F2C2B3', // "needs love" scores (4 and below)
  good: '#3B7A1E', // positive change text
  bad: '#B4432E', // negative change text, errors
} as const;

export const fonts = {
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  sans: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: 'Helvetica Neue, Helvetica, Arial, sans-serif' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'ui-monospace, "Droid Sans Mono", Menlo, monospace' }),
} as const;

export const radius = {
  card: 0, // cards are square
  pill: 300, // buttons and chips
} as const;

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

/** Minimum tap target (Apple HIG). */
export const tap = 44;

/** Score color: 8+ lime, 5 to 7 yellow, 4 or below pink. */
export function scoreColor(score: number): string {
  if (score >= 8) return colors.lime;
  if (score >= 5) return colors.yellow;
  return colors.pink;
}
