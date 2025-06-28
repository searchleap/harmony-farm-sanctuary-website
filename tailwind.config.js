/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Harmony Farm Sanctuary brand colors
        sanctuary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bae5ba',
          300: '#8bd48b',
          400: '#5aba5a',
          500: '#3ea03e',
          600: '#2d7f2d',
          700: '#266526',
          800: '#225122',
          900: '#1e431e',
        },
        earth: {
          50: '#faf8f3',
          100: '#f4f0e6',
          200: '#e8ddcc',
          300: '#d9c7a8',
          400: '#c8ab81',
          500: '#bc9864',
          600: '#a68357',
          700: '#8a6b4a',
          800: '#715742',
          900: '#5c4736',
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}