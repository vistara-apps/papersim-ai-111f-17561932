
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 13%, 18%)',
        accent: 'hsl(240, 5%, 38%)',
        bg: 'hsl(220, 13%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        'secondary-text': 'hsl(220, 13%, 40%)',
        text: 'hsl(220, 13%, 18%)',
        border: 'hsl(220, 13%, 91%)',
        muted: 'hsl(220, 13%, 96%)',
      },
      spacing: {
        'xs': '8px',
        'sm': '8px', 
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px', 
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 250ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
      typography: {
        display: ['text-2xl', { fontWeight: '600' }],
        heading: ['text-lg', { fontWeight: '500' }],
        body: ['text-base', { fontWeight: '400', lineHeight: '1.75rem' }],
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms', 
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
