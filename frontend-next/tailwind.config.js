/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      mono: ['"SF Mono"', '"Fira Code"', "ui-monospace", "monospace"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.5" }],
      sm: ["0.875rem", { lineHeight: "1.5" }],
      base: ["1rem", { lineHeight: "1.5" }],
      lg: ["1.125rem", { lineHeight: "1.5" }],
      xl: ["1.25rem", { lineHeight: "1.3" }],
      "2xl": ["1.5rem", { lineHeight: "1.3" }],
    },
    letterSpacing: {
      tight: "-0.02em",
      normal: "0",
      wide: "0.06em",
    },
    borderRadius: {
      sm: "6px",
      md: "10px",
      full: "9999px",
    },
    extend: {
      colors: {
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          muted: "rgba(59, 130, 246, 0.08)",
        },
        success: {
          DEFAULT: "#16a34a",
          bg: "rgba(22, 163, 74, 0.08)",
        },
        error: {
          DEFAULT: "#dc2626",
          bg: "rgba(220, 38, 38, 0.06)",
          border: "rgba(220, 38, 38, 0.15)",
        },
        warning: {
          DEFAULT: "#ca8a04",
          bg: "rgba(202, 138, 4, 0.08)",
        },
      },
      maxWidth: {
        content: "560px",
      },
      opacity: {
        disabled: "0.4",
      },
      transitionTimingFunction: {
        default: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        default: "150ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 150ms cubic-bezier(0.4, 0, 0.2, 1)",
        spin: "spin 600ms linear infinite",
      },
    },
  },
  plugins: [],
};
