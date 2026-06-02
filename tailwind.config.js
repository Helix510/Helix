/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00cfb4",
        secondary: "#8c92b5",
        background: "#08090d",
        surface: "#0c0e14",
        border: "#1d2030",
        success: "#2de2a0",
        danger: "#ff4f70",
        info: "#3b82f6",
        muted: "#8c92b5",
        input: "#111318",
        breadcrumb: "#454866"
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
