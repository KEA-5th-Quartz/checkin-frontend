import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '1024px',
      md: '1280px',
      lg: '1440px',
    },
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
      colors: {
        black: {
          0: '#000000',
          1: '#0C0C0C',
          2: '#313030',
        },
        gray: {
          0: '#51525B',
          1: '#959393',
          2: '#D2D2D2',
          3: '#F5F5F5',
          4: '#EEEEEE',
        },
        primary: {
          0: '#232D64',
          1: '#223F59',
          2: '#D7E2FF',
          3: '#3570FF',
          4: '#48C5FF',
          5: '#D5E2F2',
        },
        white: {
          0: '#FFFFFF',
          1: '#F9F7FD',
          2: '#FAFAFA',
        },
        blue: {
          0: '#2E2E48',
          1: '#5D5D9D',
          2: '#7E73FF',
          3: '#5B4DFF',
          4: '#F3F9FF',
        },
        red: {
          0: '#FFCCCC',
          1: '#FE2222',
          2: '#FF3C3C',
        },
        orange: {
          0: '#FFE2D1',
          1: '#FF8738',
        },
        green: {
          0: '#D6F4D0',
          1: '#45D934',
        },
      },
    },
  },
};
export default config;
