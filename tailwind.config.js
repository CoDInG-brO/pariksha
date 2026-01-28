
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        accent: "var(--accent)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "border-color": "var(--border-color)"
      }
    }
  },
  plugins: []
}
