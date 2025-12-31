/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kech: {
          primary: '#1C448E',    // Majorelle Blue
          secondary: '#C85A3F',  // Terracotta
          accent: '#D4AF37',     // Gold
          sand: '#FDFCF6',       // Warm White
          stone: '#E8E3D9',      // Secondary BG
          dark: '#1A1A1A',       // Text
        }
      },
      fontFamily: {
        sans: ['"Lato"', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
      },
      backgroundImage: {
        'zellij-pattern': "url('https://www.transparenttextures.com/patterns/arabesque.png')",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }
    },
  },
  plugins: [],
}
