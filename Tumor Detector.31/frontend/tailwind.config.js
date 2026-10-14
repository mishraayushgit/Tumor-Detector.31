/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05050A',
        plum: '#2A1650',
        mint: '#C9F5F0',
        mintbg: '#DDF3F0',
        amber: '#F59E0B',
        success: '#34D399',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
