/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrainsMono", "monospace"],
        chewy: ["Chewy", "cursive"],
        jetbrains: ["JetBrains Mono", "monospace"],
        playwriteFR: ['"Playwrite FR Moderne"'],
        playwriteGB: ['"Playwrite GB S"'],
        sourceSerif: ['"Source Serif 4"', "serif"],
        vibur: ["Vibur", "cursive"],
      },
    },
  },
  plugins: [],
};

