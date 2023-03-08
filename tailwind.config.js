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

      el1: "#272727",
      el1Accent: "#303030",
      el1Active: "#333333",

      el2: "#272727",
      el2Accent: "#208CF0",
      el2Active: "#1482DC",
    },
  },
  plugins: [],
};
