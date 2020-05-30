import React from "react";
import AddUserForm from "../users/AddUserForm";
import { useRouter } from "next/router";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import { css } from "@emotion/core";
import LinkButton from "../common/components/LinkButton/LinkButton";

const AddUser: React.FC = () => {
  const router = useRouter();
  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Add User">
        <LinkButton href="/">Back</LinkButton>
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
