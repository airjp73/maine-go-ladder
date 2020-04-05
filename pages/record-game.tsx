import React from "react";
import AddGameForm from "../games/AddGameForm";
import { useRouter } from "next/router";
import PageHeader from "../components/PageHeader/PageHeader";
import PageContent from "../components/PageContent/PageContent";
import { Theme } from "../styles/theme";
import { css } from "@emotion/core";
import buttonStyle from "../styles/buttonStyle";
import Link from "next/link";

const RecordGame: React.FC = () => {
  const router = useRouter();
  return (
    <PageContent
      css={(theme: Theme) => css`
        padding: 1rem;
        z-index: 1;
      `}
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <PageHeader header="Record Game">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      <AddGameForm onAfterSubmit={() => router.push("/")} />
    </PageContent>
  );
};

export default RecordGame;
