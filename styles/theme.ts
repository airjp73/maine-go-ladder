import blue from "./blue";
import green from "./green";
import opacify from "./opacify";

const theme = {
  colors: {
    blue,
    green,
    background: green[50].hex,
    modalBackground: blue[10].hex,
  },
};

export type Theme = typeof theme;

export default theme;
