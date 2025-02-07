/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dancing: ["Dancing Script", "cursive"],
        walter: ["Walter Turncoat", "cursive"],
      },
      colors: {
        circus: {
          red: "#FF1744",
          yellow: "#FFD700",
          blue: "#1E88E5",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(-5px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        glow: {
          "0%, 100%": {
            textShadow:
              "0 0 15px rgba(255,23,68,0.4), 0 0 30px rgba(255,23,68,0.2)",
            transform: "scale(1)",
          },
          "50%": {
            textShadow:
              "0 0 25px rgba(255,23,68,0.6), 0 0 50px rgba(255,23,68,0.3)",
            transform: "scale(1.02)",
          },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 1.5s ease",
        float: "float 3s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
