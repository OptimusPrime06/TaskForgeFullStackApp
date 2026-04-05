/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Core editorial UI mapping from PALETTE_AND_FONTS_DESIGN.md
        surface: "#f8f9ff",
        surface_bright: "#ffffff",
        surface_container_lowest: "#ffffff",
        surface_container_low: "#eff4ff",
        surface_container: "#d3e4fe",
        surface_container_high: "#c7c4d8",
        surface_container_highest: "#d3e4fe",
        
        on_surface: "#0b1c30",
        on_surface_variant: "#464555",
        outline_variant: "rgba(199, 196, 216, 0.2)",
        
        primary: "#3525cd",
        primary_container: "#4f46e5",
        
        error: "#ba1a1a",
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#f8f9ff",
        foreground: "#0b1c30",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
