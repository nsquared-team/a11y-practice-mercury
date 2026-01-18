/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'mercury-dark': {
          DEFAULT: '#0d0d0d',
          secondary: '#1a1a1a',
          tertiary: '#262626',
        },
        // Accent colors
        'mercury-amber': '#f59e0b',
        'mercury-orange': '#ea580c',
        'mercury-gray': '#78716c',
        // Status colors
        'status-active': '#22c55e',
        'status-warning': '#f59e0b',
        'status-error': '#ef4444',
        'status-idle': '#6b7280',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 10px rgba(245, 158, 11, 0.3)',
        'glow-orange': '0 0 10px rgba(234, 88, 12, 0.3)',
      },
    },
  },
  plugins: [],
}
