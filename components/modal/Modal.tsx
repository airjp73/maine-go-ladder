import React, { useState, useCallback } from "react";
import { Dialog } from "@reach/dialog";
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
}

const Modal: React.FC<ModalProps> = ({ active, onClose, children }) => {
  return (
    <Dialog
      css={(theme: Theme) => css`
        background-color: ${theme.colors.modalBackground};
        position: relative;
        border-radius: 3px;
      `}
      isOpen={active}
      onDismiss={onClose}
    >
      <button
        css={(theme: Theme) => css`
          background: none;
          border: none;
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1rem;
          color: ${theme.colors.green[50].hex};
        `}
        onClick={onClose}
      >
        X
      </button>
      {children}
    </Dialog>
  );
};

export default Modal;
