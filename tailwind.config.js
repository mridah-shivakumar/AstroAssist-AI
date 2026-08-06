/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-dark':    '#0a0e1a',
        'space-darker':  '#060810',
        'space-surface': '#0f1629',
        'space-card':    '#131b2e',
        'space-border':  '#1e2d4a',
        'space-blue': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'space-purple': {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#4c1d95',
        },
        'accent-cyan': '#06b6d4',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      backgroundImage: {
        'gradient-space': 'linear-gradient(135deg, #0a0e1a 0%, #0f1629 50%, #0a0e1a 100%)',
      },
    },
  },
  plugins: [],
}
