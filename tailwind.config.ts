import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@beweco/aurora-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
      },
      colors: {
        primary: {
          100: "#DFEDFE",
          200: "#BFD9FD",
          300: "#9FC0FA",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        secondary: {
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        base: {
          oscura: "#0A2540",
          superficie: "#355452",
          teal: "#75C9C8",
        },
        soft: {
          cian: "#67E8F9",
          aqua: "#CCFBF1",
        },
        semantic: {
          success: "#4ADE80",
          error: "#F87171",
          warning: "#FBBF24",
          info: "#38BDF8",
        },
        accent: "#FAD19E",
        linda: "#FEF3C7",
      },
      fontSize: {
        h1: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        button: ["14px", { lineHeight: "1", fontWeight: "600" }],
      },
      spacing: {
        "bewe-1": "4px",
        "bewe-2": "8px",
        "bewe-3": "12px",
        "bewe-4": "16px",
        "bewe-5": "24px",
        "bewe-6": "32px",
        "bewe-7": "48px",
      },
      maxWidth: {
        container: "1152px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
