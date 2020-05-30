import React from "react";
import { motion } from "framer-motion";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";

export const Wrapper: React.FC<React.ComponentProps<typeof motion.div>> = ({
  children,
  ...rest
}) => (
  <motion.div
    css={(theme: Theme) => css`
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: ${theme.colors.background};
      box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.5);
    `}
    {...rest}
    transition={{
      type: "spring",
      stiffness: 175,
      damping: 30,
    }}
  >
    <div
      css={css`
        height: 100%;
        overflow: auto;
        box-sizing: border-box;
      `}
    >
      {children}
    </div>
  </motion.div>
);

export const Content: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  ...rest
}) => (
  <div
    css={css`
      max-width: 750px;
      margin: 0 auto;
    `}
    {...rest}
  />
);

interface HeaderProps {
  header: string;
}

export const Header: React.FC<HeaderProps> = ({ header, children }) => (
  <header
    css={(theme: Theme) => css`
      display: flex;
      justify-content: flex-end;
      background-color: ${theme.colors.green[30].hex};
      position: sticky;
      top: 0;
      padding: 1rem;
      z-index: 1;
      height: ${theme.headerHeight};
      box-sizing: border-box;

      > * + * {
        margin-left: 1rem;
      }

      > h2 {
        color: ${theme.colors.green[90].hex};
        margin: 0 auto 0 0;
        white-space: nowrap;
      }
    `}
  >
    <h2>{header}</h2>
    {children}
  </header>
);
