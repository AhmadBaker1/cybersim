export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          easy: '#22c55e',    // green
          medium: '#f97316',  // orange
          hard: '#ef4444',    // red
        },
        keyframes: {
          bounceCustom: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-8px)' },
          },
        },
        animation: {
          bounce: 'bounceCustom 1s infinite',
        },
      },
    },
    plugins: [],
  }
  