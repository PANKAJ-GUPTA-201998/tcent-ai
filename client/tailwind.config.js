/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        /* Brand */
        primary:   { DEFAULT: '#3B82F6', hover: '#2563EB', light: '#EFF6FF' },
        secondary: { DEFAULT: '#8B5CF6', hover: '#7C3AED', light: '#F5F3FF' },
        accent:    { DEFAULT: '#06B6D4', hover: '#0891B2', light: '#ECFEFF' },

        /* Surfaces (light mode) */
        surface: {
          DEFAULT: '#FFFFFF',
          muted:   '#F8F9FC',
          subtle:  '#F1F4F9',
          border:  '#E5E9F2',
        },

        /* Surfaces (dark mode) */
        dark: {
          DEFAULT: '#08090E',
          card:    '#0F1017',
          raised:  '#14161E',
          border:  '#1E2130',
        },
      },
      backgroundImage: {
        'brand-gradient':  'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        'hero-gradient':   'linear-gradient(160deg, #050508 0%, #0A0A0F 55%, #0D0D1A 100%)',
        'card-shimmer':    'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md':'0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        'glow':   '0 0 24px rgba(59,130,246,0.35)',
        'glow-lg':'0 0 48px rgba(59,130,246,0.45)',
        'purple': '0 0 24px rgba(139,92,246,0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out both',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
