/** @type {import('tailwindcss').Config} */
export default {
  content: ["./safelist.html"], 
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        niconne: ["Niconne", "cursive"],
        italianno: ["italianno", "sans-serif"],
        quintessential: ["Quintessential", "cursive"],
        merriweather: ["Merriweather", "serif"],
        newsreader: ["Newsreader", "serif"],
      },
    },
  },
  plugins: [],
};
