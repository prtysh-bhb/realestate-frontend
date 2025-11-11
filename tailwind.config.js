export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e293b",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
