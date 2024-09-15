/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',

      },
    },
    extend: {
      colors: {
        'primary-500': '#FFB74D', // Warm accent color (Orange)
        'primary-600': '#FF9800', // Slightly darker accent (Deep Orange)
        'secondary-500': '#FFEB3B', // Dominant yellow (Bright Yellow)
        'secondary-600': '#FBC02D', // Slightly darker yellow (Golden Yellow)
        'off-white': '#FFF8E1', // Soft light color for contrast (Very Light Yellow)
        'red': '#E57373', // Softer red for alerts and emphasis
        'dark-1': '#121212', // Main background color (Dark Gray)
        'dark-2': '#1E1E1E', // Secondary background color (Slightly Lighter Dark Gray)
        'dark-3': '#242424', // Tertiary background color (Lighter Dark Gray)
        'dark-4': '#2C2C2C', // Darkest background color (Deep Gray)
        'light-1': '#FFFFFF', // Pure white for text and highlights
        'light-2': '#F5F5F5', // Light gray for text and highlights
        'light-3': '#EEEEEE', // Muted light color for secondary text (Light Gray)
        'light-4': '#E0E0E0', // Muted light color for tertiary text (Gray)
        'accent-1': '#FFD700', // Gold accent for highlights
        'accent-2': '#00BFFF', // Deep sky blue for highlights
        'accent-3': '#32CD32', // Lime green for positive actions
        'accent-4': '#FF8C00', // Dark orange for warnings
      },      
      screens: {
        'xs': '480px',

      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        ping: 'ping 1s cubic-bezier(0.5, 0.7, 0.2, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};