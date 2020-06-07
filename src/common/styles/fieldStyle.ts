import { css } from "@emotion/core";

export const fieldStyle = css`
  label {
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  > * {
    display: block;
  }
`;

export const errorStyle = css`
  font-size: 1rem;
  font-weight: bold;
`;
