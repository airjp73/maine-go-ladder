import React, { createContext, useMemo } from "react";
import Portal from "./Portal";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";
import { AnimatePresence, motion } from "framer-motion";

interface NavContextValue {
  closeNav: () => void;
}
export const NavContext = createContext<NavContextValue | null>(null);

interface SidePanelProps {
  active: boolean;
  onClose: () => void;
}

const SlideOutPanel: React.FC<SidePanelProps> = ({
  active,
  children,
  onClose,
}) => {
  const contextValue = useMemo(() => ({ closeNav: onClose }), [onClose]);
  return (
    <Portal>
      <AnimatePresence>
        {active && (
          <div
            css={css`
              position: absolute;
              right: 0;
              top: 0;
              left: 0;
              bottom: 0;
              z-index: 2;
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
              exit={{ opacity: 0 }}
            />
            <motion.header
              css={(theme: Theme) => css`
                position: fixed;
                overflow: hidden;
                background-color: ${theme.colors.blue[80].hex};
                height: 100%;
                width: 250px;
                color: ${theme.colors.blue[30].hex};
                transition: 0.25s width ease;
                z-index: 2;
              `}
              initial={{ x: "-100%" }}
              animate={{ x: "0" }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
            >
              <NavContext.Provider value={contextValue}>
                {children}
              </NavContext.Provider>
            </motion.header>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default SlideOutPanel;
