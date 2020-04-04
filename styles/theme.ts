import blue from "./blue";
import green from "./green";
import opacify from "./opacify";

const theme = {
  colors: {
    blue,
    green,
    background: opacify(green[70], 0.75),
    modalBackground: blue[10].hex,
    // background: green[90].hex,
  },
};

export type Theme = typeof theme;

export default theme;
