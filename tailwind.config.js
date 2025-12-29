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
        'neon-yellow': '#f8f32b',
        'neon-red': '#ff003c',
        'dark-bg': '#0a0a0f',
        'darker-bg': '#050508',
        'dark-blue': '#0f0f23',
        'dark-purple': '#1a1a2e',
        'border-purple': 'rgba(157, 78, 221, 0.3)',
        'border-blue': 'rgba(67, 97, 238, 0.3)',
        'border-pink': 'rgba(247, 37, 133, 0.3)',
        'glass-bg': 'rgba(26, 26, 46, 0.85)',
        'glass-border': 'rgba(157, 78, 221, 0.5)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spin 2s linear infinite reverse',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'ping-slow': 'ping 3s cubic-bezier(0,0,0.2,1) infinite',
      },
    },
  },
  plugins: [],
}