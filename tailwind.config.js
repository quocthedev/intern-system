import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        "dashboard-bg": "#DDEAFB",
        title: "#2B3674",
        grey: "rgba(128, 128, 128, 0.55)",
      },
      width: {
        "sidebar-expand": "250px",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
