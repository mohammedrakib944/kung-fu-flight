/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7ccbfd',
          400: '#37aff9',
          500: '#0e90e9',
          600: '#0272c7',
          700: '#035ba1',
          800: '#074d85',
          900: '#0c406e',
          950: '#082a4a',
        },
        surface: {
          50: '#1a1d23',
          100: '#23272e',
          200: '#2c313a',
          300: '#363c47',
          400: '#404854',
          500: '#4a5361',
        },
        accent: {
          glow: 'rgba(14, 165, 233, 0.15)',
          blue: '#1fb6ff',
          purple: '#7e5bef',
          pink: '#ff49db',
        },
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(12, 64, 110, 0.4) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(2, 114, 199, 0.3) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(14, 144, 233, 0.4) 0, transparent 50%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
