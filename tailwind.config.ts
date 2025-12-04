import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vmotiv8: {
          primary: "#4F46E5",
          secondary: "#7C3AED",
          accent: "#EC4899",
          dark: "#1E1B4B",
          light: "#EEF2FF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
