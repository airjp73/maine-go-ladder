import React from "react";
import Modal, { useModal } from "../components/modal/Modal";
import AddUserForm from "./AddUserForm";

const AddUserButton: React.FC = () => {
  const [active, open, close] = useModal();
  return (
    <>
      <button onClick={open}>Add User</button>
      <Modal title="Add User" active={active} onClose={close}>
        <AddUserForm />
      </Modal>
    </>
  );
};

export default AddUserButton;
