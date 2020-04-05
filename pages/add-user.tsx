import React from "react";
import AddUserForm from "../users/AddUserForm";
import { useRouter } from "next/router";
import { css } from "@emotion/core";
import PageHeader from "../components/PageHeader/PageHeader";

const AddUser: React.FC = () => {
  const router = useRouter();
  return (
    <div
      css={css`
        padding: 1rem;
      `}
    >
      <PageHeader header="Add User" />
      <AddUserForm onAfterSubmit={() => router.push("/")} />
    </div>
  );
};

export default AddUser;
