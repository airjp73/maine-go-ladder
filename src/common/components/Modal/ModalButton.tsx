import React from "react";
import Modal, { useModal } from "./Modal";
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
      <button
        css={buttonStyle}
        onClick={(event) => {
          event.stopPropagation();
          open();
        }}
      >
        {buttonLabel}
      </button>
      <Modal title={title} active={active} onClose={close}>
        {children({ close })}
      </Modal>
    </>
  );
};

export default ModalButton;
