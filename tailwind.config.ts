import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        switzer: ["var(--font-switzer)", "sans-serif"],
      },
      colors: {
        "bg-dark": "#050505",
        "bg-light": "#e6e6e6",
        "surface-01": "rgba(255,255,255,0.05)",
        "surface-02": "#151515",
        "surface-04": "rgba(255,255,255,0.07)",
        "surface-pill": "rgba(21,21,21,0.8)",
        "cta-01": "rgba(255,255,255,0.1)",
        "cta-02": "#ffffff",
        "on-solid": "#030303",
        "dim-50": "rgba(255,255,255,0.5)",
        "dim-60": "rgba(255,255,255,0.6)",
        "mute-80": "rgba(255,255,255,0.8)",
        "card-light": "#ffffff",
        "icon-light": "#e6e6e6",
        "on-light": "#000000",
        "on-light-60": "rgba(0,0,0,0.6)",
        "on-light-80": "rgba(0,0,0,0.8)",
      },
      borderRadius: {
        xs: "1px",
        menu: "var(--r-menu)",
        chip: "var(--r-chip)",
        tile: "var(--r-tile)",
        pill: "var(--r-pill)",
        card: "var(--r-card)",
        "card-lg": "var(--r-card-lg)",
        service: "var(--r-service)",
      },
      backgroundSize: {
        shine: "300% 300%",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shine: "shine var(--duration, 14s) linear infinite",
      },
      boxShadow: {
        service: "0px 8px 20px 0px rgba(0,0,0,0.05)",
        contact: "0px 0px 20px 5px rgba(255,43,43,0)",
        tile: "0px 8px 13px 0px rgba(0,0,0,0)",
      },
    },
  },
  plugins: [],
};

export default config;
