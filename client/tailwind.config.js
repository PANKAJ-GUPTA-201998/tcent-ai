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
        /* ── Premium brand palette ── */
        navy:    { DEFAULT: '#1E293B', light: '#334155', dark: '#0F172A' },
        emerald: { DEFAULT: '#059669', hover: '#047857', light: '#D1FAE5', dark: '#064E3B' },
        gold:    { DEFAULT: '#F59E0B', hover: '#D97706', light: '#FEF3C7', dark: '#78350F' },
        premium: { DEFAULT: '#8B5CF6', hover: '#7C3AED', light: '#EDE9FE' },

        /* ── Legacy aliases (keeps existing components working) ── */
        primary:   { DEFAULT: '#059669', hover: '#047857' },
        secondary: { DEFAULT: '#8B5CF6', hover: '#7C3AED' },

        /* ── Surface tokens ── */
        surface: {
          DEFAULT: '#1E293B',
          muted:   '#0F172A',
          subtle:  '#243247',
          border:  '#2D3F55',
        },
        dark: {
          DEFAULT: '#0F172A',
          card:    '#1E293B',
          raised:  '#243247',
          border:  '#334155',
        },
      },
      backgroundImage: {
        'brand-gradient':   'linear-gradient(135deg, #059669 0%, #047857 100%)',
        'gold-gradient':    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'hero-gradient':    'linear-gradient(160deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
        'premium-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        'card-shimmer':     'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
      },
      boxShadow: {
        'emerald':    '0 0 28px rgba(5,150,105,0.3)',
        'emerald-lg': '0 0 48px rgba(5,150,105,0.45)',
        'gold':       '0 0 24px rgba(245,158,11,0.35)',
        'card':       '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-md':    '0 4px 16px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out both',
        'shimmer': 'shimmer 2.5s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(14px)' },
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
