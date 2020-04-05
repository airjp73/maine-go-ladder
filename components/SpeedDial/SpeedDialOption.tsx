import React from "react";
import Fab from "./Fab";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";
import { motion, usePresence } from "framer-motion";

export enum labelDirections {
  RIGHT = "RIGHT",
  LEFT = "LEFT",
}

interface SpeedDialOptionProps extends React.ComponentProps<typeof Fab> {
  label: string;
  labelDirection?: labelDirections;
}

const getLabelStyle = (labelDirection: labelDirections) => {
  switch (labelDirection) {
    case labelDirections.RIGHT:
      return css`
        top: 0.4rem;
        left: calc(100% + 0.5em);
      `;
    case labelDirections.LEFT:
      return css`
        top: 0.4rem;
        right: calc(100% + 0.5em);
      `;
  }
};

const SpeedDialOption: React.FC<SpeedDialOptionProps> = ({
  children,
  label,
  labelDirection = labelDirections.LEFT,
  style = {},
  ...rest
}) => (
  <span
    css={css`
      position: relative;
    `}
  >
    <Fab
      size="SMALL"
      initial={{ scale: 0.1 }}
      animate={{ scale: 1 }}
      exit={{
        scale: 0.1,
        transition: { type: "inertia", velocity: -1 },
      }}
      transition={{
        type: "inertia",
        velocity: 1,
      }}
      {...rest}
    >
      {children}
    </Fab>
    <motion.span
      css={(theme: Theme) => css`
        position: absolute;
        font-size: 0.7rem;
        background-color: ${theme.colors.dark};
        color: ${theme.colors.highlight};
        opacity: 0.5;
        padding: 0.5rem;
        border-radius: 5px;
        white-space: nowrap;
        cursor: default;
        ${getLabelStyle(labelDirection)}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {label}
    </motion.span>
  </span>
);
export default SpeedDialOption;
