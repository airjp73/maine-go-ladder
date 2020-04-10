import React from "react";
import { css } from "@emotion/core";
import { motion } from "framer-motion";

interface AnimateHeightProps extends React.ComponentProps<typeof motion.div> {
  height: string | number;
}
const AnimateHeight: React.FC<AnimateHeightProps> = ({
  children,
  height,
  ...rest
}) => {
  return (
    <motion.div
      css={css`
        overflow: hidden;
        box-sizing: border-box;
      `}
      initial={{ height: 0 }}
      animate={{ height: height ?? "auto" }}
      exit={{ height: 0 }}
      layoutTransition
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default AnimateHeight;
