import { Theme } from "./theme";
import { css } from "@emotion/core";

const buttonStyle = (theme: Theme) => css`
  font-family: Roboto, sans-serif;
  background-color: ${theme.colors.green[20].hex};
  color: ${theme.colors.green[90].hex};
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 3px;
  box-shadow: 1px 2px 4px ${theme.colors.green[90].hex};
  outline: none;
  cursor: pointer;
  text-decoration: none;

  :hover,
  :focus {
    background-color: ${theme.colors.green[10].hex};
    box-shadow: 2px 3px 6px ${theme.colors.green[90].hex};
  }

  &:visited {
    color: ${theme.colors.green[90].hex};
  }

  &:disabled {
    background-color: ${theme.colors.green[70].hex};
    box-shadow: 1px 1px 2px ${theme.colors.green[90].hex};
    cursor: default;
  }
`;

export default buttonStyle;
