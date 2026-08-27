import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C41E3A",
        "primary-dark": "#99002B",
        "primary-light": "#FDF0F3",
        accent: "#E31B4C",
        ink: "#1C1B20",
        "ink-light": "#2E2D35",
        paper: "#FAF8F5",
        "paper-pure": "#FFFFFF",
        stone: "#EBE7E1",
        "stone-light": "#F5F2EC",
        graphite: "#4A4742",
        ash: "#7E7A73",
        "ash-light": "#A39E96",
        brass: "#C41E3A",
        "brass-light": "#E31B4C",
        "brass-dark": "#99002B",
        cream: "#FAF8F5",
        sand: "#E5DEC9",
        error: "#B3261E",
        success: "#2E6930",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.24em",
        luxury: "0.18em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.25, 1, 0.5, 1)",
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        subtle: "0 2px 15px -3px rgba(28, 27, 32, 0.04), 0 4px 6px -4px rgba(28, 27, 32, 0.02)",
        elevation: "0 10px 30px -10px rgba(196, 30, 58, 0.12), 0 4px 6px -2px rgba(28, 27, 32, 0.03)",
        dropdown: "0 20px 40px -15px rgba(28, 27, 32, 0.16)",
        crimson: "0 8px 25px -5px rgba(196, 30, 58, 0.35)",
      },
      animation: {
        fadeIn: "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideUp: "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        slideDown: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        scaleUp: "scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        pulseSlow: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        heartPulse: "heartPulse 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        heartPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
      },

    },
  },
  plugins: [],
};
export default config;

