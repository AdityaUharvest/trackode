/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js", // Flowbite
    "./node_modules/@shadcn/ui/components/**/*.{js,ts,jsx,tsx}", // ShadCN UI
    "./src/**/*.{js,ts,jsx,tsx}",     // Your source files
    "./public/index.html",            // Any static HTML files
  ],
  theme: {
    extend: {}, // Customize Tailwind here if needed
  },
  plugins: [
    // require("flowbite/plugin"),       // Flowbite Plugin
    // require("@shadcn/ui/plugin"),    // ShadCN Plugin
  ],
};
