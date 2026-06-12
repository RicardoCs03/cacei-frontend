/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18529D',   // Azul institucional UV (24, 82, 157)
        secondary: '#28AD56', // Verde institucional UV (40, 173, 86)
        accent: '#FFFFFF'     // Blanco institucional UV
      }
    }
  },
  plugins: []
}
