/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 赛博朋克配色
        'neon-purple': '#9d4edd',
        'neon-blue': '#4361ee',
        'neon-pink': '#f72585',
        'neon-cyan': '#4cc9f0',
        'neon-green': '#4895ef',
        'neon-red': '#f72585',
        'dark-bg': '#0a0a0f',
        'dark-purple': '#1a1a2e',
        'border-purple': 'rgba(157, 78, 221, 0.3)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spin 2s linear infinite reverse',
      },
    },
  },
  plugins: [],
}