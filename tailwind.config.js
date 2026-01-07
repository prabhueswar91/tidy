/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
    theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui"], 
        dm: ["'DM Sans'", "sans-serif"],                 
        roboto: ["'Roboto'", "sans-serif"],                
        playfair: ["'Playfair Display'", "serif"],
        open: ["'Open Sans'", "sans-serif"],        
      },
    },
  },
  plugins: [],
}
