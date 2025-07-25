/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'fluorescent-green': '#39FF14',
        'fluorescent-red': '#FF073A',
        'vivid-red': '#DC2626',
      }
    },
  },
  plugins: [],
}