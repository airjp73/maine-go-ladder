import React from "react";
import Modal, { useModal } from "../components/modal/Modal";
import AddUserForm from "./AddUserForm";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";

const AddUserButton: React.FC = () => {
  const [active, open, close] = useModal();
  return (
    <>
      <button
        css={(theme: Theme) => css`
          background-color: ${theme.colors.green[20].hex};
          color: ${theme.colors.green[90].hex};
          border: none;
          padding: 0.5rem;
          font-size: 1rem;
          border-radius: 3px;
          box-shadow: 1px 2px 4px ${theme.colors.green[90].hex};
          outline: none;

          :hover,
          :focus {
            background-color: ${theme.colors.green[10].hex};
            box-shadow: 2px 3px 6px ${theme.colors.green[90].hex};
          }
        `}
        onClick={open}
      >
        Add User
      </button>
      <Modal title="Add User" active={active} onClose={close}>
        <AddUserForm onAfterSubmit={close} />
      </Modal>
    </>
  );
};

export default AddUserButton;
