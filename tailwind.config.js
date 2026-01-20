/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        brick: {
          red: '#DC2626',
          dim: '#450a0a',
          concrete: '#262626',
          light: '#a3a3a3'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.2s infinite',
        'noise': 'noise 0.2s steps(2) infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '100%': { opacity: '1' }
        },
        noise: {
          '0%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-0.5%,-0.5%)' },
          '20%': { transform: 'translate(0.5%,0.5%)' },
          '30%': { transform: 'translate(-1%,0)' },
          '40%': { transform: 'translate(1%,0.5%)' },
          '50%': { transform: 'translate(-0.5%,-0.5%)' },
          '60%': { transform: 'translate(0,1%)' },
          '70%': { transform: 'translate(0.5%,0.5%)' },
          '80%': { transform: 'translate(0.5%,-0.5%)' },
          '90%': { transform: 'translate(0,0.5%)' },
          '100%': { transform: 'translate(-0.5%,0)' },
        }
      }
    }
  },
  plugins: [],
}
