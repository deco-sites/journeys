import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      animation: {
        sliding: "sliding 30s linear infinite",
        slide: "slide 6s infinite",
      },
      boxShadow: {
        "header": "0 3px 3px 0 rgba(235, 235, 235, 0.4)",
      },
      colors: {
        "white": "#FFFFFF",
        "black": "#000000",
        "gray-100": "#202020",
        "gray-200": "#EBEBEB",
        "gray-300": "#cfcfcf",
        "gray-400": "#aaaaaa",
        "green-100": "#8BC43E",
        "orange-100": "#FF8C00",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        slide: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "10%": { transform: "translateY(0)", opacity: "1" },
          "40%": { opacity: "1" },
          "50%": { transform: "translateY(-100%)", opacity: "0" },
        },
      },
    },
    fontFamily: {
      primary: "'Roboto Condensed', sans-serif",
    },
  },
};
