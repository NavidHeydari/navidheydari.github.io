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
            color: "#6E6256",
            a: {
              color: "#B08968",
              textDecoration: "none",
              "&:hover": {
                color: "#8D6B4A",
                textDecoration: "underline",
              },
            },
            h1: { color: "#3A332C" },
            h2: { color: "#3A332C" },
            h3: { color: "#3A332C" },
            h4: { color: "#3A332C" },
            h5: { color: "#3A332C" },
            h6: { color: "#3A332C" },
            strong: { color: "#3A332C" },
            pre: {
              /* Dark editor block on light page — Monokai tokens need a dark bg */
              backgroundColor: "#292524",
              color: "#e5e7eb",
            },
            code: {
              /* Inline code: warm amber so it reads as "code" against body text */
              color: "#9b4222",
            },
            blockquote: {
              color: "#6E6256",
              borderLeftColor: "#D6C9B8",
            },
            hr: { borderColor: "#D6C9B8" },
            "thead th": { color: "#3A332C" },
          },
        },
        invert: {
          css: {
            color: theme(`colors.gray.200`),
            a: {
              color: theme(`colors.yellow.300`),
              "&:hover": { color: theme(`colors.yellow.500`) },
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
