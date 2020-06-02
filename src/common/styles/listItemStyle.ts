import { Theme } from "./theme";
import { css, SerializedStyles } from "@emotion/core";

const listItemStyle = (theme: Theme): SerializedStyles => css`
  padding: 0.5rem 1rem;
  box-shadow: 1px 2px 4px ${theme.colors.blue[80].hex};
  border-radius: 3px;
  display: flex;
  background-color: ${theme.colors.blue[90].hex};
  color: ${theme.colors.green[20].hex};
  outline: none;
  cursor: pointer;
  align-items: center;
  position: relative;

  :hover,
  :focus {
    background-color: ${theme.colors.blue[80].hex};
    box-shadow: 2px 3px 6px ${theme.colors.blue[80].hex};
  }
`;

export default listItemStyle;
