/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      animation: {
        'pulse-glow-red': 'pulseGlowRed 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlowRed: {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgb(254, 226, 226)'
          },
          '50%': {
            boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)',
            borderColor: 'rgb(220, 38, 38)',
            backgroundColor: 'rgb(254, 202, 202)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      }
    },
  },
  plugins: [],
}
