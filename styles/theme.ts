import blue from "./blue";
import green from "./green";
import { css } from "@emotion/core";
import opacify from "./opacify";

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
  styles: {
    raisedBox: css`
      padding: 1rem;
      background-color: ${green[40].hex};
      box-shadow: 1px 2px 2px ${opacify(green[90], 0.75)};
    `,
  },
};

export type Theme = typeof theme;

export default theme;
