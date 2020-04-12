import React from "react";
import AddGameForm from "../games/AddGameForm";
import { useRouter } from "next/router";
import PageHeader from "../components/PageHeader/PageHeader";
import PageContent from "../components/PageContent/PageContent";
import buttonStyle from "../styles/buttonStyle";
import Link from "next/link";

const RecordGame: React.FC = () => {
  const router = useRouter();
  return (
    <PageContent
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <PageHeader header="Record Game">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </PageHeader>
      <AddGameForm
        onAfterSubmit={(black, white) =>
          router.push(`/?updated=${black}&updated=${white}`)
        }
      />
    </PageContent>
  );
};

export default RecordGame;
