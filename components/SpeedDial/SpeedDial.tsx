import React, { useState, useRef } from "react";
import { css } from "@emotion/core";
import { MoreHorizontal } from "react-feather";
import { labelDirections } from "./SpeedDialOption";
import useClickOutside from "./useClickOutside";
import Fab from "./Fab";
import { AnimatePresence, motion } from "framer-motion";

interface SpeedDialProps {
  className?: string;
  direction?: "UP" | "DOWN" | "LEFT" | "RIGHT";
  icon?: React.ReactNode;
  flowDirection?: string;
}

const flowMargins: { [key: string]: string } = {
  "column-reverse": "margin-bottom",
  column: "margin-top",
  row: "margin-left",
  "row-reverse": "margin-right",
};
const directionStyles = {
  UP: (flowDirection: string = "column-reverse") => css`
    bottom: calc(100% + 1rem);
    flex-direction: ${flowDirection};

    > * + * {
      ${flowMargins[flowDirection]}: 0.5rem;
    }
  `,
  DOWN: (flowDirection: string = "column") => css`
    top: calc(100% + 1rem);
    flex-direction: ${flowDirection};

    > * + * {
      ${flowMargins[flowDirection]}: 0.5rem;
    }
  `,
  LEFT: (flowDirection: string = "column-reverse") => css`
    right: calc(100% + 1rem);
    bottom: 0.25rem;
    flex-direction: ${flowDirection};

    > * + * {
      ${flowMargins[flowDirection]}: 0.5rem;
    }
  `,
  RIGHT: (flowDirection: string = "column-reverse") => css`
    left: calc(100% + 1rem);
    top: 0.25rem;
    flex-direction: ${flowDirection};

    > * + * {
      ${flowMargins[flowDirection]}: 0.5rem;
    }
  `,
};

const SpeedDial: React.FC<SpeedDialProps> = ({
  children,
  className,
  direction,
  icon,
  flowDirection,
}) => {
  const [open, setOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  useClickOutside(buttonRef, () => setOpen(false));

  return (
    <div
      css={css`
        position: relative;
        z-index: 1;
      `}
      className={className}
    >
      <Fab onClick={() => setOpen((prevOpen) => !prevOpen)} ref={buttonRef}>
        {icon || <MoreHorizontal height="1.5rem" width="1.5rem" />}
      </Fab>

      <div
        css={css`
          position: absolute;
          display: flex;
          align-items: center;
          width: 100%;
          ${!open && "pointer-events: none;"}
          ${direction && directionStyles[direction](flowDirection)}
        `}
      >
        <AnimatePresence>
          {open &&
            React.Children.map(children, (child, index) =>
              React.cloneElement(child as React.ReactElement, {
                key: index,
                labelDirection:
                  direction === "RIGHT"
                    ? labelDirections.RIGHT
                    : labelDirections.LEFT,
              })
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

SpeedDial.defaultProps = {
  direction: "UP",
};

export default SpeedDial;
