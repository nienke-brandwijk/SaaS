

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  
  plugins: [require('daisyui')],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#CA3500", // orange-700
          secondary: "#7E2A0C", // orange-900
          accent: "#FFF7ED", // orange-50 (lichtere accentkleur)
          neutral: "#292524", // stone-800
          "base-100": "#FFFFFF", // white (lichte achtergrond)
          "base-200": "#FAFAF9", //stone-50
          "base-300": "#F5F5F4", //stone-100
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  
};
