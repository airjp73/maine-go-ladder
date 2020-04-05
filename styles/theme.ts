import blue from "./blue";
import green from "./green";

const theme = {
  colors: {
    blue,
    green,
    background: green[50].hex,
    modalBackground: blue[10].hex,
    dark: blue[90].hex,
    medDark: blue[80].hex,
    highlight: blue[20].hex,
    highlightSecondary: blue[40].hex,
  },
};

export type Theme = typeof theme;

export default theme;
