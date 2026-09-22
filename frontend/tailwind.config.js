/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1a2b",
        sky: "#e4f4ff",
        aura: "#5fe4ff",
        flame: "#ff7a45",
        gold: "#ffd166"
      },
      boxShadow: {
        aura: "0 0 0 1px rgba(95, 228, 255, 0.3), 0 15px 40px rgba(10, 30, 60, 0.35)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseAura: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(95, 228, 255, 0.25)" },
          "50%": { boxShadow: "0 0 0 12px rgba(95, 228, 255, 0)" },
        }
      },
      animation: {
        floaty: "floaty 3s ease-in-out infinite",
        pulseAura: "pulseAura 2.2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
