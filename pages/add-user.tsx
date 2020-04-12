import React from "react";
import AddUserForm from "../users/AddUserForm";
import { useRouter } from "next/router";
import PageHeader from "../components/PageHeader/PageHeader";
import Link from "next/link";
import buttonStyle from "../styles/buttonStyle";
import PageContent from "../components/PageContent/PageContent";

const AddUser: React.FC = () => {
  const router = useRouter();
  return (
    <PageContent
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <PageHeader header="Add User">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      <AddUserForm onAfterSubmit={() => router.push("/")} />
    </PageContent>
  );
};

export default AddUser;
