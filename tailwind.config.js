/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ultra: {
          DEFAULT: '#e8722b',
          500: '#e8722b',
          600: '#d3611f',
        },
        primary: {
          50: '#eef6ff',
          100: '#d9eafe',
          200: '#bcd9fd',
          300: '#8fc0fb',
          400: '#5aa0f5',
          500: '#0071e3',
          600: '#0062c4',
          700: '#0050a0',
          800: '#003f7d',
          900: '#00305f',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0, 0, 0, 0.12), 0 4px 10px -6px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 24px 60px -20px rgba(0, 0, 0, 0.18), 0 8px 20px -10px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
