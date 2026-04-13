import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vercel-black': '#171717',
        'pure-white': '#ffffff',
        'true-black': '#000000',
        'ship-red': '#ff5b4f',
        'preview-pink': '#de1d8d',
        'develop-blue': '#0a72ef',
        'link-blue': '#0072f5',
        'focus-blue': 'hsla(212, 100%, 48%, 1)',
        'ring-blue': 'rgba(147, 197, 253, 0.5)',
        'badge-blue-bg': '#ebf5ff',
        'badge-blue-text': '#0068d6',
        gray: {
          50: '#fafafa',
          100: '#ebebeb',
          400: '#808080',
          500: '#666666',
          600: '#4d4d4d',
          900: '#171717',
        },
      },
      fontFamily: {
        'geist-sans': ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        'geist-mono': [
          'var(--font-geist-mono)',
          'ui-monospace',
          'SFMono-Regular',
          'Roboto Mono',
          'Menlo',
          'Monaco',
          'Liberation Mono',
          'DejaVu Sans Mono',
          'Courier New',
          'monospace',
        ],
      },
      fontSize: {
        'display-hero': [
          '3rem',
          { lineHeight: '1.1', letterSpacing: '-2.4px', fontWeight: '600' },
        ],
        'section-heading': [
          '2.5rem',
          { lineHeight: '1.2', letterSpacing: '-2.4px', fontWeight: '600' },
        ],
        'sub-heading-large': [
          '2rem',
          { lineHeight: '1.25', letterSpacing: '-1.28px', fontWeight: '600' },
        ],
        'sub-heading': [
          '2rem',
          { lineHeight: '1.5', letterSpacing: '-1.28px', fontWeight: '400' },
        ],
        'card-title': [
          '1.5rem',
          { lineHeight: '1.33', letterSpacing: '-0.96px', fontWeight: '600' },
        ],
        'card-title-light': [
          '1.5rem',
          { lineHeight: '1.33', letterSpacing: '-0.96px', fontWeight: '500' },
        ],
        'body-large': [
          '1.25rem',
          { lineHeight: '1.8', fontWeight: '400' },
        ],
        body: [
          '1.125rem',
          { lineHeight: '1.56', fontWeight: '400' },
        ],
        'body-small': [
          '1rem',
          { lineHeight: '1.5', fontWeight: '400' },
        ],
        'body-medium': [
          '1rem',
          { lineHeight: '1.5', fontWeight: '500' },
        ],
        'body-semibold': [
          '1rem',
          { lineHeight: '1.5', letterSpacing: '-0.32px', fontWeight: '600' },
        ],
        'button-link': [
          '0.875rem',
          { lineHeight: '1.43', fontWeight: '500' },
        ],
        'button-small': [
          '0.875rem',
          { lineHeight: '1.00', fontWeight: '400' },
        ],
        caption: [
          '0.75rem',
          { lineHeight: '1.33', fontWeight: '400' },
        ],
      },
      borderRadius: {
        micro: '2px',
        subtle: '4px',
        standard: '6px',
        comfortable: '8px',
        image: '12px',
        large: '64px',
        xl: '100px',
        pill: '9999px',
        circle: '50%',
      },
      boxShadow: {
        ring: 'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
        'light-ring': 'rgb(235, 235, 235) 0px 0px 0px 1px',
        'subtle-card':
          'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px',
        'full-card':
          'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px, rgba(0, 0, 0, 0.04) 0px 8px 8px -8px, #fafafa 0px 0px 0px 1px',
        focus: '0 0 0 2px hsla(212, 100%, 48%, 1)',
      },
      spacing: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
        '8': '8px',
        '10': '10px',
        '12': '12px',
        '14': '14px',
        '16': '16px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
