import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "token-black": "var(--token-black)",
        "token-white": "var(--token-white)",
        "token-gray-mid": "var(--token-gray-mid)",
        "token-gray-light": "var(--token-gray-light)",
        "token-cream": "var(--token-cream)",
        "token-orange": "var(--token-orange)",
        "token-orange-alt": "var(--token-orange-alt)",
        "token-yellow": "var(--token-yellow)",
        "token-blue": "var(--token-blue)",
        "token-pink": "var(--token-pink)",
        "token-magenta": "var(--token-magenta)",
        "token-green": "var(--token-green)",
        "token-lime": "var(--token-lime)",
        "token-red": "var(--token-red)",
        "token-near-white": "var(--token-near-white)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
        serif: ["var(--font-serif)", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
