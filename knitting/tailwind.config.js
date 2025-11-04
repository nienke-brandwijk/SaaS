/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "orange-50": "#FFF7ED",
        "orange-100": "#FFEDD4",
        "orange-200": "#FFD6A8",
        "orange-300": "#FFB86A",
        "orange-400": "#FF8904",
        "orange-500": "#FF6900",
        "orange-600": "#F54A00",
        "orange-700": "#CA3500",
        "orange-800": "#9F2D00",
        "orange-900": "#7E2A0C",
        "orange-950": "#441306",

        "stone-50": "#FAFAF9",
        "stone-100": "#F5F5F4",
        "stone-200": "#E7E5E4",
        "stone-300": "#D6D3D1",
        "stone-400": "#A6A09B",
        "stone-500": "#79716B",
        "stone-600": "#57534D",
        "stone-700": "#44403B",
        "stone-800": "#292524",
        "stone-900": "#1C1917",
        "stone-950": "#0C0A09",
      },
    },
  },
  plugins: [require('daisyui')],

  
};
