/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./index.html', '!./src/**/__tests__/*', './src/**/*.{vue,ts,tsx}'],
  important: true,
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic': 'conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
        'wheel-gradient':
          'conic-gradient(' +
          '#f9a8d4 0deg 45deg,' +
          '#fcd34d 45deg 90deg,' +
          '#a78bfa 90deg 135deg,' +
          '#93c5fd 135deg 180deg,' +
          '#f9a8d4 180deg 225deg,' +
          '#fcd34d 225deg 270deg,' +
          '#a78bfa 270deg 315deg,' +
          '#93c5fd 315deg 360deg' +
          ')'
      },
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
