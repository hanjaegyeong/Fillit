import scrollbarHide from 'tailwind-scrollbar-hide';

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
        home: 'linear-gradient(165deg, #9DE8FA 41.69%, #C8C4F5 67.3%, #FFC9F2 90.99%)',
      },
      colors: {
        'gray-300': '#D0D0D0',
        'gray-400': '#C6C6C6',
        'gray-500': '#9A9A9A',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [scrollbarHide],
};
