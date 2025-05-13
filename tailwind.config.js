module.exports = {
  // ... other config
  theme: {
    extend: {
      keyframes: {
        modalSlideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px) scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'modalSlideIn': 'modalSlideIn 0.3s ease-out forwards',
        'fadeIn': 'fadeIn 0.3s ease-out forwards'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    }
  }
} 