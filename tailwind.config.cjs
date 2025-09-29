/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: { extend: {} },
  plugins: [],
  extend: {
  fontFamily: {
    genty: ['Genty', 'system-ui', 'sans-serif'],
  },
}
}


