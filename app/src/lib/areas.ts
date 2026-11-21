/** The 10 areas of life, in display order (ties resolve to the first in this order). */
export const AREAS = [
  { key: 'career', label: 'Career' },
  { key: 'finance', label: 'Finance' },
  { key: 'health', label: 'Health & Fitness' },
  { key: 'family', label: 'Family & Friends' },
  { key: 'romance', label: 'Romance' },
  { key: 'fun', label: 'Fun & Adventure' },
  { key: 'growth', label: 'Learning & Growth' },
  { key: 'spirituality', label: 'Spirituality' },
  { key: 'home', label: 'Home & Environment' },
  { key: 'contribution', label: 'Contribution & Giving' },
] as const;

export type AreaKey = (typeof AREAS)[number]['key'];
