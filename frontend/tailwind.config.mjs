import { Anton } from 'next/font/google';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily : {
        anton : ['var(--font-anton)','sans-serif'],
        pacifico : ['var(--font-pacifico)','sans-serif'],
        amaranth : ['var(--font-amaranth)' ,'sans-serif'],
        comic : ['var(--font-comic)' ,'sans-serif']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
};
