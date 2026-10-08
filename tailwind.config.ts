import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      /* 👇 AGREGA ESTO */
      backgroundImage: {
        "sidebar-gradient":
          "linear-gradient(180deg, hsl(var(--gradient-sidebar-from)) 0%, hsl(var(--gradient-sidebar-to)) 100%)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "foreground-body": "hsl(var(--foreground-body))",
        "foreground-placeholder": "hsl(var(--foreground-placeholder))",
        interactive: "hsl(var(--interactive))",
        icon: "hsl(var(--icon))",
        "input-border": "hsl(var(--input-border))",
        "input-border-focus": "hsl(var(--input-border-focus))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
          // Locker status colors
  "locker-available": {
    DEFAULT: "#D6D6D6",      // silver-300
    fill: "#F5F5F5",         // silver-100
    hover: "#E5E5E5",        // silver-200
    dark: "#333333",         // silver-800
    "dark-fill": "#141414",  // silver-950
    "dark-hover": "#292929", // silver-900
  },
  "locker-defective": {
    DEFAULT: "#FDA29B",      // danger-300
    fill: "#FEE4E2",         // danger-100
    hover: "#FECDCA",        // danger-200
    dark: "#912018",         // danger-800
    "dark-fill": "#55160C",  // danger-950
    "dark-hover": "#7A1A1A", // danger-900
  },
  "locker-occupied": {
    DEFAULT: "#BDB4FE",      // purple-300
    fill: "#EBE9FE",         // purple-100
    hover: "#D9D6FE",        // purple-200
    dark: "#4A1FB8",         // purple-800
    "dark-fill": "#27115F",  // purple-950
    "dark-hover": "#3E1C96", // purple-900
  },
  "locker-unassigned": {
    DEFAULT: "#182230",      // gray-800
    fill: "#0C111D",         // gray-950
    hover: "#101828",        // gray-900
    dark: "#D0D5DD",         // gray-300
    "dark-fill": "#F9FAFB",  // gray-50
    "dark-hover": "#F2F4F7", // gray-100
  },
  "locker-open": {
    DEFAULT: "#84CAFF",      // blue-300
    fill: "#D1E9FF",         // blue-100
    hover: "#B2DDFF",        // blue-200
    dark: "#1849A9",         // blue-800
    "dark-fill": "#102A56",  // blue-950
    "dark-hover": "#194185", // blue-900
  },
  "locker-expired": {
    DEFAULT: "#FEC84B",      // warning-300
    fill: "#FEF0C7",         // warning-100
    hover: "#FEDF89",        // warning-200
    dark: "#93370D",         // warning-800
    "dark-fill": "#4E1D09",  // warning-950
    "dark-hover": "#7A2E0E", // warning-900
  },
  "locker-schedule": {
    DEFAULT: "#EEAAFD",      // fuschia-300
    fill: "#FBE8FF",         // fuschia-100
    hover: "#F6D0FE",        // fuschia-200
    dark: "#821890",         // fuschia-800
    "dark-fill": "#47104C",  // fuschia-950
    "dark-hover": "#6F1877", // fuschia-900
  },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'elevated': 'var(--shadow-md)',
        'glass': 'var(--shadow-glass)',
        'large': 'var(--shadow-lg)',
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
