/** @type {import('tailwindcss').Config} */
export default {
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
        'space': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin 15s linear infinite reverse',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-foreground)",
        },
        // NARA Sky Blue + Navy Palette (from logo)
        ocean: {
          deep: "#001F54",
          medium: "#00BFFF",
          light: "#87CEEB",
        },
        // Logo-exact colors
        'logo-blue': {
          DEFAULT: '#00BFFF',  // Deep Sky Blue (primary)
          light: '#87CEEB',    // Light Sky Blue
          dark: '#001F54',     // Navy Blue
        },
        // OFFICIAL NARA Government Color Palette (Technical Specification v1.0)
        'nara': {
          'navy': '#003366',      // Primary Navy Blue - Headers, buttons, links
          'blue': '#0066CC',      // Secondary Light Blue - Accents, highlights
          'white': '#FFFFFF',     // White - Backgrounds
          'gray': '#333333',      // Dark Gray - Body text
        },
        'gov': {
          'primary': '#003366',   // Government Primary - Navy Blue
          'secondary': '#0066CC', // Government Secondary - Light Blue
          'text': '#333333',      // Government Text - Dark Gray
          'bg': '#FFFFFF',        // Government Background - White
        },
        coral: {
          warm: "var(--color-coral-warm)",
        },
        surface: "var(--color-surface)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Space Grotesk + Inter Typography System
        headline: ['Space Grotesk', 'sans-serif'],
        subheading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        cta: ['Space Grotesk', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // Multi-language support fonts
        'tamil': ['Noto Sans Tamil', 'sans-serif'],
        'sinhala': ['Noto Sans Sinhala', 'sans-serif'],
        'multi-lang': ['Inter', 'Noto Sans Tamil', 'Noto Sans Sinhala', 'sans-serif'],
      },
      fontSize: {
        // NASA/Scientific Typography Scale
        'hero': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'subheading': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.025em' }],
      },
      spacing: {
        // Scientific/NASA Spacing System
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Advanced Ocean + NASA Animations
        "ocean-pulse": "ocean-pulse 3s ease-in-out infinite",
        "data-flow": "data-flow 4s ease-in-out infinite",
        "depth-reveal": "depth-reveal 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "parallax-float": "parallax-float 6s ease-in-out infinite",
        "particle-drift": "particle-drift 8s linear infinite",
        "counter": "counter-animate 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "glass-shimmer": "glass-shimmer 2s infinite linear",
        "coin-spin": "coin-spin 6s ease-in-out infinite",
      },
      keyframes: {
        "coin-spin": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ocean-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 30px rgba(0, 191, 255, 0.3)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 50px rgba(0, 191, 255, 0.6)",
          },
        },
        "data-flow": {
          "0%": {
            transform: "translateX(-100%) translateY(-100%)",
            opacity: "0",
          },
          "25%": {
            opacity: "0.5",
          },
          "50%": {
            opacity: "1",
            transform: "translateX(0) translateY(0)",
          },
          "75%": {
            opacity: "0.5",
          },
          "100%": {
            transform: "translateX(100%) translateY(100%)",
            opacity: "0",
          },
        },
        "depth-reveal": {
          from: {
            transform: "translateY(30px) rotateX(15deg)",
            opacity: "0",
            filter: "blur(4px)",
          },
          to: {
            transform: "translateY(0) rotateX(0deg)",
            opacity: "1",
            filter: "blur(0)",
          },
        },
        "parallax-float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "25%": {
            transform: "translateY(-10px) rotate(1deg)",
          },
          "50%": {
            transform: "translateY(-20px) rotate(0deg)",
          },
          "75%": {
            transform: "translateY(-10px) rotate(-1deg)",
          },
        },
        "particle-drift": {
          "0%": {
            transform: "translateX(0) translateY(0) scale(1)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateX(100px) translateY(-100px) scale(0.5)",
            opacity: "0",
          },
        },
        "counter-animate": {
          from: {
            transform: "translateY(20px)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "glass-shimmer": {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
      },
      boxShadow: {
        // NARA Shadow System
        'ocean-depth': '0 4px 16px rgba(0, 31, 84, 0.2), 0 8px 32px rgba(0, 31, 84, 0.1), 0 16px 64px rgba(0, 31, 84, 0.05)',
        'coral-glow': '0 0 24px rgba(249, 115, 22, 0.3), 0 0 48px rgba(249, 115, 22, 0.15)',
        'scientific': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'glass': '0 4px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'ocean': '12px',
        'glass': '16px',
      },
      transitionTimingFunction: {
        'ocean': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        'ocean': '400ms',
        'flow': '800ms',
      },
      gridTemplateColumns: {
        'ocean-hero': '60% 40%',
        'portal-cards': 'repeat(auto-fit, minmax(320px, 1fr))',
        'data-grid': 'repeat(auto-fit, minmax(280px, 1fr))',
        'research-grid': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
      aspectRatio: {
        'ocean': '16 / 9',
        'portrait': '3 / 4',
        'square': '1 / 1',
        'golden': '1.618 / 1',
      },
      // Glass Morphism Utilities
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #001F54 0%, #87CEEB 100%)',
        'sky-gradient': 'linear-gradient(135deg, #00BFFF 0%, #87CEEB 100%)',
        'coral-gradient': 'linear-gradient(135deg, var(--color-coral-warm) 0%, var(--color-accent) 100%)',
      },
      // Particle System Support
      scale: {
        '102': '1.02',
        '105': '1.05',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}