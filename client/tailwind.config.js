/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',
          navyDark: '#07182c',
          blue: '#134074',
          sky: '#1d63b8',
          lightBlue: '#eef4ff',
          saffron: '#ea580c',
          saffronLight: '#fff7ed',
          green: '#15803d',
          greenLight: '#f0fdf4',
          gold: '#d97706',
          bg: '#f8fafc',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        cardHover: '0 10px 25px -5px rgba(11, 37, 69, 0.1), 0 8px 10px -6px rgba(11, 37, 69, 0.05)',
      },
    },
  },
  plugins: [],
}
