/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Static utility classes
    "w-1/2",
    "w-1/3",
    "w-1/4",
    "w-full",
    "h-1/2",
    "h-screen",
    "border",
    "m-4",
    "flex",
    "flex-col",
    "flex-row",
    "items-center",
    "justify-between",
    "rounded",
    "rounded-lg",
    "shadow-md",
    "shadow-lg",
    "transition",
    "hover:underline",
    "hover:transform",
    "hover:scale-110",
    // Dynamically generated classes
    "bg-[#605DEC]",
    "hover:bg-[#4b48c7]",
    "hover:bg-[#4d4aa8]",
    "text-[#605DEC]",
    // For grid and repeat values in dynamic CSS interpolation
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "rotate-90",
    // Typography and spacing
    "text-xs",
    "text-sm",
    "text-base",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "scale-125",
    "scale-150",
    // ... add any other dynamic classes used in the project ...
  ],
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
