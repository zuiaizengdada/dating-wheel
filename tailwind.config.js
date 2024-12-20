/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./index.html', '!./src/**/__tests__/*', './src/**/*.{vue,ts,tsx}'],
  important: true,
  theme: {
    extend: {
      keyframes: {
        wheelSpin: {
          '0%': {
            transform: 'rotate(0deg)',
            opacity: '0.3'
          },
          '50%': {
            opacity: '0.5'
          },
          '100%': {
            transform: 'rotate(360deg)',
            opacity: '0.3'
          }
        }
      },
      animation: {
        'wheel-spin': 'wheelSpin 3s linear infinite'
      },
      transitionDuration: {
        1500: '1500ms'
      }
    }
  }
}
