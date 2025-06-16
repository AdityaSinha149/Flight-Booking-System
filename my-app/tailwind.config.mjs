export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
      fontFamily: {
        niconne: ["Niconne", "cursive"],
        italianno: ["italianno", "sans-serif"],
        quintessential: ["Quintessential", "cursive"],
        merriweather: ["Merriweather", "serif"],
        newsreader: ["Newsreader", "serif"]
      }
    }
  },
  plugins: []
};
