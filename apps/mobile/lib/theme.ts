/** Section 2.4. The same six colours and two families as the web. No dark mode in v1. */
export const colors = {
  sheet: '#F7F8FA',
  ink: '#161A22',
  rule: '#D5D9E0',
  muted: '#5F6672',
  reinstated: '#0E7A4F',
  notice: '#B3261E',
  white: '#FFFFFF',
} as const;

export const type = {
  display: { fontSize: 32, lineHeight: 36, fontWeight: '600' as const },
  h2: { fontSize: 24, lineHeight: 29, fontWeight: '600' as const },
  body: { fontSize: 18, lineHeight: 29 },
  ui: { fontSize: 15, lineHeight: 23, fontWeight: '500' as const },
  small: { fontSize: 14, lineHeight: 21 },
};

/** System serif and sans, so no font files ship in the bundle. */
export const fonts = {
  serif: { ios: 'Georgia', android: 'serif', default: 'serif' },
  sans: { ios: 'System', android: 'sans-serif', default: 'System' },
};

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { control: 6 };
