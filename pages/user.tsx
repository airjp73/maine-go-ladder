import React from "react";
import { useRouter } from "next/router";
import buttonStyle from "../styles/buttonStyle";
import { css } from "@emotion/core";
import PageHeader from "../components/PageHeader/PageHeader";
import Link from "next/link";
import PageContent from "../components/PageContent/PageContent";

const UserPage: React.FC = () => {
  const { query, push } = useRouter();
  return (
    <PageContent
      css={css`
        padding: 1rem;
      `}
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <PageHeader header="Add User">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      {query.userId}
    </PageContent>
  );
};

export default UserPage;
