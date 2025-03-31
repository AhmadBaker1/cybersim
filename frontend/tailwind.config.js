import textshadow from 'tailwindcss-textshadow';


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        neon: '0 0 6px #0f0, 0 0 12px #0f0',
      },
      fontFamily: {
        terminal: ['"Share Tech Mono"', 'monospace'],
      },
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
        slideDown: {
          '0%': { transform: 'translateY(-10%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        bounce: 'bounceCustom 1s infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [textshadow],
}
