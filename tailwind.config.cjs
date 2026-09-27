/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        navy: 'var(--color-navy)',
        blue: 'var(--color-blue)',
        saffron: 'var(--color-saffron)',
        offwhite: 'var(--color-offwhite)',
        charcoal: 'var(--color-charcoal)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      fontFamily: {
        ui: ['var(--font-ui)'],
        heading: ['var(--font-heading)'],
      },
    },
  },
  plugins: [],
};
