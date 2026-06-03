/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "1rem"
    },
    extend: {
      fontFamily: {
        poppins: "'Poppins', sans-serif",
        roboto: "'Roboto', sans-serif"
      },
      colors: {
        "primary": "#e91e63",
        "secondary": "#4c4c4c",
        "tertiary": "#939393",
        "quaternary": "#989898",
        "quinary": "#b2b2b2",
        "senary": "#e5e5e5",
        "septenary": "#000000",
        "octonary": "#000000",
        "nonary": "#000000",
        "denary": "#000000",
      }
    },
    variants: {
      extend: {
        display: ['group-hover'],
        visibility: ['group-hover'],
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
}