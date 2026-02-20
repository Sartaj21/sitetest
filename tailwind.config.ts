import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1a1f36",
          light: "#2d3352",
        },
        navy: {
          50: "#f0f1f5",
          100: "#d8dae5",
          200: "#b1b5cb",
          300: "#8a90b1",
          400: "#636b97",
          500: "#4a5280",
          600: "#3a4169",
          700: "#2d3352",
          800: "#1f243b",
          900: "#1a1f36",
          950: "#0f1220",
        },
        accent: {
          50: "#faf6ee",
          100: "#f2e9d4",
          200: "#e5d3a9",
          300: "#d4b87a",
          400: "#c9a96e",
          500: "#b08d4f",
          600: "#96743b",
          700: "#7a5c2e",
          800: "#604824",
          900: "#4a371c",
        },
        surface: "#f8f9fc",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "subtle-pulse": "subtlePulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      screens: {
        'xs': '375px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
