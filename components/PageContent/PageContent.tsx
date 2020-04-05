import React from "react";
import { motion } from "framer-motion";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";

const PageContent: React.FC<React.ComponentProps<typeof motion.div>> = ({
  children,
  className,
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
      className={className}
      css={css`
        max-width: 750px;
        margin: 0 auto;
        height: 100%;
      `}
    >
      {children}
    </div>
  </motion.div>
);

export default PageContent;
