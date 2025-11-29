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
        do:["'Do Hyeon'", "sans-serif"], 
        awesome:["'Awesome Serif VAR'","serif"],
        dt:["'DT Getai Grotesk Display'", "sans-serif"],      
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".font-semi": {
          "font-variation-settings": `"wght" 600`, // semi-bold
        },
        ".font-extra-tall": {
          "font-variation-settings": `"YTLC" 750`, // example axis (You’ll replace with real axis tag)
        },
      });
    },
  ],
}
