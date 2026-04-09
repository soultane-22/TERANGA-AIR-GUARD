/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <-- C'EST LA LIGNE QUI DÉBLOQUE LE BOUTON
  theme: {
    extend: {},
  },
  plugins: [],
}