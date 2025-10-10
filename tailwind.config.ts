import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#1351B4',
          25: '#F8F9FC',
          50: '#EBF1FA',
          600: '#0C3E8F',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-10px) translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
