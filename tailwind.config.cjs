module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
          'fade-in-up': {
            '0%': {
              opacity: '0',
              transform: 'translate(-50%, 20px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translate(-50%, 0)'
            },
          },
          'shake': {
            '10%': {
              transform: 'translate3d(-1px, 0, 0);'
            },
            '90%': {
              transform: 'translate3d(-1px, 0, 0);'
            },
            '20%': {
              transform: 'translate3d(2px, 0, 0);'
            },
            '80%': {
              transform: 'translate3d(2px, 0, 0);'
            },
            '30%': {
              transform: 'translate3d(-4px, 0, 0);'
            },
            '50%': {
              transform: 'translate3d(-4px, 0, 0);'
            },
            '70%': {
              transform: 'translate3d(-4px, 0, 0);'
            },
            '40%': {
              transform: 'translate3d(4px, 0, 0);'
            },
            '60%': {
              transform: 'translate3d(4px, 0, 0);'
            },
          }
      },
      animation: {
          'fade-in-up': 'fade-in-up 0.2s ease-out',
          'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
      }
    },
  },
  plugins: [],
}
