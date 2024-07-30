const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poiret-one': ['"Poiret One"', 'cursive'],
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'open-sans': ['"Open Sans"', 'sans-serif'],
        'poetsen-one' : ['"Poetsen One"', 'sans-serif'],
        'playfair-display-sc': ['"Playfair Display SC"', 'serif']
      },
      linearGradientDirections: {
        t: 'to top',
        tr: 'to top right',
        r: 'to right',
        br: 'to bottom right',
        b: 'to bottom',
        bl: 'to bottom left',
        l: 'to left',
        tl: 'to top left',
      },
      colors: {
        'custom-purple': '#EDAFDB',
      },
      keyframes: {
        blink: {
          '0%, 100%': { backgroundColor: 'red' },
          '14%': { backgroundColor: 'orange' },
          '28%': { backgroundColor: 'yellow' },
          '42%': { backgroundColor: 'green' },
          '57%': { backgroundColor: 'blue' },
          '71%': { backgroundColor: 'indigo' },
          '85%': { backgroundColor: 'violet' },
        },
      },
      animation: {
        blink: 'blink 2s infinite',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require('@tailwindcss/aspect-ratio')],
};
