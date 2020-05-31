import React from "react";
import "styled-components/macro";
import Portal from "./Portal";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";
import { AnimatePresence, motion } from "framer-motion";

interface SidePanelProps {
  active: boolean;
  onClose: () => void;
}

const SlideOutPanel: React.FC<SidePanelProps> = ({
  active,
  children,
  onClose,
}) => {
  return (
    <Portal>
      <AnimatePresence>
        {active && (
          <div
            css={`
              position: absolute;
              right: 0;
              top: 0;
              left: 0;
              bottom: 0;
            `}
            key="side-panel"
          >
            <motion.div
              css={css`
                position: fixed;
                height: 100vh;
                width: 100vw;
                background-color: rgba(0, 0, 0, 0.5);
              `}
              key="overlay"
              onClick={onClose}
              data-testid="slide-out-panel-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
            />
            <motion.header
              css={(theme: Theme) => css`
                position: fixed;
                overflow: hidden;
                background-color: ${theme.colors.blue[80].hex};
                height: 100%;
                width: 175px;
                color: ${theme.colors.blue[30].hex};
                transition: 0.25s width ease;
              `}
              initial={{ x: "-100%" }}
              animate={{ x: "0" }}
              exit={{ x: "-100%" }}
            >
              {children}
            </motion.header>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default SlideOutPanel;
