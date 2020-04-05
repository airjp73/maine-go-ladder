import React from "react";
import { Theme } from "../../styles/theme";
import { css } from "@emotion/core";

interface PageHeaderProps {
  header: String;
}

const PageHeader: React.FC<PageHeaderProps> = ({ header, children }) => (
  <header
    css={(theme: Theme) => css`
      display: flex;
      justify-content: flex-end;
      > * + * {
        margin-left: 1rem;
      }

      > h2 {
        color: ${theme.colors.green[90].hex};
        margin: 0 auto 0 0;
      }
    `}
  >
    <h2>{header}</h2>
    {children}
  </header>
);

export default PageHeader;
