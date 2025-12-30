// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8ed',
          100: '#fbf1db',
          200: '#f7e3b7',
          300: '#f2d593',
          400: '#edc76f',
          500: '#e9a422', // Your yellow brand color
          600: '#d79420',
          700: '#b37a1a',
          800: '#8f6115',
          900: '#6c4910',
        },
        secondary: {
          50: '#e9edf7',
          100: '#d3dbef',
          200: '#a7b7df',
          300: '#7b93cf',
          400: '#4f6fbf',
          500: '#1c4598', // Your blue brand color
          600: '#193e89',
          700: '#153473',
          800: '#112a5c',
          900: '#0d2046',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}