const theme = require("tailwindcss/defaultTheme");

module.exports = {
  important: true,
  content: [
    "content/**/*.md",
    "layouts/**/*.html",
    "./themes/**/layouts/**/*.html",
    "./content/**/layouts/**/*.html",
    "./layouts/**/*.html",
    "./content/**/*.html",
  ],
  safelist: ['pagination', 'page-item'],
  darkMode: "class", // 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: (theme) => ({
        darkest: theme(`colors.stone.900`),
        darker: theme(`colors.stone.800`),
        dark: theme(`colors.stone.700`),
      }),
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "code::before": false,
            "code::after": false,
            /* warm-700: cool dark blue-gray — body copy recedes, creating depth */
            color: "#3A5570",
            a: {
              /* warm-500: primary accent blue — links are immediately recognisable */
              color: "#1F65B8",
              textDecoration: "none",
              "&:hover": {
                /* warm-600: darker blue on hover */
                color: "#1550A0",
                textDecoration: "underline",
              },
            },
            /* warm-900: deep navy — headings advance against cool body text */
            h1: { color: "#0F2040" },
            h2: { color: "#0F2040" },
            h3: { color: "#0F2040" },
            h4: { color: "#0F2040" },
            h5: { color: "#0F2040" },
            h6: { color: "#0F2040" },
            strong: { color: "#0F2040" },
            pre: {
              /* Dark editor block on light page — Monokai tokens need a dark bg */
              backgroundColor: "#0F1C2E",
              color: "#e2e8f0",
            },
            code: {
              /* Inline code: warm-600 so it reads as "code" distinct from link blue */
              color: "#1550A0",
            },
            blockquote: {
              color: "#3A5570",
              borderLeftColor: "#B9D0EA",
            },
            hr: { borderColor: "#B9D0EA" },
            "thead th": { color: "#0F2040" },
          },
        },
        invert: {
          css: {
            color: theme(`colors.gray.200`),
            a: {
              color: "#D4AF37",
              "&:hover": { color: "#B8860B" },
            },
            h1: { color: theme(`colors.gray.200`) },
            h2: { color: theme(`colors.gray.200`) },
            h3: { color: theme(`colors.gray.200`) },
            h4: { color: theme(`colors.gray.200`) },
            h5: { color: theme(`colors.gray.200`) },
            h6: { color: theme(`colors.gray.200`) },
            strong: { color: theme(`colors.gray.200`) },
            td: { color: theme(`colors.gray.200`) },
            blockquote: { color: theme(`colors.gray.200`) },
            pre: {
              backgroundColor: theme(`colors.stone.700`),
            },
            code: { color: theme(`colors.gray.200`) },
          },
        },
      }),
    },
  },
  variants: { typography: ["invert"], extend: {} },
  plugins: [require("@tailwindcss/typography")],
};
