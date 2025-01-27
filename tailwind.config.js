/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js", // Add Flowbite components
    "./src/**/*.{js,jsx,ts,tsx}",     // Add your project paths
    "./public/index.html",            // Include any HTML files if used
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),       // Add Flowbite plugin
  ],
};
