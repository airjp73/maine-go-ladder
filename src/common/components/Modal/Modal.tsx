import React, { useState, useCallback } from "react";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";

export const useModal = (): [boolean, () => void, () => void] => {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return [isOpen, open, close];
};

interface ModalProps {
  active: boolean;
  onClose: () => void;
  title: string;
}

const MotionContent = motion.custom(DialogContent);

// Annoying workaround for DialogOverlay not working with framer-motion
const MotionOverlay: React.FC<React.ComponentProps<typeof DialogOverlay>> = ({
  children,
  ...rest
}) => {
  return (
    <DialogOverlay
      css={css`
        background: none;
      `}
      {...rest}
    >
      <motion.div
        css={css`
          visibility: visible;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </DialogOverlay>
  );
};

const Modal: React.FC<ModalProps> = ({ active, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {active && (
        <MotionOverlay key="overlay" onDismiss={onClose}>
          <MotionContent
            aria-label={title}
            css={(theme: Theme) => css`
              background-color: ${theme.colors.modalBackground};
              position: relative;
              border-radius: 3px;
              padding: 1rem;
              color: ${theme.colors.blue[30].hex};
            `}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <header
              css={(theme: Theme) => css`
                display: flex;
                font-weight: bold;
                color: ${theme.colors.blue[20].hex};
              `}
            >
              <span>{title}</span>
              <button
                css={(theme: Theme) => css`
                  background: none;
                  border: none;
                  margin-left: auto;
                  font-size: 1rem;
                  color: ${theme.colors.blue[30].hex};
                `}
                onClick={onClose}
              >
                X
              </button>
            </header>
            {children}
          </MotionContent>
        </MotionOverlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
