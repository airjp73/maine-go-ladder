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
        background-color: ${theme.colors.blue};
      `}
      isOpen={active}
      onDismiss={onClose}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
