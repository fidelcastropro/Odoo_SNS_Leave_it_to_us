/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        secondary: '#64748b'
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(120deg)' },
          '66%': { transform: 'translateY(10px) rotate(240deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 60px rgba(139, 92, 246, 0.6)' },
        }
      },
      backdropBlur: {
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}