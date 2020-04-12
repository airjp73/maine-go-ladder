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
      box-shadow: 1px 1px 6px ${opacify(green[90], 0.75)};
      border-radius: 3px;
    `,
  },
  headerHeight: "4rem",
};

export type Theme = typeof theme;

export default theme;
