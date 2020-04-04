import React from "react";
import Modal, { useModal } from "../components/modal/Modal";

const AddUserButton: React.FC = () => {
  const [active, open, close] = useModal();
  return (
    <>
      <button onClick={open}>Add User</button>
      <Modal active={active} onClose={close}>
        <h1>Hi!</h1>
      </Modal>
    </>
  );
};

export default AddUserButton;
