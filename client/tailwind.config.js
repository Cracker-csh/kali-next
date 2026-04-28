export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0d1117',
          darker: '#0a0d12',
          light: '#161b22',
          green: '#00ff41',
          greenGlow: 'rgba(0, 255, 65, 0.4)',
          accent: '#008f11',
          text: '#c9d1d9',
          muted: '#8b949e',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
