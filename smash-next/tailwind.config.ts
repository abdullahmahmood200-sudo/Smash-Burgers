import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7E1CD",
        "cream-card": "#FCEFD9",
        red: {
          DEFAULT: "#E8190B",
          bright: "#FF1106",
          dark: "#B11208",
        },
        orange: "#F6A01C",
        gold: "#FFC200",
        "yellow-sun": "#FFC600",
        "yellow-bright": "#FFD23F",
        ink: "#2A1408",
        cocoa: "#7A5C3E",
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        poster: ["var(--font-poster)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        bobLite: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--r,0deg))" },
          "50%": { transform: "translateY(-14px) rotate(var(--r,0deg))" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%": { transform: "scaleY(.1)" },
        },
      },
      animation: {
        bobLite: "bobLite 6s ease-in-out infinite",
        blink: "blink 4.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
