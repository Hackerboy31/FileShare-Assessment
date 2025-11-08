/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3674B5',
          dark: '#0D1164',
          light: '#578FCA',
        },
        accent: {
          blue: '#A1E3F9',
          mint: '#D1F8EF',
        },
        background: '#FFFFE3',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3674B5, #578FCA, #A1E3F9)',
      },
    },
  },
  plugins: [],
}
