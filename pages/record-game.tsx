import React from "react";
import AddGameForm from "../games/AddGameForm";
import { useRouter } from "next/router";
import { Wrapper, Header } from "../components/PageContent/PageContent";
import buttonStyle from "../styles/buttonStyle";
import Link from "next/link";

const RecordGame: React.FC = () => {
  const router = useRouter();
  return (
    <Wrapper
      initial={{ x: "100%" }}
      animate={{ x: "0" }}
      exit={{ x: "100%", zIndex: 1 }}
    >
      <Header header="Record Game">
        <Link href="/">
          <a css={buttonStyle}>Back</a>
        </Link>
      </Header>
      <AddGameForm
        onAfterSubmit={(black, white) =>
          router.push(`/?updated=${black}&updated=${white}`)
        }
      />
    </Wrapper>
  );
};

export default RecordGame;
