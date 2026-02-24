module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mlaf: {
          DEFAULT: '#800000',
          light: '#A52A2A',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
