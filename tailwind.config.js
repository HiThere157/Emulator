/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      transitionProperty: {
        size: "max-height, height, max-width, width",
      },
    },
    colors: {
      darkBg: "#131313",
      lightBg: "#1A1A1A",

      redColor: "#B92828",
      whiteColor: "#F0F0F0",
      greyColor: "#A0A0A0",

      el1: "#272727",
      el1Accent: "#303030",
      el1Active: "#333333",

      el2: "#272727",
      el2Accent: "#208CF0",
      el2Active: "#1482DC",

      el3: "#208CF0",
      el3Accent: "#1482DC",
      el3Active: "#1078CC",
    },
  },
  plugins: [],
};
