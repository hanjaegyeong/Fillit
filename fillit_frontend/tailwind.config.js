export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
      },
      fontSize: {
        s: '13px',
        xxs: '11px',
        small: '10px',
      },
      backgroundImage: {
        home: "url('/images/bg-image.png')",
      },
    },
  },
  plugins: ['tailwind-scrollbar-hide'],
};
