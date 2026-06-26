/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          dark: '#0f0f1a',
        },
        accent: {
          green: '#4ade80',
          red: '#f87171',
          yellow: '#facc15',
          purple: '#818cf8',
          orange: '#fb923c',
          blue: '#38bdf8',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
