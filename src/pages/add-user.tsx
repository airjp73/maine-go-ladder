import React from "react";
import AddUserForm from "../users/AddUserForm";
import { useRouter } from "next/router";
import Link from "next/link";
import buttonStyle from "../common/styles/buttonStyle";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import { css } from "@emotion/core";

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
      <Content
        css={css`
          padding: 1rem;
        `}
      >
        <AddUserForm onAfterSubmit={() => router.push("/")} />
      </Content>
    </Wrapper>
  );
};

export default AddUser;
