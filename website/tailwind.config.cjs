module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mlaf: {
          DEFAULT: '#0e7490',
          light: '#0891b2'
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
