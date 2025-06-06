/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6b4226',
        secondary: '#e8d5c4',
        accent: '#8b5a2b',
        'text-color': '#333',
        'light-bg': '#f9f3ee',
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

