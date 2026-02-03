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
        // Your Custom Palette
        tajiree: {
          black: "#121212",       // Deep Charcoal (Background)
          teal: "#008080",        // Feature 1 (Calm/Modern)
          gold: "#FFD700",        // Feature 2 (Dynamic)
          orange: "#CC5500",      // Urgency (Call to Action)
          gray: "#f3f4f6",        // Light Gray (Text)
          darkgray: "#1e1e1e",    // Slightly lighter black for cards
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;