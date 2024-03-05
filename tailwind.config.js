/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html","./assets/**/*.html,*.yaml"],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
}

