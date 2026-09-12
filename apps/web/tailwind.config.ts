import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../content/**/*.ts',
  ],
  theme: {
    // Section 2.4: exactly six colours, two families, 6px radius on inputs and buttons only.
    colors: {
      sheet: 'var(--sheet)',
      ink: 'var(--ink)',
      rule: 'var(--rule)',
      muted: 'var(--muted)',
      reinstated: 'var(--reinstated)',
      notice: 'var(--notice)',
      transparent: 'transparent',
      inherit: 'inherit',
    },
    fontFamily: {
      serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
      sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    borderRadius: { none: '0', DEFAULT: '6px', control: '6px' },
    extend: {
      maxWidth: { content: '1080px', measure: '66ch' },
      fontSize: {
        display: ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-m': ['32px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h2: ['30px', { lineHeight: '1.2' }],
        'h2-m': ['24px', { lineHeight: '1.2' }],
        body: ['18px', { lineHeight: '1.6' }],
        ui: ['15px', { lineHeight: '1.5' }],
        small: ['14px', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
};

export default config;
