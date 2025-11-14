

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
        //text
        txtBold: '#44403B', //stone-700
        txtDefault: '#292524',  //stone-800
        txtLogo: '#441306', //orange-950
        txtTransBtn: '#CA3500',  //orange-700
        txtColorBtn: '#FFF7ED',   //orange-50
        txtColorAddBtn: "#FAFAF9", //stone-50

        //borders
        borderCard: '#D6D3D1',  //stone-300
        borderAddBtn: '#292524',  //stone-800
        borderBtn: '#CA3500',  //orange-700
      
        //fillings
        colorBtn: '#CA3500',  //orange-700
        colorAddBtn: '#44403B', //stone-700
        bgNavbar: "#F5F5F4", //stone-100
        bgSidebar: "#F5F5F4", //stone-100
        bgHover: '#E7E5E4', 	//stone-200
        bgDefault: "#FAFAF9", //stone-50
          //learn + bg cards = white
        deviderNavbar: "#7E2A0C", // orange-900
        bgAI: "#FFF7ED", // orange-50
      },

      typography: {
        //base (smallest)
          //Navbar text
          //Sign in button text
          //Learn side bar
          //Create project details + links in pattern queue
        
        //lg
          //smaller texts on homepage
          //learn content
          //create titles in pattern queue

        //xl
          //buttons on learn page (next, back)
          //create project details title

        //2xl
          //logo knittingbuddy
          //bigger texts on homepage
          //create subtitles (WIPS, visionboards)

        //3xl
          //create button on homepage

        //4xl
          //learn titles
      }

      //Layout:
        //height navbar: 1/9
        //width cards: 3/5
        //width sidebars: 1/5
        //home page:
          //height card
        //create page:
          //height WIPS: 4/5
          //height visionboards: 2/5

      //Padding:
        //button:
          //px-4
          //py-2
          //multiple buttons: gap-4
        //x padding from edge: px-8
        //y padding from edge: py-2

      //rounded-lg
      //shadow-sm

    },
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
