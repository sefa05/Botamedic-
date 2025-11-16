import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6B00',
          dark: '#E65F00'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
