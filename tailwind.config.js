/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          dark: "#0a0f1d",
          panel: "#111827",
          card: "#182235",
          border: "#24324d",
          accent: "#2563eb",
          accentHover: "#1d4ed8",
        },
        status: {
          healthy: "#10b981",
          observation: "#f59e0b",
          high: "#f97316",
          critical: "#ef4444",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
