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
        max-width: 750px;
        margin: 0 auto;
      `}
    >
      <PageHeader header="Add User" />
      <AddUserForm onAfterSubmit={() => router.push("/")} />
    </div>
  );
};

export default AddUser;
