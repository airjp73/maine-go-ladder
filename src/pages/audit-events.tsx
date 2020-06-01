import React from "react";
import {
  Wrapper,
  Header,
  Content,
} from "../common/components/PageContent/PageContent";
import { css } from "@emotion/core";
import LinkButton from "../common/components/LinkButton/LinkButton";

const AuditEvents: React.FC = () => {
  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Change History">
        <LinkButton href="/">Back</LinkButton>
      </Header>
      <Content
        css={css`
          padding: 1rem;
        `}
      >
        <h1>Coming Soon...</h1>
      </Content>
    </Wrapper>
  );
};

export default AuditEvents;
