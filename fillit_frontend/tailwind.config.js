export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      backgroundImage: {
        'home-bg': "url('/images/bg-image.png')",
      },
    },
  },
  plugins: [],
};
