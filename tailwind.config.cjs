/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1115",
        surface: "#171A21",
        border: "rgba(255,255,255,0.08)",
        accent: "#7C5CFF",
        muted: "#9CA3AF",
        primaryText: "#E5E7EB",
      },
    },
  },
  plugins: [],
};
