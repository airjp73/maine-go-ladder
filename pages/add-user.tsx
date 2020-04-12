import React from "react";
import AddUserForm from "../users/AddUserForm";
import { useRouter } from "next/router";
import Link from "next/link";
import buttonStyle from "../styles/buttonStyle";
import {
  Wrapper,
  Header,
  Content,
} from "../components/PageContent/PageContent";

const AddUser: React.FC = () => {
  const router = useRouter();
  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Add User">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </Header>
      <Content>
        <AddUserForm onAfterSubmit={() => router.push("/")} />
      </Content>
    </Wrapper>
  );
};

export default AddUser;
