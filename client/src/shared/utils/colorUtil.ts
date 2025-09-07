const colorMap = {
  BLURPLE: "#7289DA",
  BLUE: "#3498DB",
  GREEN: "#3BA55D",
  YELLOW: "#FEE75C",
  ORANGE: "#ED4245",
  RED: "#ED4245",
  PURPLE: "#9B59B6",
  MAGENTA: "#EB459E",
  PINK: "#F47FFF",
  LIME: "#57F287",
  TURQUOISE: "#1ABC9C",
  CYAN: "#00B0F4",
};

export const getColorFromTheme = (theme: keyof typeof colorMap) => {
  return colorMap[theme] || colorMap["BLURPLE"];
};
