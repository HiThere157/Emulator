/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      darkBg: "#1A1A1A",
      lightBg: "#1D1D1D",
      whiteColor: "#F0F0F0",
      whiteColorAccent: "#A0A0A0",

      el: "#272727",
      elAccent: "#292929",
      elActive: "#303030",
    },
  },
  plugins: [],
};
