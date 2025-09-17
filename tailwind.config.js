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
      animation: {
        "ping-slow": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      animationDelay: {
        200: "0.2s",
        400: "0.4s",
      },
    },
  },
  plugins: [],
}
