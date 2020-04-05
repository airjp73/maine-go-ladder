import React from "react";
import Modal, { useModal } from "./Modal";
import { css } from "@emotion/core";
import { Theme } from "../../styles/theme";
import buttonStyle from "../../styles/buttonStyle";

type RenderPropApi = { close: () => void };

interface ModalButtonProps {
  title: string;
  buttonLabel: string;
  children: (renderProps: RenderPropApi) => React.ReactNode;
}

const ModalButton: React.FC<ModalButtonProps> = ({
  title,
  buttonLabel,
  children,
}) => {
  const [active, open, close] = useModal();
  return (
    <>
      <button css={buttonStyle} onClick={open}>
        {buttonLabel}
      </button>
      <Modal title={title} active={active} onClose={close}>
        {children({ close })}
      </Modal>
    </>
  );
};

export default ModalButton;
