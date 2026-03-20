export default {
 content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#E6F0F0',
          100: '#CCE0E0',
          200: '#99C2C2',
          300: '#66A3A3',
          400: '#338585',
          500: '#008080',
          600: '#006666',
          700: '#004D4D',
          800: '#003333',
          900: '#001A1A',
          950: '#000D0D',
        },
      },
    },
  },
  plugins: [],
}