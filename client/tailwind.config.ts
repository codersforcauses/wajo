import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const greyscale = {
  900: "#212121",
  800: "#424242",
  700: "#616161",
  600: "#757575",
  500: "#9e9e9e",
  400: "#bdbdbd",
  300: "#e0e0e0",
  200: "#eeeeee",
  100: "#f5f5f5",
  50: "#fafafa",
};

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        sans: ["var(--font-urbanist)", ...fontFamily.sans],
        roboto: ["var(--font-roboto)", ...fontFamily.sans],
      },
      colors: {
        yellow: "#ffd700",
        grey: "#a9a9a9",
        black: "#000000",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#ffffff",
        foreground: "hsl(var(--foreground))",

        primary: "#f8b400",
        secondary: "#f9c732",
        success: "#00c247",
        info: "#004ce8",
        warning: "#ffe16a",
        error: "#ff3333",
        disabled: "#d8d8d8",
        disabledBtn: "#879ac1",

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        greyscale,
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
} satisfies Config;

export default config;
