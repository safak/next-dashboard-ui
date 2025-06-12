import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class', // Keep using class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // --- Optional: Add container settings ---
    container: {
      center: true,
      padding: '1rem', // Default padding
      screens: {
        '2xl': '1400px', // Max width for the container
      },
    },
    // --- Extend the default theme ---
    extend: {
      // --- Colors: Using CSS Variables for Theming ---
      colors: {
        border: 'hsl(var(--border))', // Border color
        input: 'hsl(var(--input))', // Input field border
        ring: 'hsl(var(--ring))', // Focus ring color

        background: 'hsl(var(--background))', // Main background
        foreground: 'hsl(var(--foreground))', // Main text color

        primary: {
          DEFAULT: 'hsl(var(--primary))', // Primary color (your active green)
          foreground: 'hsl(var(--primary-foreground))', // Text on primary background
          hover: 'hsl(var(--primary-hover))', // Hover state for primary elements
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // Secondary color (your button green)
          foreground: 'hsl(var(--secondary-foreground))', // Text on secondary background
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', // Error/destructive color (e.g., red)
          foreground: 'hsl(var(--destructive-foreground))', // Text on destructive background
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))', // Muted background (your emphasis color?)
          foreground: 'hsl(var(--muted-foreground))', // Muted text color (your dark text color?)
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // Accent color (can be same as primary or different)
          foreground: 'hsl(var(--accent-foreground))', // Text on accent background
          hover: 'hsl(var(--accent-hover))', // Your hover color
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))', // Popover background
          foreground: 'hsl(var(--popover-foreground))', // Popover text
        },
        card: {
          DEFAULT: 'hsl(var(--card))', // Card background (your cardBgColor)
          foreground: 'hsl(var(--card-foreground))', // Card text (usually same as foreground)
        },
      },

      // --- Border Radius ---
      borderRadius: {
        lg: 'var(--radius)', // Large radius (defined in CSS)
        md: 'calc(var(--radius) - 2px)', // Medium radius
        sm: 'calc(var(--radius) - 4px)', // Small radius
      },

      // --- Font Families ---
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans], // Use CSS var for primary sans font
        mono: ['var(--font-mono)', ...fontFamily.mono], // Use CSS var for primary mono font
      },

      // --- Keyframes for Animations ---
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        spin: {
          // Keep default spin or customize
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulse: {
          // Keep default pulse or customize
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },

      // --- Animation Utilities ---
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        spin: 'spin 1s linear infinite', // Example usage
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Example usage
      },

      // --- Background Images (keep yours) ---
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  // --- Plugins ---
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
export default config;
