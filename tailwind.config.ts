import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F3D2E",
        soft: "#E6F4EA",
        gold: "#D4AF37",
        warm: "#FAFAF5",
      },
    },
  },
  plugins: [],
};
export default config;
