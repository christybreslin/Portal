import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
      colors: {
        "navy-blue": "#001F3F",
        "bright-blue": "#0070F3",
        "vibrant-green": "#5BC470",
        "light-grey": "#F5F7FA",
        "dark-grey": "#333333",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "navy-blue-700": "#1E293B",
        "navy-blue-800": "#1E293B",
        "navy-blue-900": "#0F172A",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 112, 243, 0.5)',
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
        "pulse-fast": {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(91, 196, 112, 0)' },
          '70%': { boxShadow: '0 0 0 3px rgba(91, 196, 112, 0.5)' },
        },
        "pulse-fast-blue": {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 31, 63, 0)' },
          '70%': { boxShadow: '0 0 0 3px rgba(0, 31, 63, 0.5)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-fast": "pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast-blue": "pulse-fast-blue 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #0F172A, #5BC470)",
      },
    },
  },
  plugins: [],
};

export default config; 