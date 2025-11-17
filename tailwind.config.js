/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-900': '#0b0f14',
        'bg-800': '#0f1720',
        'bg-700': '#111827',
        'surface-600': '#1f2937',
        'muted-400': '#9ca3af',
        'text-100': '#e6eef8',
        'accent-500': '#7c3aed',
        'accent-400': '#8b5cf6',
        'success-500': '#10b981',
        'danger-500': '#ef4444',
        'glass-10': 'rgba(255,255,255,0.04)',
        'border-300': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'soft': '0 6px 18px rgba(2,6,23,0.6)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

