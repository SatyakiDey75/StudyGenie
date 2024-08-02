/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
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
        body: ['Inter', 'sans-serif'], // Define font family for body
        heading: ['Inter', 'sans-serif'], // Define font family for headings
        // Add more custom font families as needed
      },
      colors: {
        background: {
          DEFAULT: 'hsl(240, 100%, 100%)',
        },
        foreground: {
          DEFAULT: 'hsl(240, 10%, 3.9%)',
        },
        card: {
          DEFAULT: 'hsl(240, 100%, 100%)',
          foreground: 'hsl(240, 10%, 3.9%)',
        },
        popover: {
          DEFAULT: 'hsl(240, 100%, 100%)',
          foreground: 'hsl(240, 10%, 3.9%)',
        },
        primary: {
          DEFAULT: 'hsl(240, 5.9%, 10%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(240, 4.8%, 95.9%)',
          foreground: 'hsl(240, 5.9%, 10%)',
        },
        muted: {
          DEFAULT: 'hsl(240, 4.8%, 95.9%)',
          foreground: 'hsl(240, 3.8%, 45%)',
        },
        accent: {
          DEFAULT: 'hsl(240, 4.8%, 95.9%)',
          foreground: 'hsl(240, 5.9%, 10%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 72%, 51%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        border: 'hsl(240, 5.9%, 90%)',
        input: 'hsl(240, 5.9%, 90%)',
        ring: 'hsl(240, 5.9%, 10%)',
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