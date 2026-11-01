/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  future: { hoverOnlyWhenSupported: true },
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./public/**/*.svg"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        ink: token("ink"),
        mute: token("mute"),
        faint: token("faint"),
        line: token("line"),
        hi: token("hi"),
        "accent-now": token("accent-now"),
        contrib: {
          0: token("contrib-0"),
          1: token("contrib-1"),
          2: token("contrib-2"),
          3: token("contrib-3"),
          4: token("contrib-4"),
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto-flex)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
