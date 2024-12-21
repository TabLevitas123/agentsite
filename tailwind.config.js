/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-red': '#FF0000',
        'accent-crimson': '#DC143C',
        'dark-bg': '#000000',
        'dark-surface': '#111111',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'morphing': 'morphing 8s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'electric-pulse': 'electric-pulse 3s ease-in-out infinite',
        'brain-zoom': 'brain-zoom 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        morphing: {
          '0%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        'electric-pulse': {
          '0%': { opacity: '0.3', strokeDashoffset: '1000' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3', strokeDashoffset: '0' }
        },
        'brain-zoom': {
          '0%': { 
            transform: 'scale(0.1) rotate3d(1, 1, 1, 0deg)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1) rotate3d(1, 1, 1, 360deg)',
            opacity: '1'
          }
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(255, 0, 0, 0.3)',
        'glow-crimson': '0 0 20px rgba(220, 20, 60, 0.3)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
